import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export const scaleInWithRotate: Variants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -10 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.6, type: 'spring', stiffness: 100 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const slideInFromBottom: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { duration: 0.5, type: 'spring', damping: 30 } },
};

export const slideInFromTop: Variants = {
  hidden: { y: '-100%' },
  visible: { y: 0, transition: { duration: 0.5, type: 'spring', damping: 30 } },
};

export const cardHover = {
  rest: { scale: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.05, y: -10, transition: { duration: 0.3, type: 'spring', stiffness: 300 } },
};

export const buttonTap = { scale: 0.95 };

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } },
};

export const heroTextAnimation: Variants = {
  hidden: { opacity: 0, y: 100, rotateX: -20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.8, delay: i * 0.1, type: 'spring', stiffness: 100 },
  }),
};

export const streamlyIntro = {
  initial: { scale: 0.3, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: 'easeOut' },
  },
  exit: {
    scale: 1.3,
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeIn' },
  },
};

export const card3DTilt = {
  rest: { rotateX: 0, rotateY: 0, scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export const shimmerEffect = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
};

export const glowPulse: Variants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const auroraVariants: Variants = {
  initial: { opacity: 0.3, scale: 0.8 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [0.8, 1.2, 0.8],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const shimmerGlow: Variants = {
  initial: { backgroundPosition: '200% 0' },
  animate: {
    backgroundPosition: '-200% 0',
    transition: { duration: 4, repeat: Infinity, ease: 'linear' },
  },
};
