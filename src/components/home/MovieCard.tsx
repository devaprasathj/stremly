import { useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiPlay, FiPlus, FiThumbsUp, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types';
import { TMDB_IMAGE_BASE, IMAGE_SIZES, getCategoryColor } from '../../utils/constants';
import { SafeImage } from '../common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export const MovieCard = ({ movie, index = 0 }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const categoryColors = useMemo(() => getCategoryColor(movie.genres), [movie.genres]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 250, damping: 25 });
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const xVal = (e.clientX - rect.left) / rect.width - 0.5;
      const yVal = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(xVal);
      y.set(yVal);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const thumbnailUrl = getImageUrl(movie.thumbnailUrl, 'thumbnail', getImageUrl(movie.posterUrl, 'poster'));
  const posterUrl = getImageUrl(movie.posterUrl, 'poster', getImageUrl(movie.backdropUrl, 'backdrop'));

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ rotateX, rotateY, perspective: 1200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex-shrink-0 cursor-pointer group transition-all duration-300 hover:z-30"
    >
      <div className="relative w-[170px] sm:w-[200px] md:w-[230px] lg:w-[270px]">
        {/* Glow border effect */}
        <motion.div
          className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${categoryColors.primary}, ${categoryColors.secondary}, ${categoryColors.primary})`
              : 'transparent',
            filter: 'blur(2px)',
          }}
        />

        <div
          className="relative aspect-video rounded-lg overflow-hidden shadow-lg transition-all duration-300"
          style={{
            boxShadow: isHovered
              ? `0 8px 32px ${categoryColors.primary}30, 0 0 0 1px ${categoryColors.primary}40`
              : '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <SafeImage
            src={thumbnailUrl}
            alt={movie.title}
            poster
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md shadow-xl"
              style={{
                background: `${categoryColors.primary}30`,
                border: `2px solid ${categoryColors.primary}60`,
              }}
            >
              <FiPlay size={20} className="text-white ml-0.5" />
            </motion.div>
          </motion.div>
        </div>

        {/* Hover info panel */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.95,
          }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-20 left-0 right-0 bg-[#06060b]/95 backdrop-blur-xl rounded-b-md border border-white/10 shadow-2xl shadow-black/40 z-20 p-3 sm:p-4"
          style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="p-2 rounded-full text-white transition-colors shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${categoryColors.primary}, ${categoryColors.secondary})`,
                boxShadow: `${categoryColors.primary}60 0px 4px 12px`,
              }}
            >
              <FiPlay size={14} />
            </button>
            <button className="p-[5px] sm:p-1.5 rounded-full border border-white/40 text-white hover:border-white hover:bg-white/10 transition-all">
              <FiPlus size={13} />
            </button>
            <button className="p-[5px] sm:p-1.5 rounded-full border border-white/40 text-white hover:border-white hover:bg-white/10 transition-all">
              <FiThumbsUp size={13} />
            </button>
            <button
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="p-[5px] sm:p-1.5 rounded-full border border-white/40 text-white hover:border-white hover:bg-white/10 transition-all ml-auto"
            >
              <FiChevronDown size={13} />
            </button>
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: categoryColors.primary }}>
            {movie.rating}% Match
          </p>
          <p className="text-[10px] sm:text-[11px] text-streamly-gray">
            {movie.maturityRating} &bull; {movie.duration} &bull; {movie.year}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {movie.genres?.slice(0, 2).map((genre) => (
              <span key={genre} className="text-[10px] sm:text-[11px] text-streamly-gray">{genre}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <p className="text-xs sm:text-sm text-streamly-gray mt-1.5 sm:mt-2 truncate px-0.5">{movie.title}</p>
    </motion.div>
  );
};
