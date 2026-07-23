'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RevolvingAirplane() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * 0.5;
    const radius = 2.75;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 1.5) * 0.6; // Slight wave effect

    groupRef.current.position.set(x, y, z);

    // Dynamic tangent orientation so airplane faces direction of movement
    const nextT = t + 0.02;
    const nextX = Math.cos(nextT) * radius;
    const nextZ = Math.sin(nextT) * radius;
    const nextY = Math.sin(nextT * 1.5) * 0.6;
    groupRef.current.lookAt(nextX, nextY, nextZ);
  });

  return (
    <group ref={groupRef} scale={0.15}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 3, 16]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00dce5" emissiveIntensity={0.6} />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[0, 0, 1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshStandardMaterial color="#e3b5ff" />
      </mesh>

      {/* Wings */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[3.8, 0.08, 0.8]} />
        <meshStandardMaterial color="#63f7ff" emissive="#00f5ff" emissiveIntensity={0.4} />
      </mesh>

      {/* Tail Fin */}
      <mesh position={[0, 0.6, -1.2]} rotation={[-Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.1, 0.9, 0.6]} />
        <meshStandardMaterial color="#9400e4" emissive="#9400e4" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function StylizedGlobe() {
  const globeRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.15;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y -= delta * 0.08;
  });

  return (
    <group>
      {/* Outer Glow Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.25, 32, 32]} />
        <meshBasicMaterial
          color="#00f5ff"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Inner Wireframe Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 48, 48]} />
        <meshStandardMaterial
          color="#006c71"
          wireframe
          transparent
          opacity={0.45}
          emissive="#00f5ff"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Core Dark Sphere */}
      <mesh>
        <sphereGeometry args={[1.96, 32, 32]} />
        <meshStandardMaterial color="#081010" roughness={0.8} />
      </mesh>

      {/* Orbiting Airplane */}
      <RevolvingAirplane />
    </group>
  );
}

export default function Globe3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-2xl glass-panel flex flex-col items-center justify-center p-6 animate-pulse">
        <div className="w-32 h-32 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin mb-4" />
        <p className="text-cyan-400 font-semibold text-sm tracking-wider">LOADING 3D GLOBE SCENE...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 shadow-2xl">
      <Canvas
        camera={{ position: [0, 1, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="pointer-events-auto"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#63f7ff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#9400e4" />

        <StylizedGlobe />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.6}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Overlay Badge */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        LIVE 3D REVOLVING FLIGHT TRACKER
      </div>
    </div>
  );
}
