import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97, filter: 'blur(4px)' },
  in: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  out: { opacity: 0, y: -20, scale: 0.97, filter: 'blur(4px)' },
};

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.45,
};

const overlayVariants = {
  initial: { scaleX: 0, transformOrigin: 'left' },
  in: { scaleX: 0, transformOrigin: 'right' },
  out: {
    scaleX: 1,
    transformOrigin: 'left',
    transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] },
  },
};

export const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div className="relative">
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={overlayVariants}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.1))',
        backdropFilter: 'blur(2px)',
      }}
    />
  </motion.div>
);

export const SlideTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -300, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
  >
    {children}
  </motion.div>
);

export const ScaleTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
