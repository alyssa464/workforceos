from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import subprocess

router = APIRouter()

def query_team_db(sql: str):
    """Utility to execute SQL via team-db CLI."""
    try:
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

class KnowledgeItemInput(BaseModel):
    role_id: Optional[int] = None
    type: str
    title: str
    content: str
    tags: List[str] = []
    source: str = "manual"

class RoleCreate(BaseModel):
    name: str
    department: str
    description: str
    dependency_score: int = 50
    parent_id: Optional[int] = None

@router.get("/api/roles")
async def list_roles():
    roles = query_team_db("SELECT * FROM roles")
    if not roles or (isinstance(roles, list) and len(roles) == 0):
        # Seed default roles
        defaults = [
            ("CEO", "Executive", "Chief Executive Officer", 10, None),
            ("COO", "Operations", "Chief Operating Officer", 60, 1),
            ("CMO", "Marketing", "Chief Marketing Officer", 50, 1),
            ("Sales Manager", "Sales", "Manages the sales team", 70, 1),
            ("CSM", "Customer Success", "Customer Success Manager", 40, 2),
            ("Media Buyer", "Marketing", "Handles ad placements", 80, 3),
            ("Copywriter", "Marketing", "Writes marketing copy", 30, 3),
            ("VA", "Operations", "Virtual Assistant", 90, 2),
            ("Project Manager", "Operations", "Manages projects", 60, 2),
            ("Account Manager", "Sales", "Manages client accounts", 50, 4)
        ]
        for name, dept, desc, score, parent in defaults:
            parent_val = "NULL" if parent is None else parent
            query_team_db(f"INSERT INTO roles (name, department, description, dependency_score, parent_id) VALUES ('{name}', '{dept}', '{desc}', {score}, {parent_val})")
        roles = query_team_db("SELECT * FROM roles")
    return roles

@router.post("/api/roles")
async def create_role(role: RoleCreate):
    parent_val = "NULL" if role.parent_id is None else role.parent_id
    sql = f"""
    INSERT INTO roles (name, department, description, dependency_score, parent_id)
    VALUES ('{role.name.replace("'", "''")}', '{role.department.replace("'", "''")}', '{role.description.replace("'", "''")}', {role.dependency_score}, {parent_val})
    """
    res = query_team_db(sql)
    return {"status": "success", "data": res}

@router.get("/api/roles/{role_id}")
async def get_role(role_id: int):
    role_res = query_team_db(f"SELECT * FROM roles WHERE id = {role_id}")
    if not role_res or len(role_res) == 0:
        raise HTTPException(status_code=404, detail="Role not found")
    
    role = role_res[0]
    
    # Coverage stats
    items = query_team_db(f"SELECT count(*) as count FROM knowledge_items WHERE role_id = {role_id}")
    role['knowledge_count'] = items[0]['count'] if items else 0
    
    return role

@router.post("/api/knowledge")
async def add_knowledge(item: KnowledgeItemInput):
    if not item.role_id:
        raise HTTPException(status_code=400, detail="role_id is required")
    
    tags_json = json.dumps(item.tags)
    sql = f"""
    INSERT INTO knowledge_items (role_id, type, title, content, tags, source)
    VALUES ({item.role_id}, '{item.type}', '{item.title.replace("'", "''")}', '{item.content.replace("'", "''")}', '{tags_json}', '{item.source}')
    """
    query_team_db(sql)
    return {"status": "success"}

@router.post("/api/roles/{role_id}/knowledge")
async def add_knowledge_to_role(role_id: int, item: KnowledgeItemInput):
    tags_json = json.dumps(item.tags)
    sql = f"""
    INSERT INTO knowledge_items (role_id, type, title, content, tags, source)
    VALUES ({role_id}, '{item.type}', '{item.title.replace("'", "''")}', '{item.content.replace("'", "''")}', '{tags_json}', '{item.source}')
    """
    query_team_db(sql)
    return {"status": "success"}

@router.get("/api/roles/{role_id}/knowledge")
async def list_role_knowledge(role_id: int):
    return query_team_db(f"SELECT * FROM knowledge_items WHERE role_id = {role_id}")

@router.delete("/api/roles/{role_id}/knowledge/{item_id}")
async def delete_knowledge_from_role(role_id: int, item_id: int):
    query_team_db(f"DELETE FROM knowledge_items WHERE id = {item_id} AND role_id = {role_id}")
    return {"status": "success"}

@router.delete("/api/knowledge/{item_id}")
async def delete_knowledge(item_id: int):
    query_team_db(f"DELETE FROM knowledge_items WHERE id = {item_id}")
    return {"status": "success"}

@router.get("/api/knowledge")
async def list_all_knowledge(role_id: Optional[int] = None):
    # Backward compatibility and general fetch
    if role_id:
        items = query_team_db(f"SELECT * FROM knowledge_items WHERE role_id = {role_id}")
    else:
        items = query_team_db("SELECT * FROM knowledge_items")
    
    # Also include old knowledge table items if they exist and haven't been migrated
    old_items = []
    try:
        old_sql = "SELECT id, role_id, content_type as type, title, content, captured_at FROM knowledge"
        if role_id:
            old_sql += f" WHERE role_id = {role_id}"
        old_items = query_team_db(old_sql)
    except:
        pass
    
    if isinstance(old_items, list):
        # Add a flag or just merge
        for item in old_items:
            item['source'] = 'legacy'
            item['tags'] = '[]'
        return (items or []) + old_items
    
    return items or []
