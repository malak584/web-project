import LeaveRequestForm from '../components/employee/LeaveRequestForm';
import PersonalInfoForm from '../components/employee/PersonalInfoForm';
import MyLeaveRequests from '../components/employee/MyLeaveRequests';



const EmployeeDashboard = () => (
  <div className="p-6 space-y-4">
    <h1 className="text-3xl font-bold">Employee Dashboard</h1>
    <LeaveRequestForm />
    <PersonalInfoForm />
    <MyLeaveRequests /> 
  </div>
);

export default EmployeeDashboard;
