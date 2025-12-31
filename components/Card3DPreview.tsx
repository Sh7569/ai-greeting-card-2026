"use client";

import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface Card3DPreviewProps {
  image: string;
  onClose: () => void;
}

function FoldableCard({ imageUrl }: { imageUrl: string }) {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const [foldAngle, setFoldAngle] = useState(0);

  // Load texture
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useFrame((state) => {
    // Animate fold opening
    const targetAngle = Math.PI * 0.15; // Slightly open
    const newAngle = THREE.MathUtils.lerp(foldAngle, targetAngle, 0.05);
    setFoldAngle(newAngle);

    // Add subtle floating animation
    if (leftRef.current && rightRef.current) {
      const time = state.clock.getElapsedTime();
      leftRef.current.position.y = Math.sin(time * 0.5) * 0.05;
      rightRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    }
  });

  const cardWidth = 2;
  const cardHeight = 2.67; // 3:4 aspect ratio

  return (
    <group rotation={[0.1, 0, 0]}>
      {/* Left side of card (back) */}
      <mesh
        ref={leftRef}
        position={[-cardWidth / 4, 0, 0]}
        rotation={[0, foldAngle, 0]}
      >
        <planeGeometry args={[cardWidth / 2, cardHeight]} />
        <meshStandardMaterial color="#1a1a2e" side={THREE.DoubleSide} />
      </mesh>

      {/* Right side of card (front with image) */}
      <mesh
        ref={rightRef}
        position={[cardWidth / 4, 0, 0]}
        rotation={[0, -foldAngle, 0]}
      >
        <planeGeometry args={[cardWidth / 2, cardHeight]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
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
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white text-3xl hover:text-amber-400 transition-colors"
      >
        ✕
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-gray-400 text-sm">
        <p>Drag to rotate • Scroll to zoom</p>
      </div>

      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <color attach="background" args={["#0a1628"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffd700" />

        <Suspense fallback={null}>
          <FoldableCard imageUrl={image} />
        </Suspense>

        <Particles />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
