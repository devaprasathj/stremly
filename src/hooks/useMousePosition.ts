import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

export const useMousePosition = (): MousePosition => {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    let raf: number;
    const handler = (e: MouseEvent) => {
      raf = requestAnimationFrame(() => {
        setPos({
          x: e.clientX,
          y: e.clientY,
          nx: (e.clientX / window.innerWidth) * 2 - 1,
          ny: (e.clientY / window.innerHeight) * 2 - 1,
        });
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  return pos;
};
