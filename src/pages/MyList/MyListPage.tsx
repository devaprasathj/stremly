import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiX, FiList, FiTrash2 } from 'react-icons/fi';
import { PageTransition } from '../../animations/PageTransitions';
import { staggerContainer, staggerItem } from '../../animations';
import { useMovies } from '../../hooks/useMovies';
import { useAuth } from '../../hooks/useAuth';
import { SafeImage } from '../../components/common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

const MyListPage = () => {
  const { trending, topRated, newReleases } = useMovies();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const myList = useMemo(() => {
    const all = [...trending, ...topRated, ...newReleases];
    const unique = all.filter((m, i, a) => a.findIndex((x) => x.id === m.id) === i);
    return unique.slice(0, 18);
  }, [trending, topRated, newReleases]);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => setRemovingId(null), 500);
  };

  if (myList.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-streamly-dark pt-24 pb-16 px-4 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-28 h-28 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <FiList size={44} className="text-streamly-gray" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Your list is empty</h2>
            <p className="text-streamly-gray-light mb-8 max-w-md">
              Start adding movies and TV shows to your list by clicking the + icon on any title.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/movies')}
              className="px-8 py-3 bg-streamly-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Movies
            </motion.button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-streamly-dark pt-24 pb-16 px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">My List</h1>
            <p className="text-streamly-gray-light text-sm mt-1">{myList.length} title{myList.length !== 1 ? 's' : ''}</p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
        >
          <AnimatePresence>
            {myList.map((movie) => (
              <motion.div
                key={movie.id}
                variants={staggerItem}
                layout
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                className="group relative cursor-pointer"
              >
                <div
                  onClick={() => navigate(`/watch/${movie.id}`)}
                  className="aspect-video rounded-lg overflow-hidden bg-[#14141a] relative"
                >
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

                <div className="mt-1.5 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-streamly-gray-light truncate">{movie.title}</p>
                    <div className="flex items-center gap-2 text-xs text-streamly-gray">
                      <span className="text-green-500">{movie.rating}%</span>
                      <span>{movie.year}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(movie.id)}
                    className="ml-2 p-1.5 rounded-full bg-white/10 text-streamly-gray hover:bg-streamly-red hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from list"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default MyListPage;
