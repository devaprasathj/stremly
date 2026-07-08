import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { getCategoryColor } from '../../utils/constants';

const SCENE_CONFIG = {
  'Science Fiction': { fogDensity: 0.005, speed: 2.2, intensity: 2.8, bloomThreshold: 0.15, bloomStrength: 1.8 },
  'Sci-Fi': { fogDensity: 0.005, speed: 2.2, intensity: 2.8, bloomThreshold: 0.15, bloomStrength: 1.8 },
  Horror: { fogDensity: 0.035, speed: 0.3, intensity: 0.5, bloomThreshold: 0.05, bloomStrength: 0.6 },
  Romance: { fogDensity: 0.010, speed: 0.8, intensity: 1.8, bloomThreshold: 0.1, bloomStrength: 1.2 },
  Action: { fogDensity: 0.012, speed: 1.6, intensity: 2.2, bloomThreshold: 0.12, bloomStrength: 1.5 },
  Comedy: { fogDensity: 0.006, speed: 1.2, intensity: 1.5, bloomThreshold: 0.18, bloomStrength: 1.0 },
  Drama: { fogDensity: 0.009, speed: 0.6, intensity: 1.2, bloomThreshold: 0.2, bloomStrength: 0.8 },
  Thriller: { fogDensity: 0.020, speed: 0.8, intensity: 1.0, bloomThreshold: 0.1, bloomStrength: 1.0 },
  Animation: { fogDensity: 0.004, speed: 1.8, intensity: 2.5, bloomThreshold: 0.2, bloomStrength: 1.6 },
  Adventure: { fogDensity: 0.006, speed: 1.5, intensity: 2.0, bloomThreshold: 0.18, bloomStrength: 1.4 },
  Documentary: { fogDensity: 0.004, speed: 0.5, intensity: 1.0, bloomThreshold: 0.25, bloomStrength: 0.6 },
  default: { fogDensity: 0.010, speed: 1.0, intensity: 1.5, bloomThreshold: 0.2, bloomStrength: 1.0 },
};

