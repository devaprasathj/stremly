import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiClock, FiTrendingUp, FiPlay } from 'react-icons/fi';
import { PageTransition } from '../../animations/PageTransitions';
import { staggerContainer, staggerItem } from '../../animations';
import { useSearch } from '../../hooks/useSearch';
import { SearchBar } from '../../components/search/SearchBar';
import { FilterBar } from '../../components/search/FilterBar';
import { Movie } from '../../types';
import { SafeImage } from '../../components/common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

const SearchPage = () => {
  const {
    results, suggestions, filters, loading, recentSearches,
    setQuery, setFilters, debouncedSearch, clearResults,
    addRecentSearch, clearRecentSearches,
  } = useSearch();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setLocalQuery(query);
    setQuery(query);
    if (query.trim()) {
      debouncedSearch({ ...filters, query });
      setShowSuggestions(true);
    } else {
      clearResults();
      setShowSuggestions(false);
    }
  }, [setQuery, debouncedSearch, clearResults, filters]);

  const handleSubmit = (query: string) => {
    if (query.trim()) {
      addRecentSearch(query.trim());
      setQuery(query.trim());
      debouncedSearch({ ...filters, query: query.trim() });
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    setQuery(suggestion);
    addRecentSearch(suggestion);
    debouncedSearch({ ...filters, query: suggestion });
    setShowSuggestions(false);
  };

  const handleRecentClick = (term: string) => {
    setLocalQuery(term);
    setQuery(term);
    debouncedSearch({ ...filters, query: term });
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/watch/${movie.id}`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-streamly-dark pt-24 pb-16">
        <div className="px-4 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-2">
              Search
            </h1>
            <p className="text-streamly-gray-light text-center mb-8">
              Search for movies, TV shows, and more...
            </p>

            <SearchBar
              value={localQuery}
              onChange={handleSearch}
              onSubmit={handleSubmit}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            <AnimatePresence>
              {showSuggestions && !loading && !results.length && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 bg-streamly-darker/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
                >
                  {suggestions.length > 0 && (
                    <div className="p-3">
                      <h4 className="text-xs font-semibold text-streamly-gray uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FiTrendingUp size={12} />
                        Suggestions
                      </h4>
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(s)}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                        >
                          <FiSearch size={14} className="text-streamly-gray flex-shrink-0" />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {recentSearches.length > 0 && !localQuery && (
                    <div className="p-3 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-streamly-gray uppercase tracking-wider flex items-center gap-2">
                          <FiClock size={12} />
                          Recent Searches
                        </h4>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-streamly-red hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentClick(term)}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-streamly-gray-light hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                        >
                          <FiClock size={14} className="flex-shrink-0" />
                          {term}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4">
              <FilterBar
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  if (localQuery.trim()) {
                    debouncedSearch({ ...filters, ...newFilters, query: localQuery });
                  }
                }}
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-video bg-[#14141a] rounded animate-pulse" />
                    <div className="h-4 bg-[#14141a] rounded mt-2 w-3/4 animate-pulse" />
                    <div className="h-3 bg-[#14141a] rounded mt-1 w-1/2 animate-pulse" />
                  </div>
                ))}
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div
                key="results"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
              >
                {results.map((movie) => (
                  <motion.div
                    key={movie.id}
                    variants={staggerItem}
                    onClick={() => handleMovieClick(movie)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden bg-[#14141a] relative">
                      <SafeImage
                        src={getImageUrl(movie.thumbnailUrl, 'thumbnail', getImageUrl(movie.posterUrl, 'poster'))}
                        alt={movie.title}
                        poster
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-streamly-red/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <FiPlay size={20} className="text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-streamly-gray-light mt-1.5 truncate">{movie.title}</p>
                    <div className="flex items-center gap-2 text-xs text-streamly-gray">
                      <span className="text-green-500">{movie.rating}%</span>
                      <span>{movie.year}</span>
                      <span className="capitalize">{movie.category}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : localQuery && !loading ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <FiSearch size={36} className="text-streamly-gray" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                <p className="text-streamly-gray-light max-w-md">
                  We couldn't find any matches for "{localQuery}". Try adjusting your search or filters.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <FiSearch size={36} className="text-streamly-gray" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Search for movies, TV shows, and more...</h3>
                <p className="text-streamly-gray-light">Type in the search bar above to get started</p>
              </motion.div>
            )}
          </AnimatePresence>

          {results.length > 0 && !loading && (
            <p className="text-center text-streamly-gray text-sm mt-6">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default SearchPage;
