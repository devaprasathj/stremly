import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import { PageTransition } from '../../animations/PageTransitions';
import { staggerContainer, staggerItem } from '../../animations';
import { useMovies } from '../../hooks/useMovies';
import { Movie } from '../../types';
import { GENRES, LANGUAGES } from '../../utils/constants';
import { SafeImage } from '../../components/common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

const ITEMS_PER_PAGE = 20;

const MoviesPage = () => {
  const { trending, topRated, newReleases, loading } = useMovies();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const allMovies = useMemo(() => {
    const merged = [...trending, ...topRated, ...newReleases];
    const unique = merged.filter((m, i, a) => a.findIndex((x) => x.id === m.id) === i);
    return unique;
  }, [trending, topRated, newReleases]);

  const filtered = useMemo(() => {
    let result = [...allMovies];
    if (selectedGenre) result = result.filter((m) => m.genres.includes(selectedGenre));
    if (selectedLanguage) result = result.filter((m) => m.language === selectedLanguage);
    if (selectedRating) result = result.filter((m) => m.rating >= selectedRating);
    if (selectedYear) result = result.filter((m) => m.year === parseInt(selectedYear));
    return result;
  }, [allMovies, selectedGenre, selectedLanguage, selectedRating, selectedYear]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const years = useMemo(() => {
    const y = new Set(allMovies.map((m) => m.year).filter(Boolean));
    return Array.from(y).sort((a, b) => b - a);
  }, [allMovies]);

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedLanguage('');
    setSelectedRating(0);
    setSelectedYear('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedGenre || selectedLanguage || selectedRating || selectedYear;

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-streamly-dark pt-20 px-4 md:px-12">
          <div className="h-8 w-48 bg-[#14141a] rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-video bg-[#14141a] rounded animate-pulse" />
                <div className="h-4 bg-[#14141a] rounded mt-2 w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-streamly-dark pt-24 pb-16">
        <div className="px-4 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">Movies</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-streamly-red text-white' : 'text-streamly-gray hover:text-white'}`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-streamly-red text-white' : 'text-streamly-gray hover:text-white'}`}
                >
                  <FiList size={16} />
                </button>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-streamly-red hover:underline">
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-8 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <div className="flex items-center gap-2 text-streamly-gray">
              <FiFilter size={16} />
              <span className="text-sm">Filters:</span>
            </div>

            <select
              value={selectedGenre}
              onChange={(e) => { setSelectedGenre(e.target.value); setCurrentPage(1); }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-streamly-red/50"
            >
              <option value="">All Genres</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-streamly-red/50"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            <select
              value={selectedRating}
              onChange={(e) => { setSelectedRating(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-streamly-red/50"
            >
              <option value={0}>Min Rating</option>
              {[5, 6, 7, 8, 9].map((r) => <option key={r} value={r}>{r}+ Rating</option>)}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-streamly-red/50"
            >
              <option value="">All Years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </motion.div>

          {hasActiveFilters && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mb-6">
              {selectedGenre && (
                <span className="flex items-center gap-1 bg-streamly-red/20 text-streamly-red text-xs px-3 py-1 rounded-full border border-streamly-red/30">
                  {selectedGenre}
                  <button onClick={() => setSelectedGenre('')} className="ml-1 hover:text-white">&times;</button>
                </span>
              )}
              {selectedLanguage && (
                <span className="flex items-center gap-1 bg-accent-blue/20 text-accent-blue text-xs px-3 py-1 rounded-full border border-accent-blue/30">
                  {selectedLanguage}
                  <button onClick={() => setSelectedLanguage('')} className="ml-1 hover:text-white">&times;</button>
                </span>
              )}
              {selectedRating > 0 && (
                <span className="flex items-center gap-1 bg-green-500/20 text-green-500 text-xs px-3 py-1 rounded-full border border-green-500/30">
                  {selectedRating}+ Rating
                  <button onClick={() => setSelectedRating(0)} className="ml-1 hover:text-white">&times;</button>
                </span>
              )}
              {selectedYear && (
                <span className="flex items-center gap-1 bg-accent-purple/20 text-accent-purple text-xs px-3 py-1 rounded-full border border-accent-purple/30">
                  {selectedYear}
                  <button onClick={() => setSelectedYear('')} className="ml-1 hover:text-white">&times;</button>
                </span>
              )}
            </motion.div>
          )}

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <FiFilter size={36} className="text-streamly-gray" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Movies Found</h3>
              <p className="text-streamly-gray-light mb-6 max-w-md">
                No movies match your current filters. Try adjusting or clearing them.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-streamly-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode + currentPage}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4'
                      : 'space-y-3'
                  }
                >
                  {paginated.map((movie) => (
                    viewMode === 'grid' ? (
                      <motion.div
                        key={movie.id}
                        variants={staggerItem}
                        whileHover={{ scale: 1.05, y: -8 }}
                        onClick={() => navigate(`/watch/${movie.id}`)}
                        className="group cursor-pointer relative"
                      >
                        <div className="aspect-video rounded-lg overflow-hidden bg-[#14141a] relative">
                          <SafeImage
                            src={getImageUrl(movie.thumbnailUrl, 'thumbnail', getImageUrl(movie.posterUrl, 'poster'))}
                            alt={movie.title}
                            poster
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-streamly-red/90 flex items-center justify-center">
                              <FiPlay size={20} className="text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-streamly-gray-light mt-1.5 truncate">{movie.title}</p>
                        <div className="flex items-center gap-2 text-xs text-streamly-gray">
                          <span className="text-green-500">{movie.rating}%</span>
                          <span>{movie.year}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={movie.id}
                        variants={staggerItem}
                        onClick={() => navigate(`/watch/${movie.id}`)}
                        className="flex gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors border border-white/5"
                      >
                      <SafeImage
                        src={getImageUrl(movie.thumbnailUrl, 'thumbnail', getImageUrl(movie.posterUrl, 'poster'))}
                        alt={movie.title}
                        poster
                        className="w-24 h-16 object-cover rounded flex-shrink-0"
                      />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{movie.title}</h4>
                          <p className="text-xs text-streamly-gray mt-1 line-clamp-2">{movie.description}</p>
                          <div className="flex items-center gap-3 text-xs text-streamly-gray mt-1">
                            <span className="text-green-500">{movie.rating}% Match</span>
                            <span>{movie.year}</span>
                            <span>{movie.duration}</span>
                          </div>
                        </div>
                        <button className="self-center p-2 rounded-full border border-white/20 text-streamly-gray hover:text-white hover:border-white transition-colors">
                          <FiPlay size={16} />
                        </button>
                      </motion.div>
                    )
                  ))}
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-streamly-red text-white'
                            : 'bg-white/5 border border-white/10 text-streamly-gray-light hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              )}

              <p className="text-center text-streamly-gray text-sm mt-4">
                Showing {paginated.length} of {filtered.length} movies
              </p>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default MoviesPage;
