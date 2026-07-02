import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

interface ContinueWatchingProps {
  movies: Movie[];
}

export const ContinueWatching = ({ movies }: ContinueWatchingProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    const container = rowRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.75;
    const newPosition = direction === 'left'
      ? scrollPosition - scrollAmount
      : scrollPosition + scrollAmount;
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  if (!movies.length) return null;

  return (
    <div className="relative mb-6 md:mb-8 group">
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 px-4 md:px-12">
        Continue Watching
      </h2>

      <div className="relative">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: scrollPosition > 0 ? 1 : 0, x: scrollPosition > 0 ? 0 : -20 }}
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          style={{ display: scrollPosition <= 0 ? 'none' : 'flex' }}
        >
          <FiChevronLeft size={30} className="text-white" />
        </motion.button>

        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[260px] cursor-pointer group/card"
              onClick={() => navigate(`/watch/${movie.id}`)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <div className="aspect-video bg-[#14141a] relative">
                  <SafeImage
                    src={getImageUrl(movie.thumbnailUrl, 'thumbnail', getImageUrl(movie.posterUrl, 'poster'))}
                    alt={movie.title}
                    poster
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-streamly-red to-red-500 transition-all duration-300"
                    style={{ width: `${Math.floor(Math.random() * 60 + 20)}%` }}
                  />
                </div>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="flex items-center gap-2 bg-streamly-red/90 px-5 py-2.5 rounded-xl shadow-lg">
                    <FiPlay size={16} className="text-white" />
                    <span className="text-white text-sm font-medium">Resume</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-streamly-gray-light mt-1.5 truncate">{movie.title}</p>
              <div className="flex items-center gap-2 text-xs text-streamly-gray mt-0.5">
                <span className="text-green-500">{movie.rating}% Match</span>
                <span>{movie.year}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <FiChevronRight size={30} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
};
