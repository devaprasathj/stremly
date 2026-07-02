import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../types';
import { movieAPI } from '../../services/api';

interface MovieState {
  trending: Movie[];
  topRated: Movie[];
  newReleases: Movie[];
  popularTVShows: Movie[];
  recommended: Movie[];
  continueWatching: Movie[];
  featured: Movie | null;
  currentMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  trending: [],
  topRated: [],
  newReleases: [],
  popularTVShows: [],
  recommended: [],
  continueWatching: [],
  featured: null,
  currentMovie: null,
  loading: false,
  error: null,
};

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await movieAPI.getTrending();
    return data;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch trending movies');
  }
});

export const fetchTopRated = createAsyncThunk('movies/fetchTopRated', async (_, { rejectWithValue }) => {
  try {
    const { data } = await movieAPI.getTopRated();
    return data;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch top rated movies');
  }
});

export const fetchNewReleases = createAsyncThunk('movies/fetchNewReleases', async (_, { rejectWithValue }) => {
  try {
    const { data } = await movieAPI.getNewReleases();
    return data;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch new releases');
  }
});

export const fetchPopularTVShows = createAsyncThunk('movies/fetchPopularTVShows', async (_, { rejectWithValue }) => {
  try {
    const { data } = await movieAPI.getPopularTVShows();
    return data;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch popular TV shows');
  }
});

export const fetchRecommended = createAsyncThunk(
  'movies/fetchRecommended',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await movieAPI.getRecommendations(userId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch recommendations');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId: string, { rejectWithValue }) => {
    try {
      const { data } = await movieAPI.getMovieDetails(movieId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch movie details');
    }
  }
);

export const fetchMoodRecommendations = createAsyncThunk(
  'movies/fetchMoodRecommendations',
  async (mood: string, { rejectWithValue }) => {
    try {
      const { data } = await movieAPI.getMoodRecommendations(mood);
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch mood recommendations');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setFeatured(state, action: PayloadAction<Movie>) {
      state.featured = action.payload;
    },
    setCurrentMovie(state, action: PayloadAction<Movie | null>) {
      state.currentMovie = action.payload;
    },
    setContinueWatching(state, action: PayloadAction<Movie[]>) {
      state.continueWatching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => { state.loading = true; })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
        if (!state.featured && action.payload.length > 0) {
          state.featured = action.payload[0];
        }
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTopRated.fulfilled, (state, action) => {
        state.topRated = action.payload;
      })
      .addCase(fetchNewReleases.fulfilled, (state, action) => {
        state.newReleases = action.payload;
      })
      .addCase(fetchPopularTVShows.fulfilled, (state, action) => {
        state.popularTVShows = action.payload;
      })
      .addCase(fetchRecommended.fulfilled, (state, action) => {
        state.recommended = action.payload;
      })
      .addCase(fetchMovieDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMoodRecommendations.fulfilled, (state, action) => {
        state.recommended = action.payload;
      });
  },
});

export const { setFeatured, setCurrentMovie, setContinueWatching } = movieSlice.actions;
export default movieSlice.reducer;
