import { scoreAssessment } from './api';

export const transformAndScore = async (answers: Record<string, number>, companyName: string = "My Company") => {
  // Mapping logic based on lead's instructions and questionnaire IDs
  const responses = {
    founder_approval_percentage: 50,
    documented_processes: 50,
    role_redundancy: false,
    decision_distribution: "hybrid",
    training_readiness: "partial",
    key_person_risk: [] as any[],
    customer_handoff_documented: false,
    onboarding_sop_exists: false,
    cross_training_in_place: false,
    founder_involvement_in_ops: true,
  };

  // 1. Founder Approval & Decision Distribution
  const dm = answers['decision_making'] || 40;
  if (dm <= 10) {
    responses.founder_approval_percentage = 95;
    responses.decision_distribution = "centralized";
  } else if (dm <= 40) {
    responses.founder_approval_percentage = 70;
    responses.decision_distribution = "hybrid";
  } else if (dm <= 70) {
    responses.founder_approval_percentage = 30;
    responses.decision_distribution = "hybrid";
  } else {
    responses.founder_approval_percentage = 5;
    responses.decision_distribution = "decentralized";
  }

  // 2. Founder Involvement in Ops
  const fa = answers['founder_absence'] || 40;
  responses.founder_involvement_in_ops = fa < 50;

  // 3. Documented Processes
  const doc = answers['documentation_maturity'] || 40;
  if (doc <= 10) responses.documented_processes = 15;
  else if (doc <= 40) responses.documented_processes = 35;
  else if (doc <= 70) responses.documented_processes = 65;
  else responses.documented_processes = 90;

  // 4. Role Redundancy & Training Readiness
  const st = answers['successor_training'] || 40;
  if (st <= 10) {
    responses.role_redundancy = false;
    responses.training_readiness = "none";
  } else if (st <= 40) {
    responses.role_redundancy = false;
    responses.training_readiness = "partial";
  } else if (st <= 70) {
    responses.role_redundancy = true;
    responses.training_readiness = "partial";
  } else {
    responses.role_redundancy = true;
    responses.training_readiness = "full";
  }

  // 5. SOPs & Handoffs
  const mr = answers['mistake_response'] || 40;
  responses.onboarding_sop_exists = mr > 50;
  
  const os = answers['onboarding_speed'] || 40;
  responses.customer_handoff_documented = os > 50;

  // 6. Cross Training
  const kpr = answers['key_person_replacement'] || 40;
  responses.cross_training_in_place = kpr > 50;
  
  // Add a generic key person risk if replacement is hard
  if (kpr < 50) {
    responses.key_person_risk.push({
      role: "Key Operator",
      criticality: 9
    });
  }

  const payload = {
    companyName,
    teamSize: 10, // Default for now
    roles: ["CEO", "Ops Manager", "Sales Lead"], // Default list
    responses
  };

  return await scoreAssessment(payload);
};
