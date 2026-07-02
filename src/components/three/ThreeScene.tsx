import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { FloatingStreamlyLogo } from './FloatingStreamlyLogo';
import { ParticleField } from './ParticleField';
import { AuroraBackground } from './AuroraBackground';
import { Suspense } from 'react';

export const ThreeScene = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent' }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <AuroraBackground />
        <ParticleField count={1500} />
        <FloatingStreamlyLogo />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ff2d55" />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color="#6366f1" />
      </Suspense>
    </Canvas>
  </div>
);
