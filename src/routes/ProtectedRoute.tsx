import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  isAuthenticated?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false, isAuthenticated }: ProtectedRouteProps) => {
  const authState = useSelector((state: RootState) => state.auth);
  const authIsAuthenticated = isAuthenticated !== undefined ? isAuthenticated : authState.isAuthenticated;
  const authUser = isAuthenticated !== undefined ? null : authState.user;
  const location = useLocation();

  if (!authIsAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && authUser?.email !== 'admin@stremly.ai') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
