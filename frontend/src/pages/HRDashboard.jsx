import AddEmployeeForm from '../components/hr/AddEmployeeForm';
import AttendanceReport from '../components/hr/AttendanceReport';
import EvaluateCandidates from '../components/hr/EvaluateCandidates';


const HRDashboard = () => (
  <div className="p-6 space-y-4">
    <h1 className="text-3xl font-bold">HR Dashboard</h1>
    <AddEmployeeForm />
    <AttendanceReport />
    <EvaluateCandidates />
  </div>
);

export default HRDashboard;