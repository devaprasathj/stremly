import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FiPlay, FiInfo, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types';
import { heroTextAnimation } from '../../animations';
import { APP_NAME, getCategoryColor } from '../../utils/constants';

const ATMOSPHERIC_BG = 'https://images.unsplash.com/photo-1470071459604-07b7b98db4a9?q=80&w=1920&auto=format&fit=crop';

interface HeroBannerProps {
  movies: Movie[];
}

const FloatingOrbs = ({ colors }: { colors: { primary: string; secondary: string } }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute top-[15%] left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 animate-aurora"
      style={{
        background: `radial-gradient(circle, ${colors.primary}40, transparent 70%)`,
      }}
    />
    <div
      className="absolute bottom-[20%] right-[15%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full opacity-15 animate-aurora"
      style={{
        background: `radial-gradient(circle, ${colors.secondary}40, transparent 70%)`,
        animationDelay: '3s',
      }}
    />
    <div
      className="absolute top-[40%] right-[30%] w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] rounded-full opacity-10 animate-fog"
      style={{
        background: `radial-gradient(circle, ${colors.primary}30, transparent 70%)`,
        animationDelay: '5s',
      }}
    />
  </div>
);

export const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTrailerReady, setIsTrailerReady] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentMovie = movies[currentIndex] || movies[0];

  const categoryColors = useMemo(
    () => getCategoryColor(currentMovie?.genres),
    [currentMovie?.genres]
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 4]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
      setIsTrailerReady(false);
    }, 8000);
    return () => clearInterval(intervalRef.current);
  }, [movies.length]);

  if (!currentMovie) return null;

  const trailerUrl = currentMovie.trailerUrl;
  const handleInfoClick = () => navigate(`/watch/${currentMovie.id}`);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '85vh', minHeight: '600px' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${ATMOSPHERIC_BG})`,
              y: bgY,
              scale: heroScale,
              filter: useTransform(heroBlur, (v) => `blur(${v}px)`),
            }}
          >
            <img
              src={ATMOSPHERIC_BG}
              alt=""
              className="hidden"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = 'true';
                  const parent = target.closest('[style*="background-image"]') as HTMLElement;
                  if (parent) {
                    parent.style.backgroundImage = 'url(https://images.unsplash.com/photo-1470071459604-07b7b98db4a9?q=80&w=1920&auto=format&fit=crop)';
                  }
                  console.warn('[STREAMLY] Background image failed, using fallback');
                }
              }}
            />
          </motion.div>

          {/* Adaptive gradient overlays */}
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${categoryColors.primary}15 30%, transparent 60%, ${categoryColors.secondary}10 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 streamly-gradient-right" />
          <motion.div
            className="absolute inset-0 bg-[#0a0a0f]/30"
            style={{ opacity: overlayOpacity }}
          />

          {/* Dynamic floating orbs */}
          <FloatingOrbs colors={{ primary: categoryColors.primary, secondary: categoryColors.secondary }} />

          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>

      {/* STREAMLY watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1] overflow-hidden"
        style={{ whiteSpace: 'nowrap' }}
      >
        <span
          className="font-display font-black leading-none"
          style={{
            fontSize: 'clamp(7rem, 28vw, 22rem)',
            color: `${categoryColors.primary}08`,
            letterSpacing: '0.08em',
            transform: 'translateY(-8%)',
          }}
        >
          {APP_NAME.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[2] p-6 sm:p-8 md:p-12 lg:p-16 pb-36 sm:pb-40 md:pb-48"
        style={{ y: contentY }}
      >
        <div className="max-w-lg sm:max-w-xl md:max-w-2xl">
          {/* Category badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={heroTextAnimation}
            className="mb-3"
          >
            <span
              className="inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md border"
              style={{
                background: `${categoryColors.primary}20`,
                borderColor: `${categoryColors.primary}40`,
                color: categoryColors.primary,
              }}
            >
              {currentMovie.genres?.[0] || 'Featured'}
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={heroTextAnimation}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 md:mb-4 drop-shadow-2xl leading-tight"
          >
            {currentMovie.title}
          </motion.h1>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={heroTextAnimation}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base text-white/70 mb-3 md:mb-4"
          >
            <span
              className="font-bold"
              style={{ color: categoryColors.primary }}
            >
              {currentMovie.rating}% Match
            </span>
            <span className="mx-1 text-white/20">&bull;</span>
            <span>{currentMovie.year}</span>
            <span className="mx-1 text-white/20">&bull;</span>
            <span className="border border-white/30 px-2 py-0.5 text-xs font-medium">{currentMovie.maturityRating}</span>
            <span className="mx-1 text-white/20">&bull;</span>
            <span>{currentMovie.duration}</span>
          </motion.div>

          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={heroTextAnimation}
            className="text-sm sm:text-base md:text-lg text-white/60 mb-6 md:mb-8 line-clamp-3 max-w-prose leading-relaxed"
          >
            {currentMovie.description}
          </motion.p>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={heroTextAnimation}
            className="flex items-center gap-3 sm:gap-4 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleInfoClick}
              className="flex items-center gap-2 sm:gap-3 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${categoryColors.primary}, ${categoryColors.secondary})`,
                boxShadow: `${categoryColors.primary}60 0px 8px 24px`,
              }}
            >
              <FiPlay size={20} className="sm:w-6 sm:h-6" />
              <span>Play</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleInfoClick}
              className="flex items-center gap-2 sm:gap-3 bg-white/[0.06] backdrop-blur-xl text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-base sm:text-lg hover:bg-white/[0.15] transition-all duration-300 border border-white/10 hover:border-white/30"
            >
              <FiInfo size={20} className="sm:w-6 sm:h-6" />
              <span>More Info</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Mute button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute z-[2] bottom-32 sm:bottom-36 md:bottom-40 right-4 sm:right-6 md:right-12 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        {isMuted ? <FiVolumeX size={18} className="sm:w-5 sm:h-5" /> : <FiVolume2 size={18} className="sm:w-5 sm:h-5" />}
      </button>

      {/* Dot indicators */}
      <div className="absolute z-[2] bottom-8 right-4 sm:right-6 md:right-12 flex gap-2">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentIndex(index); setIsTrailerReady(false); }}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: index === currentIndex ? '32px' : '16px',
              background: index === currentIndex
                ? `linear-gradient(90deg, ${categoryColors.primary}, ${categoryColors.secondary})`
                : 'rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}
      </div>

      {/* Energy particles at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 left-[10%] w-1 h-16 rounded-full opacity-40 animate-energy"
          style={{ background: `linear-gradient(to top, ${categoryColors.primary}, transparent)` }}
        />
        <div
          className="absolute bottom-0 left-[30%] w-1 h-24 rounded-full opacity-30 animate-energy"
          style={{
            background: `linear-gradient(to top, ${categoryColors.secondary}, transparent)`,
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute bottom-0 left-[55%] w-1 h-20 rounded-full opacity-35 animate-energy"
          style={{
            background: `linear-gradient(to top, ${categoryColors.primary}, transparent)`,
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute bottom-0 left-[75%] w-1 h-14 rounded-full opacity-25 animate-energy"
          style={{
            background: `linear-gradient(to top, ${categoryColors.secondary}, transparent)`,
            animationDelay: '0.5s',
          }}
        />
        <div
          className="absolute bottom-0 left-[90%] w-1 h-18 rounded-full opacity-30 animate-energy"
          style={{
            background: `linear-gradient(to top, ${categoryColors.primary}, transparent)`,
            animationDelay: '1.5s',
          }}
        />
      </div>
    </section>
  );
};
