import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  
  return {
    user: auth.user,
    firebaseUser: auth.firebaseUser,
    isAuthenticated: auth.isAuthenticated,
    isInitialized: auth.isInitialized,
    isLoading: auth.isLoading,
  };
};

















