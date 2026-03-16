import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Loading from '../components/common/Loading';

const ProtectedRoute = ({ children, requireAdmin = false, requireRestaurant = false }) => {
  const { isAuthenticated, loading, isAdmin, isRestaurant } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requireAdmin && !isAdmin) {
    // If admin required but not admin, redirect to appropriate dashboard
    if (isRestaurant) {
      return <Navigate to="/dashboard" replace />;
    }
    // If not admin and not restaurant, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requireRestaurant && !isRestaurant) {
    // If restaurant required but not restaurant, redirect to appropriate dashboard
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // If not restaurant and not admin, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

