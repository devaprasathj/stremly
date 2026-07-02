import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_DURATION = 5000;
const LS_KEY = 'streamly_intro_seen';

const playStreamlySound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.2, ctx.currentTime);

    const playNote = (freq: number, start: number, dur: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + dur * 0.3);
      osc.frequency.exponentialRampToValueAtTime(freq, start + dur);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(start);
      osc.stop(start + dur);
    };

    playNote(440, ctx.currentTime, 0.2, 'triangle');
    playNote(554.37, ctx.currentTime + 0.15, 0.15, 'triangle');
    playNote(659.25, ctx.currentTime + 0.3, 0.15, 'triangle');
    playNote(880, ctx.currentTime + 0.45, 0.6, 'triangle');
    playNote(659.25, ctx.currentTime + 0.45, 0.8, 'sawtooth');

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(8000, ctx.currentTime + 1);
    masterGain.connect(filter);
    filter.connect(ctx.destination);

    setTimeout(() => ctx.close(), 3000);
  } catch {
    /* audio not supported */
  }
};

export const IntroScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const playedRef = useRef(false);

  useEffect(() => {
    const seen = localStorage.getItem(LS_KEY);
    if (seen === 'true') {
      onComplete?.();
      return;
    }
    setShow(true);

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setShow(false);
        localStorage.setItem(LS_KEY, 'true');
        onComplete?.();
      }, 800);
    }, INTRO_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    if (show && !playedRef.current) {
      playedRef.current = true;
      playStreamlySound();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[99999] bg-[#0a0a0f] flex items-center justify-center overflow-hidden"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-streamly-red/10 rounded-full blur-[150px] animate-aurora" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/8 rounded-full blur-[100px] animate-aurora" style={{ animationDelay: '4s' }} />
          </div>

          <motion.div
            initial={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
            animate={
              exiting
                ? {
                    scale: 1.5,
                    opacity: 0,
                    filter: 'blur(20px)',
                    transition: { duration: 0.6, ease: 'easeIn' },
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px)',
                    textShadow: [
                      '0 0 20px rgba(255,45,85,0)',
                      '0 0 40px rgba(255,45,85,0.3)',
                      '0 0 60px rgba(99,102,241,0.5)',
                      '0 0 40px rgba(236,72,153,0.3)',
                      '0 0 20px rgba(6,182,212,0)',
                    ],
                    transition: {
                      scale: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
                      opacity: { duration: 0.6, ease: 'easeOut' },
                      textShadow: { duration: 2.5, ease: 'easeInOut' },
                    },
                  }
            }
            className="relative z-10"
          >
            <div className="text-center">
              <div className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[-0.04em] font-['Space_Grotesk',sans-serif] text-gradient-streamly-logo logo-float select-none">
                STREAMLY
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={
                  exiting
                    ? { width: 0, transition: { duration: 0.3 } }
                    : { width: '100%', transition: { duration: 1.5, delay: 0.8, ease: 'easeInOut' } }
                }
                className="h-[2px] bg-gradient-to-r from-streamly-red via-purple-500 to-cyan-400 mx-auto mt-6 rounded-full max-w-sm"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={
                  exiting
                    ? { opacity: 0, y: -20, transition: { duration: 0.3 } }
                    : { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.5 } }
                }
                className="text-white/30 text-sm mt-6 tracking-[0.25em] uppercase font-light"
              >
                Next-Gen Streaming
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
