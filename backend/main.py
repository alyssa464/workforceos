from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import subprocess
import json
import os

from scoring import compute_all_scores
from role_routes import router as role_router

app = FastAPI(title="WorkforceOS API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models based on Lead's requirements
class KeyPersonRisk(BaseModel):
    role: str
    criticality: int # 1-10

class AssessmentResponses(BaseModel):
    founder_approval_percentage: int
    documented_processes: int
    role_redundancy: bool
    decision_distribution: str # centralized, hybrid, decentralized
    training_readiness: str # none, partial, full
    key_person_risk: List[KeyPersonRisk]
    customer_handoff_documented: bool
    onboarding_sop_exists: bool
    cross_training_in_place: bool
    founder_involvement_in_ops: bool

class AssessmentInput(BaseModel):
    companyName: str
    teamSize: int
    roles: List[str]
    responses: AssessmentResponses

def query_team_db(sql: str):
    """Utility to execute SQL via team-db CLI."""
    try:
        # team-db expects the SQL as a single quoted argument
        result = subprocess.run(
            ['team-db', sql],
            capture_output=True,
            text=True,
            check=True
        )
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return result.stdout
    except subprocess.CalledProcessError as e:
        return {"error": str(e), "stderr": e.stderr}

# Initialize Database
def init_db():
    query_team_db("""
    CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        results_json TEXT,
        raw_data_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    # Ensure roles table has new columns
    query_team_db("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, parent_id INTEGER, dependency_score INTEGER, status TEXT, department TEXT, description TEXT)")
    
    # Check if columns exist (simple way: try to add them, team-db/sqlite might error if already exists, we catch it)
    try: query_team_db("ALTER TABLE roles ADD COLUMN department TEXT")
    except: pass
    try: query_team_db("ALTER TABLE roles ADD COLUMN description TEXT")
    except: pass
    try: query_team_db("ALTER TABLE roles ADD COLUMN dependency_score INTEGER")
    except: pass

    query_team_db("""
    CREATE TABLE IF NOT EXISTS knowledge_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_id INTEGER,
        type TEXT,
        title TEXT,
        content TEXT,
        tags TEXT, -- JSON string
        source TEXT,
        captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
    )
    """)

init_db()

# Include Routers
app.include_router(role_router)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "WorkforceOS FastAPI Backend"}

@app.post("/api/assessment/score")
async def score_assessment(input_data: AssessmentInput):
    try:
        # 1. Compute scores using the scoring engine
        data_dict = input_data.model_dump()
        results = compute_all_scores(data_dict)
        
        # 2. Persist to team-db
        raw_data_json = input_data.model_dump_json()
        
        sql = f"""
        INSERT INTO assessments (company_name, results_json, raw_data_json)
        VALUES (
            '{input_data.companyName.replace("'", "''")}', 
            '{json.dumps(results).replace("'", "''")}', 
            '{raw_data_json.replace("'", "''")}'
        )
        """
        query_team_db(sql)
        return results
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/assessment/{assessment_id}")
async def get_assessment(assessment_id: int):
    sql = f"SELECT * FROM assessments WHERE id = {assessment_id}"
    res = query_team_db(sql)
    
    if not res or not isinstance(res, list) or len(res) == 0:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    row = res[0]
    return {
        "id": row.get('id'),
        "company_name": row.get('company_name'),
        "results": json.loads(row.get('results_json', '{}')),
        "created_at": row.get('created_at')
    }

@app.get("/api/assessments")
async def list_assessments():
    sql = "SELECT id, company_name, created_at FROM assessments ORDER BY created_at DESC"
    return query_team_db(sql)

@app.get("/api/tasks")
async def get_tasks():
    return query_team_db("SELECT * FROM tasks")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
