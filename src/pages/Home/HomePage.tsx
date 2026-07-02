import { motion } from 'framer-motion';
import { HeroBanner } from '../../components/home/HeroBanner';
import { MovieRow } from '../../components/home/MovieRow';
import { ContinueWatching } from '../../components/home/ContinueWatching';
import { useMovies } from '../../hooks/useMovies';
import { useAuth } from '../../hooks/useAuth';
import { PageTransition } from '../../animations/PageTransitions';
import { fadeInUp, staggerContainer } from '../../animations';
import { HeroSkeleton } from '../../components/common/SkeletonLoader';

const HomePage = () => {
  const { trending, topRated, newReleases, popularTVShows, recommended, continueWatching, loading } = useMovies();
  const { isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-streamly-dark">
        <HeroSkeleton />
        <div className="space-y-6 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 md:px-12">
              <div className="h-6 w-48 bg-[#14141a] rounded animate-pulse mb-3" />
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="flex-shrink-0 w-[200px] md:w-[250px]">
                    <div className="aspect-video bg-[#14141a] rounded animate-pulse" />
                    <div className="h-4 bg-[#14141a] rounded mt-2 w-3/4 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-streamly-dark">
        <HeroBanner movies={trending} />

        <div className="h-6 sm:h-8 md:h-12" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-6 md:space-y-10 pb-16"
        >
          {isAuthenticated && continueWatching.length > 0 && (
            <motion.div variants={fadeInUp}>
              <ContinueWatching movies={continueWatching} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp}>
            <MovieRow title="Trending Now" movies={trending} />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <MovieRow title="Top Rated" movies={topRated} />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <MovieRow title="New Releases" movies={newReleases} />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <MovieRow title="Popular TV Shows" movies={popularTVShows} />
          </motion.div>

          {recommended.length > 0 && (
            <motion.div variants={fadeInUp}>
              <MovieRow title="Recommended For You" movies={recommended} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
