import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from '@/core/firebase/config';
import { UserRole } from '@/core/constants';
import { safeToast as toast } from '@/core/utils/toast-wrapper';
import { api } from '@/core/http/api';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    return new Promise<FirebaseUser | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get the ID token to send to backend
            const idToken = await firebaseUser.getIdToken();
            
            // Call backend /login endpoint to get user info
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://zembil.vercel.app/api/v1'}/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
              },
              body: JSON.stringify({ idToken }),
            });

            if (response.ok) {
              const data = await response.json();
              console.log('Init auth - Backend response:', data);
              
              const userData = data.data?.user || data.user || data;
              console.log('Init auth - User data:', userData);
              console.log('Init auth - User role:', userData?.role);
              
              // Set user regardless of role (buyers, sellers, and admins all need auth)
              if (userData) {
                dispatch(setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: userData?.name || firebaseUser.displayName || '',
                  role: userData?.role,
                  image: userData?.image || firebaseUser.photoURL || undefined,
                }));
              } else {
                console.log('No user data, signing out');
                await firebaseSignOut(auth);
              }
            }
          } catch (error) {
            console.error('Error initializing auth:', error);
          }
        }
        resolve(firebaseUser);
        unsubscribe();
      });
    });
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Call backend /login endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://zembil.vercel.app/api/v1'}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response.json();
      const userData = data.data?.user || data.user;

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || firebaseUser.displayName || '',
        role: userData.role,
        image: userData.image || firebaseUser.photoURL || undefined,
      };

      toast.success(`Welcome back, ${user.name}!`);
      return user;
    } catch (error: any) {
      // Suppress the "Cannot assign to read only property 'operations'" error
      // This is a known Firebase issue with HMR that doesn't affect functionality
      if (error.message?.includes('read only property') || error.message?.includes('operations')) {
        console.log('⚠️ Suppressed Firebase HMR error during login - this is harmless');
        // Don't show toast for this error, just reject silently
        return rejectWithValue('SUPPRESSED_ERROR');
      }
      
      const message = error.message || 'Failed to login';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, name, role }: { email: string; password: string; name?: string; role?: string }, { rejectWithValue }) => {
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile with name if provided
      if (name) {
        await updateProfile(firebaseUser, { displayName: name });
      }
      
      // Get ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Call backend /login endpoint (which creates user if not exists)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://zembil.vercel.app/api/v1'}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ idToken, role: role || 'seller' }), // Pass role to backend
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      console.log('SignUp - Backend response:', data);
      
      const userData = data.data?.user || data.user || data;
      console.log('SignUp - User data:', userData);

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || name || firebaseUser.displayName || '',
        role: userData.role,
        image: userData.image || firebaseUser.photoURL || undefined,
      };

      toast.success(`Welcome to Zembil!`);
      return user;
    } catch (error: any) {
      // Suppress the "Cannot assign to read only property 'operations'" error
      // This is a known Firebase issue with HMR that doesn't affect functionality
      if (error.message?.includes('read only property') || error.message?.includes('operations')) {
        console.log('⚠️ Suppressed Firebase HMR error during signup - this is harmless');
        // Don't show toast for this error, just reject silently
        return rejectWithValue('SUPPRESSED_ERROR');
      }
      
      const message = error.message || 'Failed to sign up';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔵 Starting Google sign-in...');
      
      // Set persistence to LOCAL
      await setPersistence(auth, browserLocalPersistence);
      
      const provider = new GoogleAuthProvider();
      
      // Add required scopes
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Sign in with Google popup
      console.log('🔵 Opening Google popup...');
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      console.log('✅ Google popup successful, user:', firebaseUser.email);
      
      // Get ID token
      console.log('🔵 Getting Firebase ID token...');
      const idToken = await firebaseUser.getIdToken();
      console.log('✅ Got ID token (length):', idToken.length);
      
      // Call backend /login endpoint
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://zembil.vercel.app/api/v1';
      console.log('🔵 Calling backend API:', `${apiUrl}/login`);
      
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ idToken }),
      });

      console.log('📡 Backend response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend error:', errorData);
        throw new Error(errorData.message || `Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Google SignIn - Backend response:', data);
      
      const userData = data.data?.user || data.user || data;
      console.log('✅ Google SignIn - User data:', userData);

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || firebaseUser.displayName || '',
        role: userData.role,
        image: userData.image || firebaseUser.photoURL || undefined,
      };

      console.log('✅ Login successful:', user.email, 'Role:', user.role);
      toast.success(`Welcome, ${user.name}!`);
      return user;
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      
      // Suppress the "Cannot assign to read only property 'operations'" error
      // This is a known Firebase issue with HMR that doesn't affect functionality
      if (error.message?.includes('read only property') || 
          error.message?.includes('operations') ||
          error.message?.includes('currentUser') ||
          error.message?.includes('firebase:authUser') ||
          error.message?.includes('IndexedDBLocalPersistence')) {
        console.log('⚠️ Suppressed Firebase HMR error during Google sign-in - this is harmless');
        // Don't show toast for this error, just reject silently
        return rejectWithValue('SUPPRESSED_ERROR');
      }
      
      let message = 'Failed to sign in with Google';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in cancelled';
        // Don't show error toast for user cancellation
        return rejectWithValue(message);
      } else if (error.code === 'auth/popup-blocked') {
        message = 'Popup blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized for Google sign-in. Please contact support.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = 'Sign-in cancelled - another popup was already open';
        return rejectWithValue(message);
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { dispatch }) => {
    try {
      console.log('🔵 Starting sign out process...');
      
      // Step 1: Clear Redux RTK Query cache first
      console.log('🔵 Clearing RTK Query cache...');
      dispatch(api.util.resetApiState());
      console.log('✅ RTK Query cache cleared');
      
      // Step 2: Clear Redux state
      console.log('🔵 Clearing Redux state...');
      dispatch(clearUser());
      console.log('✅ Redux state cleared');
      
      // Step 3: Clear application-specific localStorage (but NOT Firebase keys)
      console.log('🔵 Clearing application localStorage...');
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => {
        // Don't clear Firebase's internal storage keys
        if (!key.startsWith('firebase:')) {
          localStorage.removeItem(key);
          console.log(`  Removed: ${key}`);
        }
      });
      console.log('✅ Application localStorage cleared (Firebase keys preserved)');
      
      // Step 4: Clear all sessionStorage
      console.log('🔵 Clearing sessionStorage...');
      sessionStorage.clear();
      console.log('✅ sessionStorage cleared');
      
      // Step 5: Clear non-Firebase cookies
      console.log('🔵 Clearing application cookies...');
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        // Don't clear Firebase cookies
        if (!name.startsWith('firebase') && !name.startsWith('__firebase')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      }
      console.log('✅ Application cookies cleared');
      
      // Step 6: Sign out from Firebase LAST (let Firebase handle its own cleanup)
      console.log('🔵 Signing out from Firebase...');
      try {
        await firebaseSignOut(auth);
        console.log('✅ Firebase sign out successful');
      } catch (firebaseError: any) {
        // Check if this is a known Firebase HMR error that should be suppressed
        const isHMRError = firebaseError.message?.includes('read only property') || 
                          firebaseError.message?.includes('operations') ||
                          firebaseError.message?.includes('currentUser') ||
                          firebaseError.message?.includes('firebase:authUser') ||
                          firebaseError.message?.includes('IndexedDBLocalPersistence');
        
        if (isHMRError) {
          // Suppress - don't log, this is a harmless development error
          console.log('⚠️ Suppressed Firebase HMR error during sign-out - this is harmless in development');
        } else {
          // This is a real error, log it and throw
          console.error('⚠️ Firebase sign out error:', firebaseError);
          throw firebaseError;
        }
      }
      
      console.log('✅ Sign out complete - all application data cleared');
      toast.success('Signed out successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      
      // Even if there's an error, still try to clear application state
      try {
        dispatch(clearUser());
        dispatch(api.util.resetApiState());
        sessionStorage.clear();
        
        // Try to clear non-Firebase localStorage
        const localStorageKeys = Object.keys(localStorage);
        localStorageKeys.forEach(key => {
          if (!key.startsWith('firebase:')) {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.warn('Could not remove localStorage key:', key);
            }
          }
        });
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
      
      const message = error.message || 'Failed to sign out';
      toast.error(message);
      return true; // Return true anyway so the UI can proceed
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.firebaseUser = null;
      state.isAuthenticated = false;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.firebaseUser = action.payload;
        state.isInitialized = true;
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isInitialized = true;
        state.isLoading = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.firebaseUser = null;
        state.isAuthenticated = false;
      })
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      // Sign in with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const { setUser, clearUser, setError } = authSlice.actions;
export default authSlice.reducer;

