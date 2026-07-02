import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiPlay, FiTrash2, FiCalendar } from 'react-icons/fi';
import { useMovies } from '../../hooks/useMovies';
import { GlassCard } from '../common/GlassCard';
import { SafeImage } from '../common/SafeImage';
import { getImageUrl } from '../../utils/imageUtils';

export const WatchHistory = () => {
  const { trending } = useMovies();
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState(
    trending.slice(0, 8).map((m, i) => ({
      ...m,
      progress: Math.random(),
      watchedDate: new Date(Date.now() - i * 86400000),
    }))
  );

  const handleClearHistory = () => {
    setHistoryItems([]);
  };

  const handleRemoveItem = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (historyItems.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <FiClock size={28} className="text-streamly-gray" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Watch History</h3>
        <p className="text-streamly-gray-light text-sm">Movies you watch will appear here</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FiClock className="text-streamly-red" />
          Watch History
        </h2>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1 text-xs text-streamly-red hover:underline"
        >
          <FiTrash2 size={12} />
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {historyItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
              transition={{ delay: i * 0.03 }}
              layout
              className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div
                className="w-20 h-14 rounded overflow-hidden flex-shrink-0 cursor-pointer bg-[#14141a]"
                onClick={() => navigate(`/watch/${item.id}`)}
              >
                <SafeImage
                  src={getImageUrl(item.thumbnailUrl, 'thumbnail', getImageUrl(item.posterUrl, 'poster'))}
                  alt={item.title}
                  poster
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/watch/${item.id}`)}
              >
                <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                <div className="flex items-center gap-3 text-xs text-streamly-gray mt-1">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={10} />
                    {item.watchedDate.toLocaleDateString()}
                  </span>
                  <span>
                    {Math.floor(item.progress * 100)}% complete
                  </span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress * 100}%` }}
                    className="h-full bg-streamly-red rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => navigate(`/watch/${item.id}`)}
                  className="p-2 rounded-full bg-streamly-red text-white hover:bg-red-700 transition-colors"
                  title="Watch again"
                >
                  <FiPlay size={14} />
                </button>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 rounded-full bg-white/10 text-streamly-gray hover:text-streamly-red hover:bg-white/20 transition-all"
                  title="Remove from history"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
