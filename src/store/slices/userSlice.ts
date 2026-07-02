import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, WatchHistoryEntry, Notification } from '../../types';
import { userAPI } from '../../services/api';

interface UserState {
  profile: UserProfile | null;
  watchHistory: WatchHistoryEntry[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  watchHistory: [],
  notifications: [],
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (uid: string, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.getProfile(uid);
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ uid, updates }: { uid: string; updates: Partial<UserProfile> }, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.updateProfile(uid, updates);
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update profile');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'user/addToWatchlist',
  async ({ uid, movieId }: { uid: string; movieId: string }, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.addToWatchlist(uid, movieId);
      return { watchlist: data, movieId };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'user/removeFromWatchlist',
  async ({ uid, movieId }: { uid: string; movieId: string }, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.removeFromWatchlist(uid, movieId);
      return { watchlist: data, movieId };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to remove from watchlist');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setWatchHistory(state, action: PayloadAction<WatchHistoryEntry[]>) {
      state.watchHistory = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.watchlist = action.payload.watchlist;
        }
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.watchlist = action.payload.watchlist;
        }
      });
  },
});

export const { setWatchHistory, addNotification, markNotificationRead, clearNotifications } = userSlice.actions;
export default userSlice.reducer;
