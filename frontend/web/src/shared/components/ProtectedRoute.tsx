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

  // Debug logging for protected routes
  console.log('🛡️ ProtectedRoute check:', {
    path: location.pathname,
    isInitialized,
    isAuthenticated,
    userRole: user?.role || 'none',
    allowedRoles: allowedRoles || ['any'],
  });

  if (!isInitialized) {
    console.log('⏳ Auth not initialized, showing loading...');
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    console.log('🔒 User not authenticated, redirecting to login...');
    // Pass the current location so we can redirect back after login
    return <Navigate to="/signup" replace state={{ returnTo: location.pathname, tab: 'signin' }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`⚠️ User role '${user.role}' not allowed, redirecting...`);
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                         user.role === 'seller' ? '/seller/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;

