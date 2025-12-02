/**
 * Authentication Service
 * 
 * Centralized service for handling authentication operations
 * Communicates with Firebase and backend API
 */

import { auth } from '@/core/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { User } from '@/features/auth/store/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Get Firebase ID token for the current user
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

/**
 * Refresh Firebase ID token
 */
export const refreshIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const token = await user.getIdToken(true); // Force refresh
    return token;
  } catch (error) {
    console.error('Error refreshing ID token:', error);
    return null;
  }
};

/**
 * Call backend login endpoint
 * This syncs the Firebase user with MongoDB
 */
export const syncWithBackend = async (
  idToken: string,
  additionalData?: { name?: string; role?: string }
): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(additionalData || {}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Backend error: ${response.status}`);
    }

    const data = await response.json();
    const userData = data.data?.user || data.user;

    if (!userData) {
      throw new Error('No user data received from backend');
    }

    return {
      uid: userData.uid,
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role,
      image: userData.image,
    };
  } catch (error) {
    console.error('Error syncing with backend:', error);
    throw error;
  }
};

/**
 * Get current user from backend
 */
export const getCurrentUserFromBackend = async (): Promise<User | null> => {
  try {
    const idToken = await getIdToken();
    if (!idToken) return null;

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const userData = data.user;

    if (!userData) {
      return null;
    }

    return {
      uid: userData.uid,
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role,
      image: userData.image,
    };
  } catch (error) {
    console.error('Error getting current user from backend:', error);
    return null;
  }
};

/**
 * Refresh user data from backend
 */
export const refreshUserData = async (): Promise<User | null> => {
  try {
    const idToken = await refreshIdToken();
    if (!idToken) return null;

    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const userData = data.user;

    if (!userData) {
      return null;
    }

    return {
      uid: userData.uid,
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role,
      image: userData.image,
    };
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return null;
  }
};

/**
 * Login with email and password
 */
export const loginWithEmailPassword = async (
  email: string,
  password: string
): Promise<{ firebaseUser: FirebaseUser; user: User }> => {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get ID token
    const idToken = await firebaseUser.getIdToken();

    // Sync with backend
    const user = await syncWithBackend(idToken);

    return { firebaseUser, user };
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle Firebase auth errors
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled');
    }
    
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmailPassword = async (
  email: string,
  password: string,
  name?: string
): Promise<{ firebaseUser: FirebaseUser; user: User }> => {
  try {
    // Create user with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update profile with name if provided
    if (name) {
      await updateProfile(firebaseUser, { displayName: name });
    }

    // Send email verification
    await sendEmailVerification(firebaseUser);

    // Get ID token
    const idToken = await firebaseUser.getIdToken();

    // Sync with backend
    const user = await syncWithBackend(idToken, { name });

    return { firebaseUser, user };
  } catch (error: any) {
    console.error('Sign up error:', error);

    // Handle Firebase auth errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters');
    }

    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<{ firebaseUser: FirebaseUser; user: User }> => {
  try {
    // Pre-sign-in cleanup: If there's no current user but there's stale Firebase state, clear it
    if (!auth.currentUser) {
      // Check if there's stale Firebase data in localStorage
      let hasStaleData = false;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('firebase:authUser:')) {
          hasStaleData = true;
          break;
        }
      }
      
      if (hasStaleData) {
        console.log('🔵 Found stale Firebase auth data, clearing before sign-in...');
        await clearFirebaseAuthState();
        // Small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    const provider = new GoogleAuthProvider();
    
    // Add required scopes
    provider.addScope('profile');
    provider.addScope('email');
    
    // Set custom parameters - always prompt for account selection
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    // Sign in with Google popup
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Get ID token
    const idToken = await firebaseUser.getIdToken();

    // Sync with backend
    const user = await syncWithBackend(idToken);

    return { firebaseUser, user };
  } catch (error: any) {
    console.error('Google sign-in error:', error);

    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked. Please allow popups for this site');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in cancelled');
    }

    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);

    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }

    throw error;
  }
};

/**
 * Send email verification
 */
export const sendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }

  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    console.error('Email verification error:', error);
    throw error;
  }
};

/**
 * Clear all Firebase auth state from localStorage and IndexedDB
 * This ensures a clean slate for subsequent sign-ins
 */
export const clearFirebaseAuthState = async (): Promise<void> => {
  console.log('🔵 Clearing Firebase auth state...');
  
  // Clear Firebase keys from localStorage
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('firebase:')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`✅ Removed localStorage key: ${key}`);
    } catch (e) {
      console.warn(`Could not remove localStorage key: ${key}`, e);
    }
  });
  
  // Clear Firebase IndexedDB databases
  const firebaseDBNames = [
    'firebaseLocalStorageDb',
    'firebase-heartbeat-database',
    'firebase-installations-database',
  ];
  
  for (const dbName of firebaseDBNames) {
    try {
      const deleteRequest = indexedDB.deleteDatabase(dbName);
      await new Promise<void>((resolve, reject) => {
        deleteRequest.onsuccess = () => {
          console.log(`✅ Deleted IndexedDB: ${dbName}`);
          resolve();
        };
        deleteRequest.onerror = () => {
          console.warn(`Could not delete IndexedDB: ${dbName}`);
          resolve(); // Don't reject, just continue
        };
        deleteRequest.onblocked = () => {
          console.warn(`IndexedDB deletion blocked: ${dbName}`);
          resolve(); // Don't reject, just continue
        };
      });
    } catch (e) {
      console.warn(`Error deleting IndexedDB ${dbName}:`, e);
    }
  }
  
  console.log('✅ Firebase auth state cleared');
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  try {
    // Notify backend about logout
    const idToken = await getIdToken();
    if (idToken) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });
      } catch (error) {
        console.error('Error notifying backend about logout:', error);
        // Continue with sign out even if backend call fails
      }
    }

    // Sign out from Firebase
    await firebaseSignOut(auth);
    
    // Clear all Firebase auth state to prevent stale data issues
    await clearFirebaseAuthState();
  } catch (error) {
    console.error('Sign out error:', error);
    // Even on error, try to clear Firebase state
    try {
      await clearFirebaseAuthState();
    } catch (cleanupError) {
      console.warn('Error during Firebase cleanup:', cleanupError);
    }
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

/**
 * Get current Firebase user
 */
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Debug utility to check current authentication state
 * Logs detailed information about Firebase auth and token status
 */
export const debugAuthState = async (): Promise<{
  hasFirebaseUser: boolean;
  email: string | null;
  emailVerified: boolean;
  uid: string | null;
  hasToken: boolean;
  tokenExpiry: Date | null;
  provider: string | null;
}> => {
  const user = auth.currentUser;
  
  console.log('=== 🔐 Auth Debug Info ===');
  
  if (!user) {
    console.log('❌ No Firebase user currently logged in');
    console.log('💡 Possible causes:');
    console.log('   - User has not signed in');
    console.log('   - Firebase auth has not finished initializing');
    console.log('   - Session was cleared or expired');
    
    return {
      hasFirebaseUser: false,
      email: null,
      emailVerified: false,
      uid: null,
      hasToken: false,
      tokenExpiry: null,
      provider: null,
    };
  }
  
  console.log('✅ Firebase user found:');
  console.log(`   Email: ${user.email}`);
  console.log(`   UID: ${user.uid}`);
  console.log(`   Email Verified: ${user.emailVerified}`);
  console.log(`   Provider: ${user.providerData[0]?.providerId || 'unknown'}`);
  
  let hasToken = false;
  let tokenExpiry: Date | null = null;
  
  try {
    const token = await user.getIdToken();
    hasToken = !!token;
    
    if (token) {
      // Decode token to get expiry (JWT tokens have expiry in payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      tokenExpiry = new Date(payload.exp * 1000);
      
      const now = new Date();
      const isExpired = tokenExpiry < now;
      const timeToExpiry = Math.round((tokenExpiry.getTime() - now.getTime()) / 1000 / 60);
      
      console.log(`   Token Valid: ${!isExpired}`);
      console.log(`   Token Expires: ${tokenExpiry.toLocaleString()}`);
      console.log(`   Time to Expiry: ${isExpired ? 'EXPIRED' : `${timeToExpiry} minutes`}`);
      console.log('✅ Token retrieved successfully');
    }
  } catch (error) {
    console.error('❌ Failed to get ID token:', error);
    hasToken = false;
  }
  
  console.log('========================');
  
  return {
    hasFirebaseUser: true,
    email: user.email,
    emailVerified: user.emailVerified,
    uid: user.uid,
    hasToken,
    tokenExpiry,
    provider: user.providerData[0]?.providerId || null,
  };
};

/**
 * Helper function to handle authentication errors with user-friendly messages
 */
export const getAuthErrorMessage = (error: any): string => {
  const code = error?.code || error?.data?.code;
  
  const errorMessages: Record<string, string> = {
    // Firebase Auth Errors
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/popup-closed-by-user': 'Sign-in cancelled',
    'auth/popup-blocked': 'Popup blocked. Please allow popups for this site',
    'auth/cancelled-popup-request': 'Sign-in cancelled',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/id-token-expired': 'Your session has expired. Please sign in again',
    'auth/id-token-revoked': 'Your session was revoked. Please sign in again',
    
    // Backend API Errors
    'TOKEN_EXPIRED': 'Your session has expired. Please sign in again',
    'TOKEN_REVOKED': 'Your session was revoked. Please sign in again',
    'INVALID_TOKEN': 'Invalid authentication. Please sign in again',
    'EMAIL_NOT_VERIFIED': 'Please verify your email before continuing',
    'ACCOUNT_LOCKED': 'Account locked due to multiple failed login attempts',
  };
  
  return errorMessages[code] || error?.message || 'An unexpected error occurred';
};

export default {
  getIdToken,
  refreshIdToken,
  syncWithBackend,
  getCurrentUserFromBackend,
  refreshUserData,
  loginWithEmailPassword,
  signUpWithEmailPassword,
  signInWithGoogle,
  sendPasswordReset,
  sendVerificationEmail,
  signOut,
  clearFirebaseAuthState,
  isAuthenticated,
  getCurrentFirebaseUser,
  debugAuthState,
  getAuthErrorMessage,
};


