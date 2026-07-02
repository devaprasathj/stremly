import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiSettings, FiClock, FiHeart, FiCamera,
  FiMonitor, FiVolume2, FiType,
  FiLogOut, FiSave, FiEdit2, FiLoader,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { PageTransition } from '../../animations/PageTransitions';
import { GlassCard } from '../../components/common/GlassCard';
import { useAuth } from '../../hooks/useAuth';
import { UserDashboard } from '../../components/dashboard/UserDashboard';
import { WatchHistory } from '../../components/dashboard/WatchHistory';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiUser },
  { id: 'history', label: 'Watch History', icon: FiClock },
  { id: 'favorites', label: 'Favorites', icon: FiHeart },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [autoplay, setAutoplay] = useState(true);
  const [subtitles, setSubtitles] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        await updateProfile({ photoURL: dataUrl });
        toast.success('Profile photo updated');
        setUploading(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read image');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error('Failed to upload photo');
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleSaveProfile = async () => {
    if (displayName.trim() && displayName !== user?.displayName) {
      await updateProfile({ displayName: displayName.trim() });
      toast.success('Name updated');
    }
    setIsEditing(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-streamly-dark pt-24 pb-16 px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white/10">
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=ff1e2d&color=fff&size=128`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <FiLoader size={24} className="text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                >
                  <FiCamera size={24} className="text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xl font-bold text-white focus:outline-none focus:border-streamly-red/50"
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="p-2 bg-streamly-red rounded-lg text-white hover:bg-red-700 transition-colors"
                    >
                      <FiSave size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{user?.displayName || 'User'}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-streamly-gray hover:text-white transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  </div>
                )}
                <p className="text-streamly-gray-light">{user?.email}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-streamly-gray">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Active
                  </span>
                  <span>Member since 2024</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-streamly-gray-light hover:text-white transition-colors"
              >
                <FiLogOut size={16} />
                Sign Out
              </button>
            </div>
          </GlassCard>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
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
            {activeTab === 'dashboard' && <UserDashboard />}
            {activeTab === 'history' && <WatchHistory />}
            {activeTab === 'favorites' && (
              <GlassCard className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FiHeart className="text-streamly-red" />
                  Favorites
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="aspect-video bg-white/5 rounded-lg flex items-center justify-center border border-white/10"
                    >
                      <FiHeart className="text-streamly-red/50" size={24} />
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}
            {activeTab === 'settings' && (
              <GlassCard className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FiSettings />
                  Preferences
                </h2>
                <div className="space-y-6 max-w-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiVolume2 size={18} className="text-streamly-gray" />
                      <div>
                        <p className="text-white font-medium">Autoplay</p>
                        <p className="text-xs text-streamly-gray">Auto-play next episode</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAutoplay(!autoplay)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        autoplay ? 'bg-streamly-red' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        animate={{ x: autoplay ? 24 : 2 }}
                        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiType size={18} className="text-streamly-gray" />
                      <div>
                        <p className="text-white font-medium">Subtitles</p>
                        <p className="text-xs text-streamly-gray">Display subtitles by default</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSubtitles(!subtitles)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        subtitles ? 'bg-streamly-red' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        animate={{ x: subtitles ? 24 : 2 }}
                        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                      />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <FiMonitor size={18} className="text-streamly-gray" />
                      <p className="text-white font-medium">Video Quality</p>
                    </div>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-streamly-red/50"
                    >
                      <option value="auto">Auto</option>
                      <option value="low">Low (480p)</option>
                      <option value="medium">Medium (720p)</option>
                      <option value="high">High (1080p)</option>
                      <option value="ultra">Ultra (4K)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiVolume2 size={18} className="text-streamly-gray" />
                      <div>
                        <p className="text-white font-medium">Audio Language</p>
                        <p className="text-xs text-streamly-gray">Preferred audio language</p>
                      </div>
                    </div>
                    <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-streamly-red/50">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                    </select>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-streamly-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors mt-4"
                  >
                    Save Preferences
                  </motion.button>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
