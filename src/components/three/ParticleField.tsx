import { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const ParticleField = ({ count = 2000 }: { count?: number }) => {
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const handlePointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const t = Math.random();
      if (t < 0.33) color.setHSL(0.95, 0.8, 0.6 + Math.random() * 0.3);
      else if (t < 0.66) color.setHSL(0.75, 0.8, 0.5 + Math.random() * 0.3);
      else color.setHSL(0.55, 0.8, 0.5 + Math.random() * 0.3);

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
      siz[i] = Math.random() * 3 + 1;
    }
    return [pos, col, siz];
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = clock.getElapsedTime() * 0.05;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      const rot = time + i * 0.001;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);

      positions[i3] = x * cos - z * sin;
      positions[i3 + 1] = y + Math.sin(time * 2 + i * 0.01) * 0.02;
      positions[i3 + 2] = x * sin + z * cos;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points
      ref={meshRef}
      onPointerMove={handlePointerMove}
      frustumCulled={false}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
