import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, SearchFilters } from '../../types';
import { movieAPI } from '../../services/api';

interface SearchState {
  results: Movie[];
  suggestions: string[];
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
  recentSearches: string[];
}

const initialState: SearchState = {
  results: [],
  suggestions: [],
  filters: {
    query: '',
    genre: '',
    language: '',
    rating: 0,
    year: 0,
    category: 'all',
  },
  loading: false,
  error: null,
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
};

export const searchMoviesThunk = createAsyncThunk(
  'search/searchMovies',
  async (filters: SearchFilters, { rejectWithValue }) => {
    try {
      const { data } = await movieAPI.searchMovies(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Search failed');
    }
  }
);

export const getSuggestions = createAsyncThunk(
  'search/getSuggestions',
  async (query: string, { rejectWithValue }) => {
    try {
      const { data } = await movieAPI.searchMovies({ query, genre: '', language: '', rating: 0, year: 0, category: 'all' });
      return data.slice(0, 8).map((m: Movie) => m.title);
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to get suggestions');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.filters.query = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<SearchFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearResults(state) {
      state.results = [];
      state.suggestions = [];
    },
    addRecentSearch(state, action: PayloadAction<string>) {
      if (!state.recentSearches.includes(action.payload)) {
        state.recentSearches.unshift(action.payload);
        if (state.recentSearches.length > 10) state.recentSearches.pop();
        localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
      }
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
      localStorage.removeItem('recentSearches');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMoviesThunk.pending, (state) => { state.loading = true; })
      .addCase(searchMoviesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchMoviesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const { setQuery, setFilters, clearResults, addRecentSearch, clearRecentSearches } = searchSlice.actions;
export default searchSlice.reducer;
