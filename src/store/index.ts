import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import userReducer from './slices/userSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    user: userReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser', 'auth/loginWithEmail/fulfilled', 'auth/signUpWithEmail/fulfilled', 'auth/loginWithGoogle/fulfilled', 'movie/setMovies'],
        ignoredPaths: ['auth.user', 'auth.firebaseUser', 'movies.items'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
