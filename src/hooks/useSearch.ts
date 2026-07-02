import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  searchMoviesThunk,
  getSuggestions,
  setQuery,
  setFilters,
  clearResults,
  addRecentSearch,
  clearRecentSearches,
} from '../store/slices/searchSlice';
import { SearchFilters } from '../types';

export const useSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { results, suggestions, filters, loading, recentSearches } =
    useSelector((state: RootState) => state.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const debouncedSearch = useCallback(
    (searchFilters: SearchFilters) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (searchFilters.query) {
          dispatch(searchMoviesThunk(searchFilters));
          dispatch(getSuggestions(searchFilters.query));
        } else {
          dispatch(clearResults());
        }
      }, 500);
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    results, suggestions, filters, loading, recentSearches,
    setQuery: (query: string) => dispatch(setQuery(query)),
    setFilters: (filters: Partial<SearchFilters>) => dispatch(setFilters(filters)),
    search: (searchFilters: SearchFilters) => dispatch(searchMoviesThunk(searchFilters)),
    debouncedSearch,
    clearResults: () => dispatch(clearResults()),
    addRecentSearch: (query: string) => dispatch(addRecentSearch(query)),
    clearRecentSearches: () => dispatch(clearRecentSearches()),
  };
};
