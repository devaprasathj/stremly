import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getCategoryColor } from '../../utils/constants';

const NEON_CLASS_MAP = {
  'Science Fiction': 'shadow-neon-blue',
  'Sci-Fi': 'shadow-neon-blue',
  Action: 'shadow-neon-red',
  Horror: 'shadow-neon-red',
  Romance: 'shadow-neon-pink',
  Comedy: 'shadow-neon-orange',
  Drama: 'shadow-neon-purple',
  Thriller: 'shadow-neon-orange',
  Animation: 'shadow-neon-cyan',
  Adventure: 'shadow-neon-teal',
  Documentary: 'shadow-neon-teal',
  default: 'shadow-neon-streamly',
};

const NEON_BG_MAP = {
  'Science Fiction': 'bg-[#6366f1]',
  'Sci-Fi': 'bg-[#6366f1]',
  Action: 'bg-[#ef4444]',
  Horror: 'bg-[#dc2626]',
  Romance: 'bg-[#ec4899]',
  Comedy: 'bg-[#f59e0b]',
  Drama: 'bg-[#8b5cf6]',
  Thriller: 'bg-[#f97316]',
  Animation: 'bg-[#06b6d4]',
  Adventure: 'bg-[#14b8a6]',
  Documentary: 'bg-[#10b981]',
  default: 'bg-[#ff2d55]',
};

export const MovieCard = ({ movie, index = 0 }) => {
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const colors = getCategoryColor(movie?.genres);
  const firstGenre = movie?.genres?.[0] || 'default';
  const neonShadow = NEON_CLASS_MAP[firstGenre] || NEON_CLASS_MAP.default;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 350, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 350, damping: 30 });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleClick = () => {
    setSelected(true);
    setTimeout(() => navigate(`/watch/${movie.id}`), 800);
  };

  return (
    <AnimatePresence mode="popLayout">
      {!selected ? (
        <motion.div
          ref={cardRef}
          key={`card-${movie.id}`}
          layoutId={`movie-card-${movie.id}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: 8,
            scaleX: 1.06,
            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
          }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          style={{ rotateX, rotateY, perspective: 1000 }}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="relative flex-shrink-0 cursor-pointer group will-change-transform"
        >
          <div className="relative w-[170px] sm:w-[200px] md:w-[230px] lg:w-[270px]">
            {/* Neon edge glow border */}
            <motion.div
              className={`absolute -inset-[2px] rounded-xl opacity-0 transition-opacity duration-400 pointer-events-none z-0 ${neonShadow}`}
              animate={{ opacity: hovered ? 1 : 0 }}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}50, ${colors.secondary}50, ${colors.primary}50)`,
                filter: 'blur(3px)',
              }}
            />

            <div
              className={`relative aspect-video rounded-lg overflow-hidden transition-shadow duration-300 ${hovered ? neonShadow : ''}`}
              style={{
                boxShadow: hovered
                  ? `0 0 20px ${colors.primary}50, 0 0 40px ${colors.primary}30, 0 0 80px ${colors.primary}15`
                  : '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={movie.thumbnailUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Glassmorphism overlay on hover */}
              <motion.div
                className="absolute inset-0 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}15, transparent 60%)`,
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Glowing play icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl shadow-2xl"
                  style={{
                    background: `${colors.primary}25`,
                    border: `2px solid ${colors.primary}70`,
                    boxShadow: `0 0 30px ${colors.primary}40, inset 0 0 20px ${colors.primary}15`,
                  }}
                >
                  <motion.div
                    animate={hovered ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiPlay size={22} className="text-white ml-0.5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <p className="text-xs sm:text-sm text-streamly-gray mt-1.5 sm:mt-2 truncate px-0.5">
              {movie.title}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={`expanded-${movie.id}`}
          layoutId={`movie-card-${movie.id}`}
          initial={{
            opacity: 0,
            scale: 0.25,
            scaleX: 1.06,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            scaleX: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1],
            scaleX: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center will-change-transform"
          style={{
            perspective: 1200,
            transformOrigin: 'center center',
          }}
        >
          {/* Anamorphic backdrop with neon bloom */}
          <motion.div
            className="absolute inset-0"
            initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
            animate={{ backdropFilter: 'blur(28px)', opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: `radial-gradient(ellipse at center, ${colors.primary}30 0%, transparent 70%)`,
            }}
          />

          {/* Expanding lens flare ring */}
          <motion.div
            className="absolute w-[85vw] h-[85vw] max-w-[1000px] max-h-[1000px] rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              border: `3px solid ${colors.primary}25`,
              boxShadow: `0 0 80px ${colors.primary}20, inset 0 0 80px ${colors.primary}10`,
            }}
          />

          {/* Expanded poster */}
          <motion.div
            className="relative z-10 overflow-hidden shadow-2xl"
            initial={{
              width: '28%',
              borderRadius: '12px',
            }}
            animate={{
              width: 'min(92vw, 950px)',
              borderRadius: '24px',
            }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative aspect-video">
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-0" style={{
                background: `linear-gradient(90deg, ${colors.primary}35, transparent 50%, ${colors.secondary}25)`,
              }} />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                >
                  {movie.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-sm sm:text-base text-white/60 line-clamp-2 max-w-xl mb-4"
                >
                  {movie.description}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-bold drop-shadow-[0_0_8px_currentColor]" style={{ color: colors.primary }}>
                    {movie.rating}% Match
                  </span>
                  <span className="text-xs text-white/40">&bull;</span>
                  <span className="text-xs text-white/50">{movie.year}</span>
                  <span className="text-xs text-white/40">&bull;</span>
                  <span className="text-xs text-white/50">{movie.duration}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Neon loading bar */}
          <motion.div
            className="absolute bottom-[14%] left-1/2 -translate-x-1/2 z-20 h-[3px] rounded-full overflow-hidden"
            style={{
              width: 'min(55%, 500px)',
              background: 'rgba(255,255,255,0.08)',
              boxShadow: `0 0 10px ${colors.primary}20`,
            }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                boxShadow: `0 0 15px ${colors.primary}60, 0 0 30px ${colors.primary}30`,
              }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-[8%] text-xs text-white/30 tracking-[0.2em] uppercase z-20 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
          >
            Entering {movie.title}
          </motion.p>

          {/* Anamorphic lens flare streak */}
          <motion.div
            className="absolute top-[30%] left-0 right-0 h-[2px] pointer-events-none z-0"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.primary}60, transparent)`,
              filter: 'blur(4px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
