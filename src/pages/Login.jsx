import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { login, googleLogin, error, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const generated = [];
    for (let i = 0; i < 40; i++) {
      generated.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    setParticles(generated);
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y + p.speed > window.innerHeight ? -10 : p.y + p.speed,
        x: p.x + Math.sin(Date.now() * 0.001 + p.id) * 0.3,
      })));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      playSuccessSound();
      toast.success('Welcome back!');
      navigate('/home', { replace: true });
    } catch {
      // error is set in context and displayed via toast above
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      await googleLogin();
      playSuccessSound();
      toast.success('Signed in with Google!');
      navigate('/home', { replace: true });
    } catch {
      // error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const playSuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      setTimeout(() => ctx.close(), 500);
    } catch { /* audio not supported */ }
  };

  return (
    <div className="min-h-screen bg-[#050510] overflow-hidden relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1f] to-[#050510]" />
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.12), transparent 40%)`
      }} />
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full bg-streamly-red/20" style={{
          left: p.x, top: p.y, width: p.size, height: p.size, filter: 'blur(1px)', opacity: p.opacity,
        }} />
      ))}

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-streamly-red to-purple-600 rounded-2xl blur opacity-30" />
        <div className="relative backdrop-blur-xl bg-[#0a0a1f]/80 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-streamly-red to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-streamly-red/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-streamly-gray-light text-sm mt-1">Sign in to continue watching</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-streamly-gray" size={18} />
              <input
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 transition-all"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-streamly-gray" size={18} />
              <input
                type={showPassword ? 'text' : 'password'} placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-streamly-gray hover:text-white">
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-streamly-red to-red-600 text-white font-medium rounded-lg disabled:opacity-50 shadow-lg shadow-streamly-red/20"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0a1f] text-streamly-gray-light">or</span>
            </div>
          </div>

          <button
            onClick={handleGoogle} disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <p className="text-center text-sm text-streamly-gray-light mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:text-streamly-red font-medium transition-colors">
              Sign up
            </Link>
          </p>
          <p className="text-center text-xs text-streamly-gray mt-3">
            <Link to="/forgot-password" className="hover:text-white transition-colors">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
