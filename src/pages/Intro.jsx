import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Intro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('logo');
  const particlesRef = useRef([]);
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.15,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  const playStartupSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);

      const notes = [
        { freq: 220, time: 0, dur: 0.15 },
        { freq: 277, time: 0.12, dur: 0.15 },
        { freq: 330, time: 0.24, dur: 0.2 },
        { freq: 440, time: 0.4, dur: 0.25 },
        { freq: 554, time: 0.55, dur: 0.3 },
        { freq: 660, time: 0.7, dur: 0.35 },
        { freq: 880, time: 0.9, dur: 0.5 },
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
        noteGain.gain.setValueAtTime(0, ctx.currentTime + time);
        noteGain.gain.linearRampToValueAtTime(1, ctx.currentTime + time + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);
        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + dur + 0.05);
      });

      const pad = ctx.createOscillator();
      const padGain = ctx.createGain();
      pad.type = 'sawtooth';
      pad.frequency.setValueAtTime(110, ctx.currentTime);
      padGain.gain.setValueAtTime(0.02, ctx.currentTime);
      padGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.5);
      padGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
      pad.connect(padGain);
      padGain.connect(masterGain);
      pad.start();
      pad.stop(ctx.currentTime + 2.5);

      setTimeout(() => ctx.close(), 3000);
    } catch {
      // audio not supported
    }
  };

  useEffect(() => {
    playStartupSound();

    const duration = 3000;
    const interval = 50;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const pct = Math.min((current / steps) * 100, 100);
      setProgress(pct);

      if (pct < 30) setPhase('logo');
      else if (pct < 60) setPhase('tagline');
      else if (pct < 85) setPhase('loading');
      else setPhase('complete');

      if (current >= steps) {
        clearInterval(timer);
        setIsVisible(false);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isVisible && onComplete) {
      const timeout = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] bg-[#050510] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1f] to-[#050510]" />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(239, 68, 68, 0.08), transparent 60%)',
          }} />

          <div className="absolute inset-0 overflow-hidden">
            {particlesRef.current.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: `rgba(239, 68, 68, ${p.opacity})`,
                  boxShadow: `0 0 ${p.size * 2}px rgba(239, 68, 68, ${p.opacity * 0.5})`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, p.vx * 50, 0],
                  opacity: [p.opacity, p.opacity * 1.5, p.opacity],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: 'blur(20px)' }}
              animate={{
                scale: phase === 'logo' ? [0.3, 1.1, 1] : 1,
                opacity: 1,
                filter: 'blur(0px)',
              }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-streamly-red via-red-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl"
                  style={{ boxShadow: '0 0 60px rgba(239, 68, 68, 0.3), 0 0 120px rgba(239, 68, 68, 0.1)' }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 60px rgba(239, 68, 68, 0.3), 0 0 120px rgba(239, 68, 68, 0.1)',
                      '0 0 80px rgba(239, 68, 68, 0.5), 0 0 160px rgba(239, 68, 68, 0.2)',
                      '0 0 60px rgba(239, 68, 68, 0.3), 0 0 120px rgba(239, 68, 68, 0.1)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-white font-black text-5xl tracking-wider">S</span>
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-streamly-red/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-streamly-red/20"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {phase === 'logo' && (
                <motion.h1
                  key="title"
                  initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -40, opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  className="text-6xl md:text-8xl font-black text-white tracking-[0.15em] mb-4"
                >
                  STREAMLY
                </motion.h1>
              )}

              {phase === 'tagline' && (
                <motion.div key="tagline">
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-streamly-gray-light text-lg md:text-xl tracking-[0.3em] uppercase mb-2"
                  >
                    Experience Cinema
                  </motion.p>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-white/30 text-sm tracking-[0.2em]"
                  >
                    Like Never Before
                  </motion.p>
                </motion.div>
              )}

              {phase === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <p className="text-streamly-gray-light text-sm tracking-[0.2em] uppercase">
                    Preparing your experience
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-streamly-red to-purple-600"
                        animate={{
                          y: [0, -12, 0],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex flex-col items-center gap-2">
              <div className="w-48 md:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-streamly-red via-red-500 to-purple-600 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
              <span className="text-white/20 text-xs font-mono tracking-wider">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-streamly-red/40"
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;
