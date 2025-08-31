"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Bounds } from "@react-three/drei";
import * as THREE from "three";

type ModelViewerProps = {
  url: string;
  autoRotate?: boolean;
};

function CarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2.5} />; // Escalado
}

export default function ModelViewer({
  url,
  autoRotate = true,
}: ModelViewerProps) {
  return (
    <div style={{ width: "100%", aspectRatio: "4 / 3" }}>
      <Canvas
        shadows
        camera={{ position: [3, 2, 6], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <CarModel url={url} />
          </Bounds>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enablePan={false} autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}
