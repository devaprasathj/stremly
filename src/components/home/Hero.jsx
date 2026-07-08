import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FiPlay, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useMousePosition } from '../../hooks/useMousePosition';
import { getCategoryColor } from '../../utils/constants';

const ATMOSPHERIC_BG = 'https://images.unsplash.com/photo-1470071459604-07b7b98db4a9?q=80&w=1920&auto=format&fit=crop';

export const Hero = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  const { nx, ny } = useMousePosition();

  const currentMovie = movies[currentIndex] || movies[0];
  const colors = useMemo(
    () => getCategoryColor(currentMovie?.genres),
    [currentMovie?.genres]
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const smoothNx = useSpring(nx, { stiffness: 80, damping: 25 });
  const smoothNy = useSpring(ny, { stiffness: 80, damping: 25 });

  const bgOffsetX = useTransform(smoothNx, [-1, 1], ['-3%', '3%']);
  const bgOffsetY = useTransform(smoothNy, [-1, 1], ['-3%', '3%']);
  const fgOffsetX = useTransform(smoothNx, [-1, 1], ['1.5%', '-1.5%']);
  const fgOffsetY = useTransform(smoothNy, [-1, 1], ['1.5%', '-1.5%']);
  const titleOffsetX = useTransform(smoothNx, [-1, 1], ['2%', '-2%']);
  const titleOffsetY = useTransform(smoothNy, [-1, 1], ['2%', '-2%']);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 8000);
    return () => clearInterval(intervalRef.current);
  }, [movies.length]);

  if (!currentMovie) return null;

  const handlePlay = () => navigate(`/watch/${currentMovie.id}`);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '90vh', minHeight: '650px' }}
    >
      {/* Background layer — moves WITH cursor */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url(${ATMOSPHERIC_BG})`,
          x: bgOffsetX,
          y: bgOffsetY,
          scale: heroScale,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
        <div className="absolute inset-0" style={{
          background: `linear-gradient(90deg, ${colors.primary}20 0%, transparent 40%, transparent 60%, ${colors.secondary}15 100%)`,
        }} />
      </motion.div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[8%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full"
          style={{
            x: useTransform(smoothNx, [-1, 1], ['-2%', '2%']),
            y: useTransform(smoothNy, [-1, 1], ['-2%', '2%']),
            background: `radial-gradient(circle, ${colors.primary}30, transparent 70%)`,
          }}
        />
        <motion.div
          className="absolute bottom-[25%] right-[12%] w-[25vw] h-[25vw] max-w-[350px] max-h-[350px] rounded-full"
          style={{
            x: useTransform(smoothNx, [-1, 1], ['2%', '-2%']),
            y: useTransform(smoothNy, [-1, 1], ['2%', '-2%']),
            background: `radial-gradient(circle, ${colors.secondary}25, transparent 70%)`,
          }}
        />
      </div>

      {/* Foreground content — moves OPPOSITE cursor (parallax depth) */}
      <motion.div
        className="absolute inset-0 flex items-center z-10"
        style={{ y: contentY }}
      >
        <div className="px-6 sm:px-8 md:px-12 lg:px-16 w-full">
          <motion.div
            className="max-w-lg sm:max-w-xl md:max-w-2xl"
            style={{ x: fgOffsetX, y: fgOffsetY }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md border mb-4"
              style={{
                background: `${colors.primary}20`,
                borderColor: `${colors.primary}40`,
                color: colors.primary,
              }}
            >
              {currentMovie.genres?.[0] || 'Featured'}
            </motion.span>

            <motion.h1
              style={{ x: titleOffsetX, y: titleOffsetY }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-3 drop-shadow-2xl leading-tight"
            >
              {currentMovie.title}
            </motion.h1>

            <motion.div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base text-white/70 mb-4">
              <span className="font-bold" style={{ color: colors.primary }}>
                {currentMovie.rating}% Match
              </span>
              <span className="mx-1 text-white/20">&bull;</span>
              <span>{currentMovie.year}</span>
              <span className="mx-1 text-white/20">&bull;</span>
              <span className="border border-white/30 px-2 py-0.5 text-xs font-medium">
                {currentMovie.maturityRating}
              </span>
              <span className="mx-1 text-white/20">&bull;</span>
              <span>{currentMovie.duration}</span>
            </motion.div>

            <motion.p className="text-sm sm:text-base md:text-lg text-white/60 mb-6 md:mb-8 line-clamp-3 max-w-prose leading-relaxed">
              {currentMovie.description}
            </motion.p>

            <motion.div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={handlePlay}
                className="flex items-center gap-2 sm:gap-3 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `${colors.primary}60 0px 8px 24px`,
                }}
              >
                <FiPlay size={20} />
                <span>Play</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={handlePlay}
                className="flex items-center gap-2 sm:gap-3 bg-white/[0.06] backdrop-blur-xl text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-base sm:text-lg border border-white/10 hover:bg-white/[0.15] hover:border-white/30 transition-all duration-300"
              >
                <FiInfo size={20} />
                <span>More Info</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Dot indicators */}
      <div className="absolute z-10 bottom-8 right-4 sm:right-6 md:right-12 flex gap-2">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i === currentIndex ? '32px' : '16px',
              background: i === currentIndex
                ? `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
                : 'rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}
      </div>
    </section>
  );
};