const PARTICLE_COUNT = 2500;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function EmissiveGeometries({ targetColor, targetSpeed }) {
  const groupRef = useRef();
  const meshesRef = useRef([]);
  const colorRef = useRef(new THREE.Color('#6366f1'));

  const shapes = useMemo(() => {
    const geoms = [];
    const geoTypes = [
      new THREE.IcosahedronGeometry(0.12, 0),
      new THREE.OctahedronGeometry(0.1, 0),
      new THREE.TorusGeometry(0.1, 0.04, 8, 16),
      new THREE.TetrahedronGeometry(0.12, 0),
    ];
    for (let i = 0; i < 40; i++) {
      geoms.push({
        geo: geoTypes[i % geoTypes.length],
        pos: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 10 - 3,
        ],
        rotSpeed: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.5,
      });
    }
    return geoms;
  }, []);

  useFrame((state, delta) => {
    colorRef.current.lerp(targetColor, delta * 0.6);
    const t = state.clock.elapsedTime;
    const c = colorRef.current;

    meshesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = shapes[i];
      mesh.position.y = s.pos[1] + Math.sin(t * s.floatSpeed + s.floatOffset) * 0.3;
      mesh.rotation.x += s.rotSpeed[0] * delta * targetSpeed;
      mesh.rotation.y += s.rotSpeed[1] * delta * targetSpeed;
      mesh.material.color.copy(c);
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => (meshesRef.current[i] = el)}
          position={s.pos}
          geometry={s.geo}
        >
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function GenreParticles({ targetColor, targetSpeed }) {
  const colorRef = useRef(new THREE.Color('#6366f1'));
  const speedRef = useRef(1);
  const geomRef = useRef();

  const { positions, velocities, colors: initialColors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const c = new THREE.Color('#6366f1');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 26;
      pos[i3 + 1] = (Math.random() - 0.5) * 18;
      pos[i3 + 2] = (Math.random() - 0.5) * 14 - 4;
      vel[i3] = (Math.random() - 0.5) * 0.025;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.025;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.025;
      c.setHSL(0.65 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }
    return { positions: pos, velocities: vel, colors: cols };
  }, []);

  useFrame((_, delta) => {
    const pos = geomRef.current.attributes.position.array;
    const colAttr = geomRef.current.attributes.color;
    const colArr = colAttr.array;

    speedRef.current = lerp(speedRef.current, targetSpeed, delta * 0.8);
    colorRef.current.lerp(targetColor, delta * 0.5);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3] * speedRef.current;
      pos[i3 + 1] += velocities[i3 + 1] * speedRef.current;
      pos[i3 + 2] += velocities[i3 + 2] * speedRef.current;

      if (Math.abs(pos[i3]) > 13) velocities[i3] *= -1;
      if (Math.abs(pos[i3 + 1]) > 9) velocities[i3 + 1] *= -1;
      if (Math.abs(pos[i3 + 2]) > 7) velocities[i3 + 2] *= -1;

      const drift = colorRef.current;
      const wave = Math.sin(i * 0.01 + performance.now() * 0.001) * 0.5 + 0.5;
      colArr[i3] = lerp(colArr[i3], drift.r * (0.5 + 0.5 * wave), delta * 0.3);
      colArr[i3 + 1] = lerp(colArr[i3 + 1], drift.g * (0.5 + 0.5 * wave), delta * 0.3);
      colArr[i3 + 2] = lerp(colArr[i3 + 2], drift.b * (0.5 + 0.5 * wave), delta * 0.3);
    }

    geomRef.current.attributes.position.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={initialColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneController({ currentGenre }) {
  const { scene } = useThree();
  const config = SCENE_CONFIG[currentGenre] || SCENE_CONFIG.default;
  const colors = getCategoryColor([currentGenre]);

  const targetColor = useMemo(() => new THREE.Color(colors.primary), [colors.primary]);
  const targetSpeed = config.speed;
  const bloomStrength = config.bloomStrength;
  const bloomThreshold = config.bloomThreshold;

  const fogColor = useMemo(() => new THREE.Color(colors.primary).multiplyScalar(0.12), [colors.primary]);
  const fogRef = useRef({ density: 0.010, color: new THREE.Color('#0a0a14') });

  useFrame((_, delta) => {
    fogRef.current.density = lerp(fogRef.current.density, config.fogDensity, delta * 0.4);
    fogRef.current.color.lerp(fogColor, delta * 0.35);
    scene.fog = new THREE.FogExp2(fogRef.current.color, fogRef.current.density);
  });

  return (
    <>
      <fogExp2 attach="fog" args={[fogColor, config.fogDensity]} />

      <GenreParticles targetColor={targetColor} targetSpeed={targetSpeed} />
      <EmissiveGeometries targetColor={targetColor} targetSpeed={targetSpeed} />

      <Sparkles
        count={400}
        scale={[22, 14, 10]}
        size={0.6}
        speed={0.15}
        color={colors.primary}
        opacity={0.12}
      />

      <ambientLight intensity={0.2} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={config.intensity * 0.5}
        color={colors.primary}
      />
      <directionalLight
        position={[-5, -3, 5]}
        intensity={config.intensity * 0.3}
        color={colors.secondary}
      />
      <pointLight
        position={[0, 0, 4]}
        intensity={config.intensity * 0.25}
        color={colors.primary}
      />

      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.08}
          intensity={bloomStrength}
          radius={0.5}
        />
      </EffectComposer>
    </>
  );
}

export const Scene = ({ currentGenre = 'default' }) => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <Canvas
      camera={{ position: [0, 0, 6], fov: 65 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      style={{ background: 'transparent' }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <SceneController currentGenre={currentGenre} />
      </Suspense>
    </Canvas>
  </div>
);
