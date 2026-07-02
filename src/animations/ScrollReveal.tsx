import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 75 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -75 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -75 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 75 }, visible: { opacity: 1, x: 0 } },
};

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
}: ScrollRevealProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) controls.start('visible');
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={directionVariants[direction]}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerReveal = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-50px' }}
    variants={{
      hidden: { opacity: 0 },
      visible: { transition: { staggerChildren: 0.1 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);
