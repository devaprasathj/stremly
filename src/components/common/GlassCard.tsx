import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  floating?: boolean;
}

export const GlassCard = ({ children, className = '', glow = false, floating = false, ...props }: GlassCardProps) => {
  const floatingAnim = floating
    ? {
        y: [0, -8, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : undefined;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl backdrop-blur-xl bg-glass-light border border-white/10 ${
        glow ? 'group' : ''
      } ${className}`}
      whileHover={
        glow
          ? {
              boxShadow: '0 0 40px rgba(255, 45, 85, 0.3), 0 0 80px rgba(99, 102, 241, 0.15)',
              borderColor: 'rgba(255, 45, 85, 0.4)',
            }
          : undefined
      }
      animate={floatingAnim}
      {...props}
    >
      {/* Aurora gradient border effect */}
      {glow && (
        <div className="absolute inset-0 rounded-xl p-[1px] pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-streamly-red via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
      )}

      {/* Inner glow on hover */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,45,85,0.08), transparent 60%)',
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export const GlassButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}) => {
  const variants = {
    primary: 'bg-streamly-red hover:bg-red-700 text-white',
    secondary: 'bg-glass-medium hover:bg-glass-heavy text-white border border-white/20',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
