import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const playEntrySound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [261, 329, 392, 523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
      setTimeout(() => ctx.close(), 2000);
    } catch {
      /* audio not supported */
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    playEntrySound();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#050510]">
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-streamly-red/20 via-transparent to-[#050510]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-streamly-red/10 via-transparent to-transparent" />

        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-streamly-red to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white font-black text-3xl">S</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-wider">
            STREAMLY
          </h1>

          <p className="text-streamly-gray-light text-lg mt-4">
            Welcome to the future of entertainment
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6">
          Trending Now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-lg bg-gradient-to-br from-white/5 to-white/10 border border-white/5 overflow-hidden group cursor-pointer"
            >
              <div className="w-full h-full flex items-center justify-center text-streamly-gray text-sm">
                Coming Soon
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
