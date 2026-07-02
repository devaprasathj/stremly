import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiUser, FiChevronDown, FiLogOut, FiSettings, FiList } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const NAV_LINKS = [
  { label: 'Home', path: '/home' },
  { label: 'TV Shows', path: '/tv-shows' },
  { label: 'Movies', path: '/movies' },
  { label: 'My List', path: '/my-list' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#06060b]/95 backdrop-blur-xl shadow-2xl shadow-black/40'
          : 'bg-gradient-to-b from-[#0a0a0f]/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center">
            <span className="text-2xl font-bold tracking-[-0.04em] font-['Space_Grotesk',sans-serif] text-gradient-streamly-logo logo-float transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(167,85,247,0.5)]">
              STREAMLY
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-streamly-gray hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/search')}
            className="text-white hover:text-streamly-red transition-colors"
          >
            <FiSearch size={20} />
          </motion.button>

          {isAuthenticated ? (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white hover:text-streamly-red transition-colors relative"
              >
                <FiBell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-streamly-red rounded-full text-[10px] flex items-center justify-center">
                  3
                </span>
              </motion.button>

              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-md overflow-hidden border-2 border-transparent group-hover:border-streamly-red transition-all">
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=ff2d55&color=fff`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <FiChevronDown className={`text-white text-xs transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-[#06060b]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-streamly-gray">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        {[
                          { icon: FiUser, label: 'Profile', path: '/profile' },
                          { icon: FiList, label: 'My List', path: '/my-list' },
                          { icon: FiSettings, label: 'Settings', path: '/profile' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => { navigate(item.path); setProfileMenuOpen(false); }}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-streamly-gray hover:text-white hover:bg-white/5 rounded transition-all"
                          >
                            <item.icon size={16} />
                            {item.label}
                          </button>
                        ))}
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button
                          onClick={() => { logout(); setProfileMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-streamly-gray hover:text-white hover:bg-white/5 rounded transition-all"
                        >
                          <FiLogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-streamly-red to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-all shadow-lg shadow-streamly-red/30"
            >
              Sign In
            </motion.button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#06060b]/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-medium ${
                    location.pathname === link.path ? 'text-white' : 'text-streamly-gray'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
