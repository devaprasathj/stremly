import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AuroraBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[30, 20]} />
      <shaderMaterial
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float t = uTime * 0.1;

            float r = sin(uv.x * 10.0 + t) * 0.5 + 0.5;
            float g = sin(uv.x * 8.0 + uv.y * 5.0 + t * 0.8 + 2.0) * 0.5 + 0.5;
            float b = sin(uv.x * 6.0 + uv.y * 8.0 + t * 0.6 + 4.0) * 0.5 + 0.5;

            float alpha = sin(uv.y * 3.14) * 0.3;

            vec3 color = vec3(r * 0.8, g * 0.3, b * 0.8);
            color += vec3(0.2, 0.1, 0.3);

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
};
