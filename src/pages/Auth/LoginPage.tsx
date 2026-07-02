import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number; opacity: number }>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const formRef = useRef<HTMLDivElement>(null);
  const { login, signup, googleLogin, loading, error: authError } = useAuth();

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        const newY = p.y + p.speed;
        const newX = p.x + Math.sin(Date.now() * 0.001 + p.id) * 0.5;
        const newOpacity = p.opacity + Math.sin(Date.now() * 0.001) * 0.1;
        if (newY > window.innerHeight) {
          return { ...p, y: -10, x: Math.random() * window.innerWidth, opacity: p.opacity };
        }
        return { ...p, y: newY, x: newX, opacity: Math.max(0.1, Math.min(0.6, newOpacity)) };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  };

  const playLoginSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
      setTimeout(() => audioContext.close(), 200);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isLogin && !name.trim()) {
      setError('Name is required');
      setIsLoading(false);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
        playLoginSound();
        toast.success('Welcome back!');
      } else {
        await signup(email, password, name);
        toast.success('Account created successfully!');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await googleLogin();
      playLoginSound();
      toast.success('Signed in with Google!');
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-[#050510] overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1f] to-[#050510]" />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.15), transparent 40%)`
        }} />
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-streamly-red/20"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              filter: 'blur(1px)',
              opacity: p.opacity,
              animation: `float ${p.speed * 20}s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 min-h-screen flex items-center justify-center p-4"
      >
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          onMouseEnter={handleMouseEnter}
          className="w-full max-w-md relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-streamly-red to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
          <div className="relative backdrop-blur-xl bg-[#0a0a1f]/80 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-streamly-red to-purple-600 flex items-center justify-center shadow-lg shadow-streamly-red/30">
                    <span className="text-white font-bold text-2xl">S</span>
                  </div>
                  <div className="absolute inset-0 rounded-full border border-streamly-red/30 animate-pulse" />
                </motion.div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">STREAMLY</h1>
              <p className="text-streamly-gray-light text-sm">Welcome to the future of streaming</p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative group/input"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-streamly-gray" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 focus:bg-white/10 transition-all duration-300"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group/input"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-streamly-gray" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 focus:bg-white/10 transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative group/input"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-streamly-gray" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 focus:bg-white/10 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-streamly-red transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-streamly-gray" />
                  ) : (
                    <FiEye className="h-5 w-5 text-streamly-gray" />
                  )}
                </button>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || isLoading}
                className="w-full py-3 bg-gradient-to-r from-streamly-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-streamly-red/20"
              >
                {loading || isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </motion.button>
            </form>

            <div className="mt-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#0a0a1f] text-streamly-gray-light">or</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={loading || isLoading}
                className="mt-4 w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
              >
                <FcGoogle size={24} />
                <span>Continue with Google</span>
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-streamly-gray-light text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={switchAuthMode}
                  className="text-white hover:text-streamly-red font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
              {isLogin && (
                <div className="mt-4">
                  <button className="text-streamly-gray hover:text-white text-sm transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}
            </motion.div>

            <div className="absolute -top-2 -right-2 w-20 h-20 bg-streamly-red/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-purple-600/10 rounded-full blur-xl animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;