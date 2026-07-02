import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiFilm, FiHeart, FiClock, FiPlay,
  FiTrendingUp, FiStar, FiList,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useMovies } from '../../hooks/useMovies';
import { GlassCard } from '../common/GlassCard';
import { SafeImage } from '../common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

export const UserDashboard = () => {
  const { user } = useAuth();
  const { trending } = useMovies();
  const navigate = useNavigate();

  const stats = [
    { label: 'Movies Watched', value: '47', icon: FiFilm, color: 'from-streamly-red to-red-600' },
    { label: 'Watchlist', value: '12', icon: FiList, color: 'from-accent-blue to-blue-600' },
    { label: 'Favorites', value: '8', icon: FiHeart, color: 'from-accent-pink to-pink-600' },
    { label: 'Hours Watched', value: '156', icon: FiClock, color: 'from-accent-purple to-purple-600' },
  ];

  const recentMovies = trending.slice(0, 4);

  const quickActions = [
    { label: 'Continue Watching', icon: FiPlay, path: '/', color: 'bg-streamly-red' },
    { label: 'Browse Movies', icon: FiFilm, path: '/movies', color: 'bg-accent-blue' },
    { label: 'My List', icon: FiList, path: '/my-list', color: 'bg-accent-purple' },
    { label: 'Top Rated', icon: FiStar, path: '/movies', color: 'bg-green-600' },
  ];

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-1">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
          </h2>
          <p className="text-streamly-gray-light text-sm mb-6">Here's your activity overview</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-xl p-4 bg-white/5 border border-white/10"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full bg-gradient-to-br ${stat.color} opacity-20`} />
              <div className="relative z-10">
                <stat.icon size={20} className="text-streamly-gray mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-streamly-gray mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiClock size={16} className="text-streamly-red" />
              Recently Watched
            </h3>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs text-streamly-red hover:underline"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recentMovies.map((movie, i) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-video rounded-lg overflow-hidden bg-[#14141a] relative">
                  <SafeImage
                    src={getImageUrl(movie.thumbnailUrl, 'thumbnail', getImageUrl(movie.posterUrl, 'poster'))}
                    alt={movie.title}
                    poster
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs text-streamly-gray-light mt-1 truncate">{movie.title}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp size={16} className="text-streamly-red" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(action.path)}
                className={`flex items-center gap-3 p-4 rounded-xl text-white font-medium text-sm transition-all ${action.color} hover:opacity-90`}
              >
                <action.icon size={18} />
                {action.label}
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
