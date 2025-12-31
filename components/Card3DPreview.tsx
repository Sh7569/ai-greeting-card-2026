"use client";

import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface Card3DPreviewProps {
  image: string;
  onClose: () => void;
  theme?: "newYear" | "lunar";
}

function GreetingCard({
  imageUrl,
  isOpen,
  theme = "newYear"
}: {
  imageUrl: string;
  isOpen: boolean;
  theme?: "newYear" | "lunar";
}) {
  const groupRef = useRef<THREE.Group>(null);
  const frontPageRef = useRef<THREE.Group>(null);
  const [currentAngle, setCurrentAngle] = useState(0);

  // Load texture
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  // Theme colors
  const themeColors = theme === "lunar"
    ? { primary: "#C41E3A", secondary: "#FFD700", accent: "#8B0000" }
    : { primary: "#1a1a2e", secondary: "#FFD700", accent: "#0f0f1a" };

  useFrame((state) => {
    // Smooth card opening animation
    const targetAngle = isOpen ? Math.PI * 0.75 : 0;
    const newAngle = THREE.MathUtils.lerp(currentAngle, targetAngle, 0.06);
    setCurrentAngle(newAngle);

    if (frontPageRef.current) {
      frontPageRef.current.rotation.y = -newAngle;
    }

    // Gentle floating animation
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.02;
      if (!isOpen) {
        groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
      }
    }
  });

  // Card dimensions (standard greeting card ratio)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.03;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>

      {/* === BACK PAGE (stationary, right side when open) === */}
      <group position={[cardWidth / 2, 0, 0]}>
        {/* Back page base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
          <meshStandardMaterial color={themeColors.accent} />
        </mesh>

        {/* Inside right - cream colored with message */}
        <mesh position={[0, 0, cardThickness / 2 + 0.001]}>
          <planeGeometry args={[cardWidth - 0.15, cardHeight - 0.15]} />
          <meshStandardMaterial color="#FFFEF0" side={THREE.FrontSide} />
        </mesh>

        {/* Decorative border inside */}
        <mesh position={[0, 0, cardThickness / 2 + 0.002]}>
          <ringGeometry args={[0.95, 1.0, 64]} />
          <meshStandardMaterial color={themeColors.secondary} side={THREE.FrontSide} />
        </mesh>
      </group>

      {/* === SPINE === */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, cardHeight, cardThickness * 2]} />
        <meshStandardMaterial color={themeColors.secondary} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* === FRONT PAGE (opens) - pivots from spine === */}
      <group ref={frontPageRef} position={[0, 0, 0]}>
        {/* Front page positioned to pivot from left edge */}
        <group position={[-cardWidth / 2, 0, 0]}>

          {/* Front cover back (visible when open - inside left) */}
          <mesh position={[0, 0, -cardThickness / 2 - 0.001]}>
            <planeGeometry args={[cardWidth - 0.15, cardHeight - 0.15]} />
            <meshStandardMaterial color="#FFFEF0" side={THREE.FrontSide} />
          </mesh>

          {/* Front cover base */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
            <meshStandardMaterial color={themeColors.primary} />
          </mesh>

          {/* === FULL AI IMAGE ON FRONT === */}
          <mesh position={[0, 0, cardThickness / 2 + 0.002]}>
            <planeGeometry args={[cardWidth - 0.1, cardHeight - 0.1]} />
            <meshStandardMaterial
              map={texture}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* Gold frame around image */}
          {/* Top */}
          <mesh position={[0, cardHeight / 2 - 0.03, cardThickness / 2 + 0.003]}>
            <boxGeometry args={[cardWidth - 0.06, 0.04, 0.01]} />
            <meshStandardMaterial color={themeColors.secondary} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Bottom */}
          <mesh position={[0, -cardHeight / 2 + 0.03, cardThickness / 2 + 0.003]}>
            <boxGeometry args={[cardWidth - 0.06, 0.04, 0.01]} />
            <meshStandardMaterial color={themeColors.secondary} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Left */}
          <mesh position={[-cardWidth / 2 + 0.03, 0, cardThickness / 2 + 0.003]}>
            <boxGeometry args={[0.04, cardHeight - 0.06, 0.01]} />
            <meshStandardMaterial color={themeColors.secondary} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Right */}
          <mesh position={[cardWidth / 2 - 0.03, 0, cardThickness / 2 + 0.003]}>
            <boxGeometry args={[0.04, cardHeight - 0.06, 0.01]} />
            <meshStandardMaterial color={themeColors.secondary} metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Corner accents */}
          {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, y], i) => (
            <mesh
              key={i}
              position={[
                x * (cardWidth / 2 - 0.08),
                y * (cardHeight / 2 - 0.08),
                cardThickness / 2 + 0.004
              ]}
            >
              <circleGeometry args={[0.06, 32]} />
              <meshStandardMaterial color={themeColors.secondary} metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

function Sparkles() {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      // Gold to white gradient
      const t = Math.random();
      col[i * 3] = 1;
      col[i * 3 + 1] = 0.84 + t * 0.16;
      col[i * 3 + 2] = t * 0.5;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions}>
      <PointMaterial
        transparent
        vertexColors
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Card3DPreview({ image, onClose, theme = "newYear" }: Card3DPreviewProps) {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white text-2xl hover:text-amber-400 transition-colors bg-black/50 rounded-full"
      >
        ✕
      </button>

      {/* Title */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <h2 className="text-xl font-bold text-amber-400">Your Greeting Card</h2>
      </div>

      {/* Open/Close button */}
      <button
        onClick={() => setIsCardOpen(!isCardOpen)}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg rounded-full hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/40 hover:scale-105"
      >
        {isCardOpen ? "✉️ Close Card" : "📖 Open Card"}
      </button>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-gray-400 text-sm">
        <p>Drag to rotate • Scroll to zoom</p>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={["#050510"]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#ffd700" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#ffffff" />
        <spotLight
          position={[0, 8, 4]}
          intensity={1.5}
          angle={0.4}
          penumbra={0.5}
          color="#ffeedd"
          castShadow
        />

        <Suspense fallback={null}>
          <GreetingCard
            imageUrl={image}
            isOpen={isCardOpen}
            theme={theme}
          />
        </Suspense>

        <Sparkles />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate={!isCardOpen}
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI * 0.7}
          minPolarAngle={Math.PI * 0.3}
        />
      </Canvas>
    </div>
  );
}
