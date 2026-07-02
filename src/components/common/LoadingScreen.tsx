import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen = ({ isLoading }: LoadingScreenProps) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[9999] bg-[#0a0a0f] flex items-center justify-center"
      >
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-streamly-red via-purple-500 to-cyan-500 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-indigo-500 via-pink-500 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center"
          >
            <div className="text-5xl font-bold tracking-[-0.04em] font-['Space_Grotesk',sans-serif] text-gradient-streamly-logo-blue logo-float mb-4">
              STREAMLY
            </div>
          </motion.div>

          <div className="relative z-10 flex gap-2 justify-center mt-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, #ff2d55, #6366f1)`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [1, 0.3, 1],
                  scale: [1, 0.8, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 text-white/30 text-xs mt-6 tracking-[0.2em] uppercase"
          >
            Loading your experience
          </motion.p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
