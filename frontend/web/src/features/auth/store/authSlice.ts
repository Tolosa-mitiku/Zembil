import { UserRole } from "@/core/constants";
import { auth } from "@/core/firebase/config";
import { api } from "@/core/http/api";
import authService from "@/core/services/authService";
import { safeToast as toast } from "@/core/utils/toast-wrapper";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  User as FirebaseUser,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";

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
  "auth/initialize",
  async (_, { dispatch }) => {
    return new Promise<FirebaseUser | null>((resolve) => {
      // Small delay to ensure Firebase has fully loaded any persisted state
      setTimeout(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              console.log("🔵 Initializing auth for user:", firebaseUser.email);

              // Get user data from backend
              const user = await authService.getCurrentUserFromBackend();

              if (user) {
                console.log(
                  "✅ User data retrieved from backend:",
                  user.email,
                  "Role:",
                  user.role
                );
                dispatch(setUser(user));
              } else {
                console.warn(
                  "⚠️ No user data from backend, attempting to sync..."
                );

                // Try to sync with backend (will create user if doesn't exist)
                try {
                  const idToken = await firebaseUser.getIdToken();
                  const syncedUser = await authService.syncWithBackend(idToken);

                  if (syncedUser) {
                    console.log("✅ User synced with backend:", syncedUser.email);
                    dispatch(setUser(syncedUser));
                  } else {
                    console.error("❌ Failed to sync user with backend - clearing stale Firebase state");
                    // Clear stale Firebase state and sign out
                    await authService.signOut();
                    dispatch(clearUser());
                  }
                } catch (syncError) {
                  console.error("❌ Error syncing with backend:", syncError);
                  // If sync fails, this might be stale Firebase data - clear it
                  console.log("🔵 Clearing potentially stale Firebase state...");
                  await authService.signOut();
                  dispatch(clearUser());
                }
              }
            } catch (error) {
              console.error("❌ Error initializing auth:", error);
              // If we can't get user data, clear potentially stale state
              try {
                await authService.signOut();
                dispatch(clearUser());
              } catch (e) {
                console.warn("Could not clean up stale auth state:", e);
              }
            }
          } else {
            console.log("No Firebase user found");
            // Ensure Redux state is also cleared
            dispatch(clearUser());
          }
          resolve(firebaseUser);
          unsubscribe();
        });
      }, 50); // Small delay to let Firebase fully initialize
    });
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔵 Starting login for:", email);

      const { user } = await authService.loginWithEmailPassword(
        email,
        password
      );

      console.log("✅ Login successful:", user.email, "Role:", user.role);
      toast.success(`Welcome back, ${user.name}!`);
      return user;
    } catch (error: any) {
      console.error("❌ Login error:", error);

      // Suppress Firebase HMR errors
      if (
        error.message?.includes("read only property") ||
        error.message?.includes("operations")
      ) {
        console.log("⚠️ Suppressed Firebase HMR error during login");
        return rejectWithValue("SUPPRESSED_ERROR");
      }

      const message = error.message || "Failed to login";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name?: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔵 Starting sign up for:", email);

      const { user } = await authService.signUpWithEmailPassword(
        email,
        password,
        name
      );

      console.log("✅ Sign up successful:", user.email, "Role:", user.role);
      toast.success(`Welcome to Zembil! Please verify your email.`);
      return user;
    } catch (error: any) {
      console.error("❌ Sign up error:", error);

      // Suppress Firebase HMR errors
      if (
        error.message?.includes("read only property") ||
        error.message?.includes("operations")
      ) {
        console.log("⚠️ Suppressed Firebase HMR error during sign up");
        return rejectWithValue("SUPPRESSED_ERROR");
      }

      const message = error.message || "Failed to sign up";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔵 Starting Google sign-in...");

      // Set persistence to LOCAL
      await setPersistence(auth, browserLocalPersistence);

      const { user } = await authService.signInWithGoogle();

      console.log(
        "✅ Google sign-in successful:",
        user.email,
        "Role:",
        user.role
      );
      toast.success(`Welcome, ${user.name}!`);
      return user;
    } catch (error: any) {
      console.error("❌ Google sign-in error:", error);

      // Only suppress true HMR errors (very specific patterns that only occur during Vite hot reload)
      // These are characterized by "Cannot assign to read only property" with specific object references
      const isHMRError = 
        import.meta.env.DEV && 
        error.message?.includes("Cannot assign to read only property") &&
        (error.message?.includes("'operations'") || error.message?.includes("'currentUser'"));
      
      if (isHMRError) {
        console.log("⚠️ Suppressed Firebase HMR error during Google sign-in - try again");
        toast.error("Please try signing in again");
        return rejectWithValue("HMR_ERROR");
      }

      // Don't show toast for user-cancelled sign-ins
      if (error.message === "Sign-in cancelled") {
        return rejectWithValue(error.message);
      }

      const message = error.message || "Failed to sign in with Google";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { dispatch }) => {
    try {
      console.log("🔵 Starting sign out process...");

      // Step 1: Clear Redux RTK Query cache first
      console.log("🔵 Clearing RTK Query cache...");
      dispatch(api.util.resetApiState());
      console.log("✅ RTK Query cache cleared");

      // Step 2: Clear Redux state
      console.log("🔵 Clearing Redux state...");
      dispatch(clearUser());
      console.log("✅ Redux state cleared");

      // Step 3: Clear ALL localStorage (including Firebase keys to prevent stale state)
      console.log("🔵 Clearing all localStorage...");
      localStorage.clear();
      console.log("✅ All localStorage cleared");

      // Step 4: Clear all sessionStorage
      console.log("🔵 Clearing sessionStorage...");
      sessionStorage.clear();
      console.log("✅ sessionStorage cleared");

      // Step 5: Sign out from Firebase and backend (this also clears IndexedDB)
      console.log("🔵 Signing out from Firebase and backend...");
      try {
        await authService.signOut();
        console.log("✅ Sign out successful");
      } catch (signOutError: any) {
        // Check if this is a true HMR error (only in dev mode)
        const isHMRError =
          import.meta.env.DEV &&
          signOutError.message?.includes("Cannot assign to read only property");

        if (isHMRError) {
          console.log("⚠️ Suppressed Firebase HMR error during sign-out");
          // Still try to clear Firebase state manually
          try {
            await authService.clearFirebaseAuthState();
          } catch (e) {
            console.warn("Could not clear Firebase state:", e);
          }
        } else {
          console.error("⚠️ Sign out error:", signOutError);
          throw signOutError;
        }
      }

      // Step 6: Small delay to ensure all async cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("✅ Sign out complete");
      toast.success("Signed out successfully");
      return true;
    } catch (error: any) {
      console.error("❌ Sign out error:", error);

      // Even if there's an error, still clear ALL application state
      try {
        dispatch(clearUser());
        dispatch(api.util.resetApiState());
        sessionStorage.clear();
        localStorage.clear();
        
        // Also try to clear Firebase IndexedDB state
        await authService.clearFirebaseAuthState();
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }

      const message = error.message || "Failed to sign out";
      toast.error(message);
      return true;
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
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
