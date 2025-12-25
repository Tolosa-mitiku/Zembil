import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/core/constants';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isInitialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    // Pass the current location so we can redirect back after login
    return <Navigate to="/signup" replace state={{ returnTo: location.pathname, tab: 'signin' }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                         user.role === 'seller' ? '/seller/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

