import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MovieCard } from './MovieCard';
import { Movie } from '../../types';
import { ScrollReveal } from '../../animations/ScrollReveal';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
}

export const MovieRow = ({ title, movies, loading }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

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

  return (
    <ScrollReveal>
      <div
        className="relative mb-6 md:mb-8 group"
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 px-4 md:px-12 tracking-tight">
          {title}
        </h2>

        <div className="relative">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: showArrows ? 1 : 0, x: showArrows ? 0 : -20 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-black/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-r-lg"
            style={{ display: scrollPosition <= 0 ? 'none' : 'flex' }}
          >
            <FiChevronLeft size={32} className="text-white drop-shadow-lg" />
          </motion.button>

          <div
            ref={rowRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 py-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[240px] lg:w-[280px]">
                    <div className="aspect-video bg-[#14141a] rounded-lg animate-pulse" />
                    <div className="h-4 bg-[#14141a] rounded mt-2 w-3/4 animate-pulse" />
                  </div>
                ))
              : movies.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ))
            }
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: showArrows ? 1 : 0, x: showArrows ? 0 : 20 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-black/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg"
          >
            <FiChevronRight size={32} className="text-white drop-shadow-lg" />
          </motion.button>
        </div>
      </div>
    </ScrollReveal>
  );
};
