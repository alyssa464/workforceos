import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import DependencyMap from './pages/DependencyMap';
import KnowledgeCapture from './pages/KnowledgeCapture';
import RoleProfile from './pages/RoleProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="results" element={<Results />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dependency-map" element={<DependencyMap />} />
          <Route path="knowledge" element={<KnowledgeCapture />} />
          <Route path="role/:id" element={<RoleProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
