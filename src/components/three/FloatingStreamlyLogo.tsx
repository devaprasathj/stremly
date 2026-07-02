import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

export const FloatingStreamlyLogo = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  const gradientColors = useMemo(() => {
    const colors = [];
    const steps = 30;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const color = new THREE.Color();
      if (t < 0.5) {
        color.setHSL(0.95 - t * 0.4, 0.8, 0.5 + t * 0.2);
      } else {
        color.setHSL(0.75 - (t - 0.5) * 0.4, 0.8, 0.6 - (t - 0.5) * 0.1);
      }
      colors.push(color);
    }
    return colors;
  }, []);

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.8}>
        <Text
          fontSize={2.5}
          letterSpacing={0.12}
          position={[0, 0, 0]}
          anchorX="center"
          anchorY="middle"
        >
          STREAMLY
          <meshPhysicalMaterial
            color="#ff2d55"
            emissive="#ff2d55"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.05}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            transparent
            opacity={0.9}
          />
        </Text>
      </Float>

      {/* Glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <ringGeometry args={[2.5, 3.5, 64]} />
        <meshBasicMaterial
          color="#ff2d55"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
