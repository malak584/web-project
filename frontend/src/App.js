import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import JobListings from './pages/JobListings';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SignUp from './pages/SignUp';
import JobApplication from './pages/JobApplication';
import AttendanceReport from './pages/AttendanceReport';

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

        {/* Dashboards (no longer protected) */}
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        
        {/* Attendance Report */}
        <Route path="/attendance-report" element={<AttendanceReport />} />

      </Routes>
    </Router>
  );
}

export default App;
