import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute - user:', user, 'allowedRoles:', allowedRoles, 'isLoading:', isLoading);

  // Show loading while authentication state is being determined
  if (isLoading) {
    console.log('ProtectedRoute - showing loading spinner');
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('ProtectedRoute - not authenticated, redirecting to login');
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('ProtectedRoute - not authorized, redirecting to not-found. User role:', user?.role, 'Allowed roles:', allowedRoles);
    return <Navigate to="/not-found" replace />;
  }

  console.log('ProtectedRoute - access granted, rendering children');
  return children;
};

export default ProtectedRoute;
