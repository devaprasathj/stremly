import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { SearchFilters } from '../../types';
import { GENRES, LANGUAGES } from '../../utils/constants';

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
}

export const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const yearRange = Array.from({ length: 30 }, (_, i) => 2024 - i);

  const activeFilterCount = [filters.genre, filters.language, filters.rating > 0 && 'rating', filters.year > 0 && 'year'].filter(Boolean).length;

  const clearAll = () => {
    onFilterChange({ genre: '', language: '', rating: 0, year: 0, category: 'all' });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isExpanded || activeFilterCount > 0
              ? 'bg-streamly-red text-white'
              : 'bg-white/5 text-streamly-gray-light hover:bg-white/10 border border-white/10'
          }`}
        >
          <FiFilter size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-streamly-red text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={14} />
          </motion.div>
        </motion.button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-streamly-red hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 p-4 bg-streamly-darker/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-2 block">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => onFilterChange({ genre: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-streamly-red/50"
                >
                  <option value="">All</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-2 block">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => onFilterChange({ language: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-streamly-red/50"
                >
                  <option value="">All</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-2 block">
                  Min Rating: {filters.rating || 'Any'}
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={filters.rating}
                  onChange={(e) => onFilterChange({ rating: parseFloat(e.target.value) })}
                  className="w-full accent-streamly-red"
                />
                <div className="flex justify-between text-[10px] text-streamly-gray mt-1">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-2 block">Year</label>
                <select
                  value={filters.year || ''}
                  onChange={(e) => onFilterChange({ year: e.target.value ? parseInt(e.target.value) : 0 })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-streamly-red/50"
                >
                  <option value="">All</option>
                  {yearRange.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
              <span className="text-xs text-streamly-gray">Category:</span>
              {(['all', 'movie', 'tvshow'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => onFilterChange({ category: cat })}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    filters.category === cat
                      ? 'bg-streamly-red text-white'
                      : 'bg-white/5 text-streamly-gray-light hover:bg-white/10'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat === 'movie' ? 'Movies' : 'TV Shows'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeFilterCount > 0 && !isExpanded && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.genre && (
            <span className="flex items-center gap-1 bg-streamly-red/20 text-streamly-red text-xs px-2 py-1 rounded-full border border-streamly-red/30">
              {filters.genre}
              <button onClick={() => onFilterChange({ genre: '' })} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          )}
          {filters.language && (
            <span className="flex items-center gap-1 bg-accent-blue/20 text-accent-blue text-xs px-2 py-1 rounded-full border border-accent-blue/30">
              {filters.language}
              <button onClick={() => onFilterChange({ language: '' })} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          )}
          {filters.rating > 0 && (
            <span className="flex items-center gap-1 bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full border border-green-500/30">
              {filters.rating}+
              <button onClick={() => onFilterChange({ rating: 0 })} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          )}
          {filters.year > 0 && (
            <span className="flex items-center gap-1 bg-accent-purple/20 text-accent-purple text-xs px-2 py-1 rounded-full border border-accent-purple/30">
              {filters.year}
              <button onClick={() => onFilterChange({ year: 0 })} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
