import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role;

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      // Redirect to dashboard if user doesn't have the required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If children are provided, render them; otherwise render Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
