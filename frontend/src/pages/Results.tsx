import { useLocation, Navigate } from 'react-router-dom';
import AssessmentResults from '../components/AssessmentResults';

const Results = () => {
  const location = useLocation();
  const results = location.state?.results;

  if (!results) {
    // If no results in state, redirect to assessment
    return <Navigate to="/assessment" replace />;
  }

  return (
    <AssessmentResults 
      score={results.independence_score || results.score} 
      companyName={results.company_name || "Your Company"}
      // We could pass more data here if AssessmentResults supports it
    />
  );
};

export default Results;
