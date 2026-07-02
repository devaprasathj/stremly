import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, googleLogin, error, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error, setError]);

  const handleNext = () => {
    if (step === 1 && !name.trim()) { toast.error('Name is required'); return; }
    if (step === 2 && !email.trim()) { toast.error('Email is required'); return; }
    setStep(s => Math.min(s + 1, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { toast.error('Please agree to the terms'); return; }
    setIsSubmitting(true);
    try {
      await signup(email, password, name);
      toast.success('Account created successfully!');
      navigate('/home', { replace: true });
    } catch {
      // error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      await googleLogin();
      toast.success('Signed in with Google!');
      navigate('/home', { replace: true });
    } catch {
      // error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] overflow-hidden relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1f] to-[#050510]" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-streamly-red to-purple-600 rounded-2xl blur opacity-30" />
        <div className="relative backdrop-blur-xl bg-[#0a0a1f]/80 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-streamly-red to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-streamly-red/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Join Stremly</h1>
            <p className="text-streamly-gray-light text-sm mt-1">Create your account</p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-8 h-1 rounded-full transition-all ${step >= s ? 'bg-streamly-red' : 'bg-white/20'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div>
                <label className="text-streamly-gray-light text-sm mb-2 block">What's your name?</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-streamly-gray" size={18} />
                  <input type="text" placeholder="Full Name" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 transition-all"
                  />
                </div>
                <button type="button" onClick={handleNext}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-streamly-red to-red-600 text-white font-medium rounded-lg">
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="text-streamly-gray-light text-sm mb-2 block">What's your email?</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-streamly-gray" size={18} />
                  <input type="email" placeholder="Email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 transition-all"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-lg">Back</button>
                  <button type="button" onClick={handleNext}
                    className="flex-1 py-3 bg-gradient-to-r from-streamly-red to-red-600 text-white font-medium rounded-lg">Next</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="text-streamly-gray-light text-sm mb-2 block">Create a password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-streamly-gray" size={18} />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-streamly-gray">
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="terms" checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-streamly-red" />
                  <label htmlFor="terms" className="text-xs text-streamly-gray-light">
                    I agree to the <span className="text-white">Terms of Service</span> and <span className="text-white">Privacy Policy</span>
                  </label>
                </div>

                <div className="flex gap-2 mt-4">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-lg">Back</button>
                  <button
                    type="submit" disabled={isSubmitting}
                    className="flex-1 py-3 bg-gradient-to-r from-streamly-red to-red-600 text-white font-medium rounded-lg disabled:opacity-50">
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
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
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-streamly-red font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
