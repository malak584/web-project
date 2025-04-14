import LeaveApproval from '../components/manager/LeaveApproval';
import DepartmentAssignment from '../components/manager/DepartmentAssignment';
import ContractManager from '../components/manager/ContractManager';
import JobApplications from '../components/manager/JobApplications';

const ManagerDashboard = () => (
  <div className="p-6 space-y-4">
    <h1 className="text-3xl font-bold">Manager Dashboard</h1>
    <JobApplications />
    <LeaveApproval />
    <DepartmentAssignment />
    <ContractManager />
  </div>
);

export default ManagerDashboard;