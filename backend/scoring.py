import json

def calculate_founder_bottleneck_index(responses):
    """
    Founder Bottleneck Index (0-100%) - based on:
    - % of approvals requiring founder
    - % of decisions requiring founder
    - Whether founder is involved in daily ops
    Higher = worse
    """
    approval_pct = responses.get('founder_approval_percentage', 0)
    
    # Map decision distribution to a score
    distribution_map = {
        "centralized": 100,
        "hybrid": 50,
        "decentralized": 0
    }
    decision_pct = distribution_map.get(responses.get('decision_distribution'), 100)
    
    ops_involvement = 100 if responses.get('founder_involvement_in_ops') else 0
    
    # Algorithm: 40% approvals, 30% decisions, 30% daily ops
    index = (approval_pct * 0.4) + (decision_pct * 0.3) + (ops_involvement * 0.3)
    return round(index, 1)

def calculate_role_dependency_score(role_name, criticality, global_responses):
    """
    Company Dependency Score per role - based on:
    - Criticality rating (1-10)
    - Whether cross-training exists
    - Whether SOPs are documented
    - Whether someone else can step in
    """
    # Base score from criticality (0-100)
    base_score = criticality * 10
    
    # Multipliers/Modifiers (0 = good for system, 1 = bad for system)
    cross_training_mod = 0 if global_responses.get('cross_training_in_place') else 1
    sop_mod = 0 if global_responses.get('onboarding_sop_exists') else 1
    redundancy_mod = 0 if global_responses.get('role_redundancy') else 1
    
    # Algorithm: 60% criticality, 40% systemic risk factors
    systemic_risk = (cross_training_mod * 0.4 + sop_mod * 0.4 + redundancy_mod * 0.2) * 100
    
    score = (base_score * 0.6) + (systemic_risk * 0.4)
    return round(min(100, score), 1)

def get_level(score):
    if score >= 80: return "critical"
    if score >= 50: return "warning"
    return "healthy"

def calculate_documentation_maturity(responses):
    # Coverage percentage
    coverage = responses.get('documented_processes', 0)
    handoff = 100 if responses.get('customer_handoff_documented') else 0
    sop = 100 if responses.get('onboarding_sop_exists') else 0
    
    # Algorithm: 50% coverage, 25% handoff, 25% sop
    score = (coverage * 0.5) + (handoff * 0.25) + (sop * 0.25)
    return round(score, 1)

def calculate_operational_valuation_score(responses):
    """
    Operational Valuation Score (0-100) - based on:
    - Documentation coverage
    - Process maturity
    - Training readiness
    - Role redundancy
    """
    doc_coverage = responses.get('documented_processes', 0)
    
    training_map = {
        "none": 0,
        "partial": 50,
        "full": 100
    }
    training_score = training_map.get(responses.get('training_readiness'), 0)
    
    redundancy_score = 100 if responses.get('role_redundancy') else 0
    
    # Process maturity is a composite of SOPs and Handoffs
    maturity = (100 if responses.get('onboarding_sop_exists') else 0) * 0.5 + \
               (100 if responses.get('customer_handoff_documented') else 0) * 0.5
    
    score = (doc_coverage * 0.4) + (maturity * 0.2) + (training_score * 0.2) + (redundancy_score * 0.2)
    return round(score, 1)

def compute_all_scores(data):
    company_name = data.get('companyName', 'Unknown')
    responses = data.get('responses', {})
    roles_list = data.get('roles', [])
    
    # 1. Founder Bottleneck Index
    bottleneck_index = calculate_founder_bottleneck_index(responses)
    
    # 2. Documentation Maturity
    doc_maturity = calculate_documentation_maturity(responses)
    
    # 3. Key Person Dependency (Composite for the org)
    key_risks = responses.get('key_person_risk', [])
    if key_risks:
        avg_crit = sum(r.get('criticality', 5) for r in key_risks) / len(key_risks)
    else:
        avg_crit = 5
        
    # Org-wide dependency risk is inverse of independence
    # We'll use the average role dependency score for the org-wide metric
    
    # 4. Company Dependency Scores per Role
    dependency_scores = []
    key_risk_map = {r.get('role'): r.get('criticality') for r in key_risks}
    
    for role_name in roles_list:
        crit = key_risk_map.get(role_name, 5) # Default to 5 if not specified
        score = calculate_role_dependency_score(role_name, crit, responses)
        dependency_scores.append({
            "role": role_name,
            "score": score,
            "level": get_level(score)
        })
    
    # 5. Decision Distribution Score (for Independence Score)
    dist_map = {
        "centralized": 0,
        "hybrid": 50,
        "decentralized": 100
    }
    decision_dist_score = dist_map.get(responses.get('decision_distribution'), 0)
    
    # 6. Organizational Independence Score (0-100)
    # Independence from Founder is (100 - Index)
    independence_from_founder = 100 - bottleneck_index
    
    # Org-wide Key Person Independence (inverse of avg risk)
    if dependency_scores:
        avg_dependency = sum(r['score'] for r in dependency_scores) / len(dependency_scores)
    else:
        avg_dependency = 50
    org_key_person_independence = 100 - avg_dependency
    
    # Weights: 30% Founder, 25% Docs, 25% Key Person, 20% Decision
    org_independence_score = (
        (independence_from_founder * 0.3) +
        (doc_maturity * 0.25) +
        (org_key_person_independence * 0.25) +
        (decision_dist_score * 0.2)
    )
    org_independence_score = round(max(0, min(100, org_independence_score)), 1)
    
    # 7. Operational Valuation Score
    op_valuation_score = calculate_operational_valuation_score(responses)
    
    # 8. Critical Roles
    critical_roles = [r['role'] for r in dependency_scores if r['level'] == 'critical']
    
    # 9. Interpretation
    if org_independence_score < 40:
        interpretation = "Your company is highly person-dependent. Operational risk is extreme if key members leave."
    elif org_independence_score < 70:
        interpretation = "Your company has moderate system dependency but still relies heavily on individual knowledge."
    else:
        interpretation = "Your company is system-dependent. It can likely scale and survive key departures with minimal disruption."
        
    # 10. Recommendations
    recommendations = []
    if bottleneck_index > 60:
        recommendations.append("Distribute decision-making away from the founder to reduce the bottleneck.")
    if doc_maturity < 50:
        recommendations.append("Prioritize process documentation — aim for 70% coverage of core workflows.")
    if not responses.get('onboarding_sop_exists'):
        recommendations.append("Create onboarding SOPs to reduce the 'time-to-value' for new hires.")
    for role in critical_roles:
        recommendations.append(f"Document the {role} role — create SOPs for all critical processes to mitigate dependency.")
        
    return {
        "organizationalIndependenceScore": org_independence_score,
        "founderBottleneckIndex": bottleneck_index,
        "companyDependencyScores": dependency_scores,
        "operationalValuationScore": op_valuation_score,
        "criticalRoles": critical_roles,
        "interpretation": interpretation,
        "recommendations": recommendations
    }
