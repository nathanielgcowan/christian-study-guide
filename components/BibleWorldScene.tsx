"use client";

import React, {
  Suspense,
  useState,
  useEffect,
  Component,
  ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Sky,
  Stars,
  PerspectiveCamera,
  Float,
  Html,
  useGLTF,
} from "@react-three/drei";

// Path to the 3D model. Ensure this file is placed in public/models/jerusalem.glb
const MODEL_PATH = "/models/jerusalem.glb";

/**
 * Error Boundary to catch 404s or malformed 3D files.
 * This prevents the entire 3D canvas from crashing if an asset is missing.
 */
class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface PointOfInterest {
  id: string;
  position: [number, number, number];
  label: string;
  description: string;
}

const POINTS_OF_INTEREST: PointOfInterest[] = [
  {
    id: "temple",
    position: [0, 2, 0],
    label: "The Second Temple",
    description: "The center of Jewish worship in the 1st century.",
  },
  {
    id: "pool",
    position: [5, 0.5, -3],
    label: "Pool of Bethesda",
    description: "Known for the healing of the paralytic.",
  },
  {
    id: "tower",
    position: [-4, 3, 2],
    label: "Tower of David",
    description: "The ancient citadel located near the Jaffa Gate.",
  },
];

function Hotspot({ poi }: { poi: PointOfInterest }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Html
      position={poi.position}
      center
      distanceFactor={10} // Scales the label based on camera distance
      occlude // Hides the label if it's behind a building
    >
      <button
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => alert(`${poi.label}: ${poi.description}`)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all duration-200 whitespace-nowrap ${
          hovered
            ? "bg-primary border-white text-white scale-110 shadow-lg"
            : "bg-white/90 border-primary text-text-primary scale-100 shadow-md"
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-bold font-sans uppercase tracking-wider">
          {poi.label}
        </span>
      </button>
    </Html>
  );
}

function JerusalemModel() {
  // Verification: Ensure the file exists at: public/models/jerusalem.glb
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    if (scene) {
      console.log(
        "Jerusalem model loaded successfully into the scene graph:",
        scene,
      );
    }
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    />
  );
}

function Landmark() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 3, 32]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.8} />
      </mesh>
      {/* Simple Top Cap */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <meshStandardMaterial color="#bc8f8f" />
      </mesh>
    </Float>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#edc9af" roughness={1} />
    </mesh>
  );
}

export default function BibleWorldScene() {
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkModelAvailability = async () => {
      try {
        const response = await fetch(MODEL_PATH, { method: "HEAD" });
        if (!cancelled) setModelAvailable(response.ok);
      } catch {
        if (!cancelled) setModelAvailable(false);
      }
    };

    checkModelAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full h-[600px] bg-black rounded-xl overflow-hidden shadow-2xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 10]} />
        <OrbitControls maxPolarAngle={Math.PI / 2.1} makeDefault />

        {/* Environment & Lighting */}
        <Sky sunPosition={[100, 20, 100]} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center gap-3 bg-black/60 text-white p-6 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
                <div className="w-8 h-8 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm font-semibold tracking-wide uppercase">
                  Loading Biblical World...
                </p>
              </div>
            </Html>
          }
        >
          {modelAvailable ? (
            <ModelErrorBoundary
              fallback={
                <Html center>
                  <div className="bg-black/80 text-white/70 px-4 py-2 rounded-md text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-sm">
                    Model not found: {MODEL_PATH}
                  </div>
                </Html>
              }
            >
              <JerusalemModel />
            </ModelErrorBoundary>
          ) : null}
          <Landmark />

          {POINTS_OF_INTEREST.map((poi) => (
            <Hotspot key={poi.id} poi={poi} />
          ))}
        </Suspense>
        <Ground />
      </Canvas>
    </div>
  );
}

// Preload the model to improve performance and avoid pop-in
if (typeof window !== "undefined") {
  useGLTF.preload(MODEL_PATH);
}
