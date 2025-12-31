"use client";

import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial, Text } from "@react-three/drei";
import * as THREE from "three";
import { CardFormat } from "./FormatSelector";

interface Card3DPreviewProps {
  image: string;
  onClose: () => void;
  theme?: "newYear" | "lunar";
  format?: CardFormat;
  customMessage?: string;
}

// Theme configurations - Messages entièrement en français
const THEMES = {
  newYear: {
    primary: "#1a1a2e",
    secondary: "#FFD700",
    accent: "#0f0f1a",
    cream: "#FFFEF0",
    greeting: "Bonne Année\n2026 !",
    subGreeting: "Before Conseil vous souhaite\nune année riche en succès\net en belles opportunités.",
    backText: "Before Conseil\nConseil en Fusions-Acquisitions",
  },
  lunar: {
    primary: "#8B0000",
    secondary: "#FFD700",
    accent: "#C41E3A",
    cream: "#FFFEF0",
    greeting: "Bonne Année\ndu Serpent !",
    subGreeting: "Before Conseil vous souhaite\nprospérité et bonheur\npour cette nouvelle année.",
    backText: "Before Conseil\nConseil en Fusions-Acquisitions",
  },
};

// Decorative elements for inside left panel
function DecorativePanel({ theme, position }: { theme: "newYear" | "lunar"; position: [number, number, number] }) {
  const colors = THEMES[theme];
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle shimmer effect
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = 0.3 + Math.sin(state.clock.getElapsedTime() * 2 + i) * 0.1;
        }
      });
    }
  });

  const elements = theme === "lunar"
    ? [
        // Lantern shapes
        { pos: [0, 0.8, 0.01] as [number, number, number], scale: 0.15, shape: "circle" },
        { pos: [-0.5, 0.3, 0.01] as [number, number, number], scale: 0.12, shape: "circle" },
        { pos: [0.5, 0.5, 0.01] as [number, number, number], scale: 0.1, shape: "circle" },
        { pos: [0, -0.5, 0.01] as [number, number, number], scale: 0.18, shape: "circle" },
        { pos: [-0.4, -0.8, 0.01] as [number, number, number], scale: 0.08, shape: "circle" },
      ]
    : [
        // Star shapes for New Year
        { pos: [0, 0.9, 0.01] as [number, number, number], scale: 0.12, shape: "star" },
        { pos: [-0.6, 0.4, 0.01] as [number, number, number], scale: 0.08, shape: "star" },
        { pos: [0.5, 0.6, 0.01] as [number, number, number], scale: 0.1, shape: "star" },
        { pos: [0.3, -0.3, 0.01] as [number, number, number], scale: 0.15, shape: "star" },
        { pos: [-0.4, -0.7, 0.01] as [number, number, number], scale: 0.09, shape: "star" },
      ];

  return (
    <group ref={groupRef} position={position}>
      {elements.map((el, i) => (
        <mesh key={i} position={el.pos}>
          {el.shape === "circle" ? (
            <circleGeometry args={[el.scale, 32]} />
          ) : (
            <circleGeometry args={[el.scale, 5]} />
          )}
          <meshStandardMaterial
            color={colors.secondary}
            emissive={colors.secondary}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Greeting message panel
function GreetingPanel({
  theme,
  position,
  rotation = [0, 0, 0],
  customMessage
}: {
  theme: "newYear" | "lunar";
  position: [number, number, number];
  rotation?: [number, number, number];
  customMessage?: string;
}) {
  const colors = THEMES[theme];
  const displayMessage = customMessage || colors.subGreeting;

  // Load logo texture
  const logoTexture = useLoader(THREE.TextureLoader, "/before-logo.svg");

  return (
    <group position={position} rotation={rotation}>
      {/* Background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.3, 3.3]} />
        <meshStandardMaterial color={colors.cream} />
      </mesh>

      {/* Decorative circle border */}
      <mesh position={[0, 0.15, 0.001]}>
        <ringGeometry args={[0.95, 1.0, 64]} />
        <meshStandardMaterial color={colors.secondary} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Inner circle fill for better text background */}
      <mesh position={[0, 0.15, 0.0005]}>
        <circleGeometry args={[0.95, 64]} />
        <meshStandardMaterial color={colors.cream} />
      </mesh>

      {/* Main greeting - centered in circle */}
      <Text
        position={[0, 0.45, 0.01]}
        fontSize={0.16}
        color={colors.accent}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={1.6}
      >
        {colors.greeting}
      </Text>

      {/* Custom or default message - centered in circle */}
      <Text
        position={[0, -0.05, 0.01]}
        fontSize={0.09}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={1.5}
        lineHeight={1.3}
      >
        {displayMessage}
      </Text>

      {/* Before Conseil LOGO under the circle */}
      <mesh position={[0, -1.2, 0.01]}>
        <planeGeometry args={[1.2, 0.35]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// Back panel with branding
function BackPanel({
  theme,
  position
}: {
  theme: "newYear" | "lunar";
  position: [number, number, number];
}) {
  const colors = THEMES[theme];

  // Load logo texture
  const logoTexture = useLoader(THREE.TextureLoader, "/before-logo.svg");

  return (
    <group position={position}>
      {/* Background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.3, 3.3]} />
        <meshStandardMaterial color={colors.primary} />
      </mesh>

      {/* Before Conseil LOGO */}
      <mesh position={[0, 0.2, 0.01]}>
        <planeGeometry args={[1.6, 0.45]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent={true}
        />
      </mesh>

      {/* Tagline */}
      <Text
        position={[0, -0.3, 0.01]}
        fontSize={0.08}
        color={colors.secondary}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        Conseil en Fusions-Acquisitions
      </Text>

      {/* Year */}
      <Text
        position={[0, -1.2, 0.01]}
        fontSize={0.12}
        color={colors.secondary}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        2026
      </Text>
    </group>
  );
}

function BifoldCard({
  imageUrl,
  isOpen,
  theme = "newYear",
  customMessage
}: {
  imageUrl: string;
  isOpen: boolean;
  theme?: "newYear" | "lunar";
  customMessage?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const frontPageRef = useRef<THREE.Group>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const colors = THEMES[theme];

  useFrame((state) => {
    const targetAngle = isOpen ? Math.PI * 0.85 : 0;
    const newAngle = THREE.MathUtils.lerp(currentAngle, targetAngle, 0.06);
    setCurrentAngle(newAngle);

    if (frontPageRef.current) {
      frontPageRef.current.rotation.y = -newAngle;
    }

    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.02;
      if (!isOpen) {
        groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
      }
    }
  });

  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.03;

  return (
    <group ref={groupRef}>
      {/* BACK PAGE (stationary) - Contains greeting message */}
      <group position={[cardWidth / 2, 0, 0]}>
        <mesh>
          <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
          <meshStandardMaterial color={colors.accent} />
        </mesh>

        {/* Inside greeting panel */}
        <GreetingPanel
          theme={theme}
          position={[0, 0, cardThickness / 2 + 0.01]}
          customMessage={customMessage}
        />
      </group>

      {/* SPINE */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, cardHeight, cardThickness * 2]} />
        <meshStandardMaterial color={colors.secondary} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* FRONT PAGE (opens) */}
      <group ref={frontPageRef}>
        <group position={[-cardWidth / 2, 0, 0]}>
          {/* Front cover back (visible when open) - decorative */}
          <group position={[0, 0, -cardThickness / 2 - 0.01]}>
            <mesh>
              <planeGeometry args={[cardWidth - 0.15, cardHeight - 0.15]} />
              <meshStandardMaterial color={colors.cream} side={THREE.FrontSide} />
            </mesh>
            <DecorativePanel theme={theme} position={[0, 0, 0.01]} />
          </group>

          {/* Front cover base */}
          <mesh>
            <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
            <meshStandardMaterial color={colors.primary} />
          </mesh>

          {/* AI IMAGE on front */}
          <mesh position={[0, 0, cardThickness / 2 + 0.002]}>
            <planeGeometry args={[cardWidth - 0.1, cardHeight - 0.1]} />
            <meshStandardMaterial map={texture} side={THREE.FrontSide} />
          </mesh>

          {/* Gold frame */}
          {[
            { pos: [0, cardHeight / 2 - 0.03, cardThickness / 2 + 0.003] as [number, number, number], size: [cardWidth - 0.06, 0.04, 0.01] as [number, number, number] },
            { pos: [0, -cardHeight / 2 + 0.03, cardThickness / 2 + 0.003] as [number, number, number], size: [cardWidth - 0.06, 0.04, 0.01] as [number, number, number] },
            { pos: [-cardWidth / 2 + 0.03, 0, cardThickness / 2 + 0.003] as [number, number, number], size: [0.04, cardHeight - 0.06, 0.01] as [number, number, number] },
            { pos: [cardWidth / 2 - 0.03, 0, cardThickness / 2 + 0.003] as [number, number, number], size: [0.04, cardHeight - 0.06, 0.01] as [number, number, number] },
          ].map((frame, i) => (
            <mesh key={i} position={frame.pos}>
              <boxGeometry args={frame.size} />
              <meshStandardMaterial color={colors.secondary} metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

function QuadfoldCard({
  imageUrl,
  isOpen,
  theme = "newYear",
  customMessage
}: {
  imageUrl: string;
  isOpen: boolean;
  theme?: "newYear" | "lunar";
  customMessage?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const frontPageRef = useRef<THREE.Group>(null);
  const backPageRef = useRef<THREE.Group>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const colors = THEMES[theme];

  useFrame((state) => {
    const targetAngle = isOpen ? Math.PI * 0.85 : 0;
    const newAngle = THREE.MathUtils.lerp(currentAngle, targetAngle, 0.05);
    setCurrentAngle(newAngle);

    if (frontPageRef.current) {
      frontPageRef.current.rotation.y = -newAngle;
    }
    if (backPageRef.current) {
      backPageRef.current.rotation.y = newAngle;
    }

    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.02;
      if (!isOpen) {
        groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
      }
    }
  });

  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.03;

  return (
    <group ref={groupRef}>
      {/* CENTER SPINE */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, cardHeight, cardThickness * 2]} />
        <meshStandardMaterial color={colors.secondary} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* RIGHT HALF - Inside Right (greeting) + Back cover outer */}
      <group ref={backPageRef}>
        <group position={[cardWidth / 2, 0, 0]}>
          {/* Inside Right - Greeting Panel */}
          <mesh position={[0, 0, cardThickness / 2 + 0.001]}>
            <planeGeometry args={[cardWidth - 0.15, cardHeight - 0.15]} />
            <meshStandardMaterial color={colors.cream} side={THREE.FrontSide} />
          </mesh>
          <GreetingPanel theme={theme} position={[0, 0, cardThickness / 2 + 0.02]} customMessage={customMessage} />

          {/* Base */}
          <mesh>
            <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
            <meshStandardMaterial color={colors.accent} />
          </mesh>

          {/* Back cover outer */}
          <BackPanel theme={theme} position={[0, 0, -cardThickness / 2 - 0.01]} />
        </group>
      </group>

      {/* LEFT HALF - Front cover + Inside Left (decorative) */}
      <group ref={frontPageRef}>
        <group position={[-cardWidth / 2, 0, 0]}>
          {/* Inside Left - Decorative */}
          <group position={[0, 0, -cardThickness / 2 - 0.01]}>
            <mesh>
              <planeGeometry args={[cardWidth - 0.15, cardHeight - 0.15]} />
              <meshStandardMaterial color={colors.cream} side={THREE.FrontSide} />
            </mesh>
            <DecorativePanel theme={theme} position={[0, 0, 0.01]} />
          </group>

          {/* Front cover base */}
          <mesh>
            <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
            <meshStandardMaterial color={colors.primary} />
          </mesh>

          {/* AI IMAGE on front */}
          <mesh position={[0, 0, cardThickness / 2 + 0.002]}>
            <planeGeometry args={[cardWidth - 0.1, cardHeight - 0.1]} />
            <meshStandardMaterial map={texture} side={THREE.FrontSide} />
          </mesh>

          {/* Gold frame */}
          {[
            { pos: [0, cardHeight / 2 - 0.03, cardThickness / 2 + 0.003] as [number, number, number], size: [cardWidth - 0.06, 0.04, 0.01] as [number, number, number] },
            { pos: [0, -cardHeight / 2 + 0.03, cardThickness / 2 + 0.003] as [number, number, number], size: [cardWidth - 0.06, 0.04, 0.01] as [number, number, number] },
            { pos: [-cardWidth / 2 + 0.03, 0, cardThickness / 2 + 0.003] as [number, number, number], size: [0.04, cardHeight - 0.06, 0.01] as [number, number, number] },
            { pos: [cardWidth / 2 - 0.03, 0, cardThickness / 2 + 0.003] as [number, number, number], size: [0.04, cardHeight - 0.06, 0.01] as [number, number, number] },
          ].map((frame, i) => (
            <mesh key={i} position={frame.pos}>
              <boxGeometry args={frame.size} />
              <meshStandardMaterial color={colors.secondary} metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

function Sparkles({ theme }: { theme: "newYear" | "lunar" }) {
  const ref = useRef<THREE.Points>(null);
  const count = 600;
  const colors = THEMES[theme];

  const [positions, particleColors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseColor = new THREE.Color(colors.secondary);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const t = Math.random();
      col[i * 3] = baseColor.r + t * 0.2;
      col[i * 3 + 1] = baseColor.g + t * 0.1;
      col[i * 3 + 2] = t * 0.3;
    }
    return [pos, col];
  }, [colors.secondary]);

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

export default function Card3DPreview({
  image,
  onClose,
  theme = "newYear",
  format = "bifold",
  customMessage
}: Card3DPreviewProps) {
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
        <h2 className="text-xl font-bold text-amber-400">
          Votre Carte {format === "quadfold" ? "4 Panneaux" : "2 Panneaux"}
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {isCardOpen ? "Carte ouverte" : "Carte fermée"}
        </p>
      </div>

      {/* Open/Close button */}
      <button
        onClick={() => setIsCardOpen(!isCardOpen)}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg rounded-full hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/40 hover:scale-105"
      >
        {isCardOpen ? "Fermer la carte" : "Ouvrir la carte"}
      </button>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-gray-400 text-sm">
        <p>Glisser pour tourner | Scroll pour zoomer</p>
      </div>

      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
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
          {format === "quadfold" ? (
            <QuadfoldCard imageUrl={image} isOpen={isCardOpen} theme={theme} customMessage={customMessage} />
          ) : (
            <BifoldCard imageUrl={image} isOpen={isCardOpen} theme={theme} customMessage={customMessage} />
          )}
        </Suspense>

        <Sparkles theme={theme} />

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          autoRotate={!isCardOpen}
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI * 0.7}
          minPolarAngle={Math.PI * 0.3}
        />
      </Canvas>
    </div>
  );
}
