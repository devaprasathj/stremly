import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const PROFILES = [
  { id: '1', name: 'Alex', color: '#6366f1', emoji: '🎬' },
  { id: '2', name: 'Sam', color: '#ec4899', emoji: '🍿' },
  { id: '3', name: 'Jordan', color: '#14b8a6', emoji: '🎮' },
  { id: '4', name: 'Riley', color: '#f59e0b', emoji: '🎵' },
  { id: '5', name: 'Add Profile', color: '#2a2a35', emoji: '+' },
];

function ProfileCard({ profile, onSelect }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 });
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), { stiffness: 200, damping: 25 });
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), { stiffness: 200, damping: 25 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xv = (e.clientX - rect.left) / rect.width - 0.5;
    const yv = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xv);
    y.set(yv);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  const isAdd = profile.emoji === '+';

  return (
    <motion.button
      ref={cardRef}
      onClick={() => !isAdd && onSelect(profile)}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer outline-none group"
    >
      <div
        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl overflow-hidden transition-all duration-500"
        style={{
          background: isAdd
            ? 'rgba(255,255,255,0.04)'
                            : `linear-gradient(135deg, ${profile.color}30, ${profile.color}10)`,
          border: `2px solid ${hovered ? profile.color : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hovered
            ? `0 0 30px ${profile.color}40, inset 0 0 30px ${profile.color}10`
            : '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {/* Glass backdrop */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl" />

        {/* Neon edge glow ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, ${profile.color}60 0%, transparent 60%)`,
          }}
        />

        {/* Avatar content */}
        <span className="relative z-10 select-none">{profile.emoji}</span>

        {isAdd && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-3xl z-10"
            animate={{ rotate: hovered ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            +
          </motion.span>
        )}
      </div>

      <motion.span
        className="text-sm font-medium tracking-wide select-none"
        animate={{
          color: hovered ? profile.color : 'rgba(255,255,255,0.5)',
        }}
        transition={{ duration: 0.3 }}
      >
        {profile.name}
      </motion.span>
    </motion.button>
  );
}

export const ProfileSelector = ({ onSelect }) => {
  const [exit, setExit] = useState(false);

  const handleSelect = (profile) => {
    setExit(true);
    setTimeout(() => onSelect?.(profile), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: exit ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #6366f1, transparent 70%)',
          }}
        />
      </div>

      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-white/80 mb-12 select-none"
      >
        WHO'S WATCHING?
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 px-4">
        {PROFILES.map((profile, i) => (
          <motion.div
            key={profile.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
          >
            <ProfileCard profile={profile} onSelect={handleSelect} />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 text-sm text-white/20 tracking-widest uppercase select-none"
      >
        Select a profile to begin
      </motion.p>
    </motion.div>
  );
};
