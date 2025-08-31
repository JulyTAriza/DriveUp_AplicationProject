"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

type ModelViewerProps = {
  url: string;
  width?: number;
  height?: number;
  autoRotate?: boolean;
};

function CarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url); // carga modelo glTF/GLB
  return <primitive object={scene} scale={2} />;
}

export default function ModelViewer({
  url,
  width = 500,
  height = 400,
  autoRotate = true,
}: ModelViewerProps) {
  return (
    <div style={{ width, height }}>
      <Canvas
        shadows
        camera={{ position: [3, 2, 5], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

        <Suspense fallback={null}>
          <CarModel url={url} />
          <Environment preset="city" /> {/* luz ambiental */}
        </Suspense>

        <OrbitControls enablePan={false} autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}
