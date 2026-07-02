import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  firebaseUser: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
}

const initialState: AuthState = {
  user: null,
  firebaseUser: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
};

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (!auth) return rejectWithValue('Firebase not available');
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      
      return {
        user: {
          uid: result.user.uid,
          email: result.user.email || null,
          displayName: result.user.displayName || null,
          photoURL: result.user.photoURL || null,
          phoneNumber: result.user.phoneNumber || null,
          emailVerified: result.user.emailVerified || false,
        } as any,
        firebaseUser: result.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      if (!auth) return rejectWithValue('Firebase not available');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await fbUpdateProfile(result.user, { displayName: name });
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      return {
        user: {
          uid: result.user.uid,
          email: result.user.email || null,
          displayName: name || null,
          photoURL: result.user.photoURL || null,
          phoneNumber: result.user.phoneNumber || null,
          emailVerified: result.user.emailVerified || false,
        } as any,
        firebaseUser: result.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      if (!auth) return rejectWithValue('Firebase not available');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      return {
        user: {
          uid: result.user.uid,
          email: result.user.email || null,
          displayName: result.user.displayName || null,
          photoURL: result.user.photoURL || null,
          phoneNumber: result.user.phoneNumber || null,
          emailVerified: result.user.emailVerified || false,
        },
        firebaseUser: result.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    if (!auth) return;
    await signOut(auth);
    localStorage.removeItem('token');
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: { displayName?: string; photoURL?: string }, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).auth;
      const firebaseUser = state.firebaseUser as any;

      // Update Firebase auth profile if available
      if (firebaseUser) {
        try {
          const { updateProfile } = await import('firebase/auth');
          await updateProfile(firebaseUser, updates);
        } catch { /* Firebase update failed, use local only */ }
      }

      // Persist to localStorage via the existing profile API
      if (state.user?.uid) {
        const { userAPI } = await import('../../services/api');
        await userAPI.updateProfile(state.user.uid, updates);
      }

      return {
        ...state.user,
        ...updates,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update profile');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      if (!auth) return rejectWithValue('Firebase not available');
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User | null; firebaseUser: any | null }>) {
      state.user = action.payload.user;
      state.firebaseUser = action.payload.firebaseUser;
      state.isAuthenticated = !!action.payload.user;
    },
    clearError(state) {
      state.error = null;
    },
    toggleAuthModal(state) {
      state.isAuthModalOpen = !state.isAuthModalOpen;
    },
    setAuthModal(state, action: PayloadAction<boolean>) {
      state.isAuthModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.firebaseUser = action.payload.firebaseUser;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.firebaseUser = action.payload.firebaseUser;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.firebaseUser = action.payload.firebaseUser;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.firebaseUser = null;
        state.isAuthenticated = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError, toggleAuthModal, setAuthModal } = authSlice.actions;

export default authSlice.reducer;
