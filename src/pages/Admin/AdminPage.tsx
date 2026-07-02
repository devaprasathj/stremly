import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBarChart2, FiFilm, FiUsers, FiDollarSign,
  FiTrendingUp, FiEdit2, FiTrash2, FiPlus,
  FiMail, FiCalendar, FiEye, FiStar,
} from 'react-icons/fi';
import { PageTransition } from '../../animations/PageTransitions';
import { GlassCard } from '../../components/common/GlassCard';
import { AnalyticsDashboard } from '../../components/admin/AnalyticsDashboard';
import { MovieUpload } from '../../components/admin/MovieUpload';

const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
  { id: 'movies', label: 'Movies', icon: FiFilm },
  { id: 'users', label: 'Users', icon: FiUsers },
  { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
];

const SAMPLE_MOVIES = [
  { id: '1', title: 'Inception', year: 2010, rating: 8.8, genre: 'Sci-Fi', status: 'Published' },
  { id: '2', title: 'The Dark Knight', year: 2008, rating: 9.0, genre: 'Action', status: 'Published' },
  { id: '3', title: 'Interstellar', year: 2014, rating: 8.7, genre: 'Sci-Fi', status: 'Draft' },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUpload, setShowUpload] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'movies':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Movie Management</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center gap-2 px-4 py-2 bg-streamly-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                {showUpload ? <FiFilm size={16} /> : <FiPlus size={16} />}
                {showUpload ? 'View Movies' : 'Add Movie'}
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {showUpload ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MovieUpload onComplete={() => setShowUpload(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlassCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-4 text-streamly-gray text-sm font-medium">Title</th>
                            <th className="text-left p-4 text-streamly-gray text-sm font-medium hidden md:table-cell">Year</th>
                            <th className="text-left p-4 text-streamly-gray text-sm font-medium hidden sm:table-cell">Rating</th>
                            <th className="text-left p-4 text-streamly-gray text-sm font-medium hidden md:table-cell">Genre</th>
                            <th className="text-left p-4 text-streamly-gray text-sm font-medium">Status</th>
                            <th className="text-right p-4 text-streamly-gray text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SAMPLE_MOVIES.map((movie, i) => (
                            <motion.tr
                              key={movie.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <td className="p-4 text-white font-medium">{movie.title}</td>
                              <td className="p-4 text-streamly-gray-light hidden md:table-cell">{movie.year}</td>
                              <td className="p-4 hidden sm:table-cell">
                                <span className="flex items-center gap-1 text-yellow-500">
                                  <FiStar size={14} />
                                  {movie.rating}
                                </span>
                              </td>
                              <td className="p-4 text-streamly-gray-light hidden md:table-cell">{movie.genre}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  movie.status === 'Published'
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                  {movie.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button className="p-1.5 text-streamly-gray hover:text-white transition-colors">
                                    <FiEye size={16} />
                                  </button>
                                  <button className="p-1.5 text-streamly-gray hover:text-accent-blue transition-colors">
                                    <FiEdit2 size={16} />
                                  </button>
                                  <button className="p-1.5 text-streamly-gray hover:text-streamly-red transition-colors">
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'users':
        return (
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold">
                    U{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">User {i + 1}</p>
                    <p className="text-xs text-streamly-gray truncate">user{i + 1}@example.com</p>
                    <div className="flex items-center gap-2 text-xs text-streamly-gray mt-1">
                      <FiCalendar size={10} />
                      <span>Joined Jan 2024</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-streamly-gray hover:text-white transition-colors">
                      <FiMail size={14} />
                    </button>
                    <button className="p-1.5 text-streamly-gray hover:text-streamly-red transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        );
      case 'analytics':
        return <AnalyticsDashboard detailed />;
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-streamly-dark pt-24 pb-16 px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Panel</h1>
          <p className="text-streamly-gray-light text-sm mt-1">Manage your streaming platform</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-streamly-red text-white shadow-lg shadow-streamly-red/25'
                  : 'bg-white/5 text-streamly-gray-light hover:bg-white/10 border border-white/10'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default AdminPage;
