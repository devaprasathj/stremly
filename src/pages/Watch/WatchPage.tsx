import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPause, FiVolume2, FiVolumeX,
  FiMaximize, FiMinimize, FiChevronLeft,
  FiSkipForward, FiSettings, FiMonitor,
} from 'react-icons/fi';
import ReactPlayer from 'react-player/youtube';
import { useMovies } from '../../hooks/useMovies';
import { Movie } from '../../types';
import { QUALITY_OPTIONS, PLAYBACK_SPEEDS } from '../../utils/constants';
import { VideoPlayer } from '../../components/movie/VideoPlayer';
import { SafeImage } from '../../components/common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

const WatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentMovie, fetchMovieDetails, trending, loading } = useMovies();
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (id) fetchMovieDetails(id);
  }, [id, fetchMovieDetails]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  if (loading || !currentMovie) {
    return (
      <div className="min-h-screen bg-streamly-dark flex items-center justify-center">
        <div className="space-y-4">
          <div className="w-16 h-16 border-4 border-streamly-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-streamly-gray-light">Loading video...</p>
        </div>
      </div>
    );
  }

  const relatedMovies = trending.filter((m) =>
    m.id !== currentMovie.id && m.genres?.some((g) => currentMovie.genres?.includes(g))
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-streamly-dark">
      <div
        className="relative w-full bg-black"
        style={{ height: '75vh' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        <VideoPlayer
          url={currentMovie.videoUrl || currentMovie.trailerUrl}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"
            >
              <div className="absolute top-0 left-0 right-0 p-6 pointer-events-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-white hover:text-streamly-red transition-colors"
                >
                  <FiChevronLeft size={24} />
                  <span className="text-sm font-medium">Back</span>
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
                <div className="max-w-4xl">
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{currentMovie.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-streamly-gray-light mb-2">
                    <span className="text-green-500 font-semibold">{currentMovie.rating}% Match</span>
                    <span>{currentMovie.year}</span>
                    <span className="border border-white/30 px-2 py-0.5 text-xs">{currentMovie.maturityRating}</span>
                    <span>{currentMovie.duration}</span>
                  </div>
                  <p className="text-white/70 text-sm max-w-2xl line-clamp-2">{currentMovie.description}</p>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-streamly-red rounded-full animate-pulse" />
                  <span className="text-xs text-white/60">Watching</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-streamly-gray-light leading-relaxed">{currentMovie.description}</p>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-sm font-semibold text-streamly-gray mb-2">Cast</h3>
                <p className="text-sm text-white">
                  {currentMovie.cast?.slice(0, 5).join(', ') || 'Information coming soon'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-streamly-gray mb-2">Director</h3>
                <p className="text-sm text-white">{currentMovie.director || 'Information coming soon'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-streamly-gray mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {currentMovie.genres?.map((genre) => (
                    <span key={genre} className="text-xs px-2 py-1 bg-white/10 rounded text-streamly-gray-light">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-streamly-gray mb-2">Language</h3>
                <p className="text-sm text-white">{currentMovie.language || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">More Like This</h2>
            <div className="space-y-3">
              {relatedMovies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/watch/${movie.id}`)}
                  className="flex gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group"
                >
                  <div className="w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-[#14141a] relative">
                    <SafeImage
                      src={getImageUrl(movie.thumbnailUrl, 'thumbnail', getImageUrl(movie.posterUrl, 'poster'))}
                      alt={movie.title}
                      poster
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{movie.title}</p>
                    <p className="text-xs text-streamly-gray mt-1">
                      {movie.rating}% Match • {movie.year}
                    </p>
                    <p className="text-xs text-streamly-gray truncate">{movie.genres?.slice(0, 2).join(', ')}</p>
                  </div>
                </motion.div>
              ))}
              {relatedMovies.length === 0 && (
                <p className="text-streamly-gray text-sm">No related movies found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
