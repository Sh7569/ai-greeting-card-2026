"use client";

import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

interface Card3DPreviewProps {
  image: string;
  onClose: () => void;
}

function FoldableCard({ imageUrl, isOpen, onToggle }: { imageUrl: string; isOpen: boolean; onToggle: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const frontCoverRef = useRef<THREE.Group>(null);
  const [currentAngle, setCurrentAngle] = useState(0);

  // Load texture
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useFrame((state) => {
    // Animate card opening/closing
    const targetAngle = isOpen ? -Math.PI * 0.85 : 0;
    const newAngle = THREE.MathUtils.lerp(currentAngle, targetAngle, 0.08);
    setCurrentAngle(newAngle);

    if (frontCoverRef.current) {
      frontCoverRef.current.rotation.y = newAngle;
    }

    // Floating animation
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.03;
    }
  });

  const cardWidth = 1.8;
  const cardHeight = 2.4;
  const cardDepth = 0.02;

  return (
    <group ref={groupRef} rotation={[0.1, 0.2, 0]} onClick={onToggle}>
      {/* Back cover (stationary) */}
      <mesh position={[cardWidth / 4, 0, -cardDepth]}>
        <boxGeometry args={[cardWidth / 2, cardHeight, cardDepth]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>

      {/* Inside left page (message) */}
      <mesh position={[-cardWidth / 4, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[cardWidth / 2 - 0.05, cardHeight - 0.1]} />
        <meshStandardMaterial color="#FFF8DC" side={THREE.FrontSide} />
      </mesh>

      {/* Inside right page */}
      <mesh position={[cardWidth / 4, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[cardWidth / 2 - 0.05, cardHeight - 0.1]} />
        <meshStandardMaterial color="#FFF8DC" side={THREE.FrontSide} />
      </mesh>

      {/* Spine */}
      <mesh position={[0, 0, -cardDepth / 2]}>
        <boxGeometry args={[0.05, cardHeight, cardDepth * 2]} />
        <meshStandardMaterial color="#5C0000" />
      </mesh>

      {/* Front cover (opens) - pivots on left edge */}
      <group ref={frontCoverRef} position={[0, 0, 0]}>
        {/* Front cover base */}
        <mesh position={[-cardWidth / 4, 0, cardDepth]}>
          <boxGeometry args={[cardWidth / 2, cardHeight, cardDepth]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Front cover image */}
        <mesh position={[-cardWidth / 4, 0, cardDepth * 1.5 + 0.001]}>
          <planeGeometry args={[cardWidth / 2 - 0.08, cardHeight - 0.08]} />
          <meshStandardMaterial map={texture} transparent />
        </mesh>

        {/* Gold trim on front */}
        <mesh position={[-cardWidth / 4, cardHeight / 2 - 0.02, cardDepth * 1.5 + 0.002]}>
          <planeGeometry args={[cardWidth / 2 - 0.04, 0.03]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-cardWidth / 4, -cardHeight / 2 + 0.02, cardDepth * 1.5 + 0.002]}>
          <planeGeometry args={[cardWidth / 2 - 0.04, 0.03]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffd700"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

export default function Card3DPreview({ image, onClose }: Card3DPreviewProps) {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white text-3xl hover:text-amber-400 transition-colors"
      >
        ✕
      </button>

      {/* Open/Close button */}
      <button
        onClick={() => setIsCardOpen(!isCardOpen)}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30"
      >
        {isCardOpen ? "Close Card" : "Open Card"}
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-gray-400 text-sm">
        <p>Drag to rotate • Scroll to zoom • Click button to open</p>
      </div>

      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <color attach="background" args={["#0a1628"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffd700" />
        <spotLight position={[0, 5, 5]} intensity={0.8} angle={0.5} penumbra={1} color="#fff" />

        <Suspense fallback={null}>
          <FoldableCard
            imageUrl={image}
            isOpen={isCardOpen}
            onToggle={() => setIsCardOpen(!isCardOpen)}
          />
        </Suspense>

        <Particles />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          autoRotate={!isCardOpen}
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
