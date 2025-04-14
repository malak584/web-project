import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ roles, children }) => {
  const role = localStorage.getItem("role");

  if (!roles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
