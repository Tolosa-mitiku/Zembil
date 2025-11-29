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
} from 'firebase/auth';
import { auth } from '@/core/firebase/config';
import { UserRole } from '@/core/constants';
import toast from 'react-hot-toast';

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
              
              // Only set user if they are seller or admin
              if (userData && (userData.role === 'seller' || userData.role === 'admin')) {
                dispatch(setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: userData?.name || firebaseUser.displayName || '',
                  role: userData?.role,
                  image: userData?.image || firebaseUser.photoURL || undefined,
                }));
              } else {
                console.log('User is not seller or admin, signing out');
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

      // Check if user has seller or admin role
      if (userData.role !== 'seller' && userData.role !== 'admin') {
        await firebaseSignOut(auth);
        throw new Error('Access denied. Only sellers and admins can access this dashboard.');
      }

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
      const message = error.message || 'Failed to login';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile with name
      await updateProfile(firebaseUser, { displayName: name });
      
      // Get ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Call backend /login endpoint (which creates user if not exists)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://zembil.vercel.app/api/v1'}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      console.log('SignUp - Backend response:', data);
      
      const userData = data.data?.user || data.user || data;
      console.log('SignUp - User data:', userData);

      // Check if user has seller or admin role
      if (!userData || (userData.role !== 'seller' && userData.role !== 'admin')) {
        await firebaseSignOut(auth);
        throw new Error(`Access denied. Only sellers and admins can access this dashboard. Your role: ${userData?.role || 'unknown'}. Please contact support to upgrade your account.`);
      }

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || name || firebaseUser.displayName || '',
        role: userData.role,
        image: userData.image || firebaseUser.photoURL || undefined,
      };

      toast.success(`Welcome to Zembil, ${user.name}!`);
      return user;
    } catch (error: any) {
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
      const provider = new GoogleAuthProvider();
      
      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
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
      console.log('Google SignIn - Backend response:', data);
      
      const userData = data.data?.user || data.user || data;
      console.log('Google SignIn - User data:', userData);

      // Check if user has seller or admin role
      if (!userData || (userData.role !== 'seller' && userData.role !== 'admin')) {
        await firebaseSignOut(auth);
        throw new Error(`Access denied. Only sellers and admins can access this dashboard. Your role: ${userData?.role || 'unknown'}`);
      }

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || firebaseUser.displayName || '',
        role: userData.role,
        image: userData.image || firebaseUser.photoURL || undefined,
      };

      toast.success(`Welcome, ${user.name}!`);
      return user;
    } catch (error: any) {
      const message = error.message || 'Failed to sign in with Google';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
      toast.success('Signed out successfully');
    } catch (error: any) {
      const message = error.message || 'Failed to sign out';
      toast.error(message);
      return rejectWithValue(message);
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

