import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex-center bg-bg-soft">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    // Role not authorized, redirect to their own dashboard or login if no role found
    if (userRole) {
      return <Navigate to={`/portal/${userRole}`} replace />;
    }
    // If logged in but no role found in Firestore, they shouldn't be in the portal
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
