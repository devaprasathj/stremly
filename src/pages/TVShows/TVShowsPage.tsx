import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiList, FiPlay, FiClock } from 'react-icons/fi';
import { PageTransition } from '../../animations/PageTransitions';
import { staggerContainer, staggerItem } from '../../animations';
import { useMovies } from '../../hooks/useMovies';
import { Movie } from '../../types';
import { SafeImage } from '../../components/common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

const CATEGORIES = [
  { key: 'popular', label: 'Popular' },
  { key: 'topRated', label: 'Top Rated' },
  { key: 'newThisWeek', label: 'New This Week' },
];

const TVShowsPage = () => {
  const { popularTVShows, topRated, newReleases, loading } = useMovies();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categoryMovies: Record<string, Movie[]> = useMemo(() => ({
    popular: popularTVShows,
    topRated: topRated.filter((m) => m.category === 'tvshow'),
    newThisWeek: newReleases.filter((m) => m.category === 'tvshow'),
  }), [popularTVShows, topRated, newReleases]);

  const currentMovies = categoryMovies[activeCategory] || [];

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-streamly-dark pt-20 px-4 md:px-12">
          <div className="h-8 w-48 bg-[#14141a] rounded animate-pulse mb-8" />
          <div className="flex gap-3 mb-8">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 w-28 bg-[#14141a] rounded-lg animate-pulse" />)}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
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
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">TV Shows</h1>
              <p className="text-streamly-gray-light text-sm mt-1">Discover your next binge-worthy series</p>
            </div>
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-8"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-streamly-red text-white shadow-lg shadow-streamly-red/25'
                    : 'bg-white/5 text-streamly-gray-light hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {currentMovies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <FiClock size={36} className="text-streamly-gray" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No TV Shows Yet</h3>
              <p className="text-streamly-gray-light">Check back soon for new content!</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + viewMode}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4'
                    : 'space-y-3'
                }
              >
                {currentMovies.map((show) => (
                  viewMode === 'grid' ? (
                    <motion.div
                      key={show.id}
                      variants={staggerItem}
                      onMouseEnter={() => setHoveredId(show.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => navigate(`/watch/${show.id}`)}
                      className="group cursor-pointer relative"
                    >
                      <div className="aspect-video rounded-lg overflow-hidden bg-[#14141a] relative">
                        <SafeImage
                          src={getImageUrl(show.thumbnailUrl, 'thumbnail', getImageUrl(show.posterUrl, 'poster'))}
                          alt={show.title}
                          poster
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-streamly-red/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <FiPlay size={20} className="text-white ml-0.5" />
                          </div>
                        </div>
                        {hoveredId === show.id && show.seasons && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex items-center gap-1 text-[10px] text-white/80 bg-black/60 rounded px-2 py-1 backdrop-blur-sm">
                              <FiClock size={10} />
                              <span>{show.seasons.length} Season{show.seasons.length !== 1 ? 's' : ''}</span>
                              <span className="mx-1">•</span>
                              <span>{show.seasons.reduce((a, s) => a + s.episodes.length, 0)} Episodes</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-streamly-gray-light mt-1.5 truncate">{show.title}</p>
                      <div className="flex items-center gap-2 text-xs text-streamly-gray">
                        <span className="text-green-500">{show.rating}%</span>
                        <span>{show.year}</span>
                        <span>{show.duration}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={show.id}
                      variants={staggerItem}
                      onClick={() => navigate(`/watch/${show.id}`)}
                      className="flex gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors border border-white/5"
                    >
                      <SafeImage
                        src={getImageUrl(show.thumbnailUrl, 'thumbnail', getImageUrl(show.posterUrl, 'poster'))}
                        alt={show.title}
                        poster
                        className="w-24 h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{show.title}</h4>
                        <p className="text-xs text-streamly-gray mt-1 line-clamp-2">{show.description}</p>
                        <div className="flex items-center gap-3 text-xs text-streamly-gray mt-1">
                          <span className="text-green-500">{show.rating}% Match</span>
                          <span>{show.year}</span>
                          {show.seasons && (
                            <span className="flex items-center gap-1">
                              <FiClock size={10} />
                              {show.seasons.length} Season{show.seasons.length !== 1 ? 's' : ''}
                            </span>
                          )}
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
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-streamly-gray text-sm mt-8"
          >
            Showing {currentMovies.length} {activeCategory.replace(/([A-Z])/g, ' $1').toLowerCase().trim()} shows
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
};

export default TVShowsPage;
