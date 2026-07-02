import { useEffect, useRef, useCallback } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const isHoveringLink = useRef(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
    if (trailRef.current) {
      trailRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
    }
  }, []);

  const onMouseOverLink = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
      isHoveringLink.current = true;
      if (cursorRef.current) {
        cursorRef.current.style.transform += ' scale(1.8)';
        cursorRef.current.style.borderColor = '#ff2d55';
      }
    }
  }, []);

  const onMouseOutLink = useCallback(() => {
    isHoveringLink.current = false;
    if (cursorRef.current) {
      cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(1.8)', '');
      cursorRef.current.style.borderColor = '';
    }
  }, []);

  useEffect(() => {
    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.1;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.1;
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${posRef.current.x - 15}px, ${posRef.current.y - 15}px)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOverLink);
    document.addEventListener('mouseout', onMouseOutLink);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOverLink);
      document.removeEventListener('mouseout', onMouseOutLink);
    };
  }, [onMouseMove, onMouseOverLink, onMouseOutLink]);

  return (
    <>
      {/* Gradient trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999]"
        style={{
          transform: 'translate(0, 0)',
          transition: 'transform 0.05s',
          background: 'linear-gradient(135deg, #ff2d55, #6366f1)',
          filter: 'blur(1px)',
          boxShadow: '0 0 10px rgba(255, 45, 85, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)',
        }}
      />
      {/* Main cursor glow dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(0, 0)',
          transition: 'transform 0.05s, border-color 0.2s',
          background: 'radial-gradient(circle, #ff2d55 30%, #6366f1 70%, transparent 100%)',
          boxShadow: '0 0 15px rgba(255, 45, 85, 0.6), 0 0 30px rgba(99, 102, 241, 0.3)',
          border: '1px solid rgba(255, 45, 85, 0.5)',
        }}
      />
      {/* Follower ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
        style={{
          transform: 'translate(0, 0)',
          border: '1.5px solid transparent',
          background: 'linear-gradient(135deg, #ff2d55, #6366f1) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0.6,
          transition: 'opacity 0.3s',
        }}
      />
    </>
  );
};
