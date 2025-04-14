import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import JobListings from './pages/JobListings';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignUp from './pages/SignUp';
import JobApplication from './pages/JobApplication';
import './styles/Global.css';



function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/apply/:jobId" element={<JobApplication />} />


        {/* Dashboards protected by role */}
        <Route 
          path="/manager" 
          element={
            <ProtectedRoute roles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/hr" 
          element={
            <ProtectedRoute roles={["hr"]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute roles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
