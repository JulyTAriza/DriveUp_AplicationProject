"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Bounds } from "@react-three/drei";
import * as THREE from "three";

type ModelViewerProps = {
  url: string;
  width?: number;
  height?: number;
  autoRotate?: boolean;
};

function CarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({
  url,
  width = 620,
  height = 460,
  autoRotate = true,
}: ModelViewerProps) {
  return (
    <div style={{ width, height }}>
      <Canvas
        shadows
        camera={{ position: [3, 2, 6], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

        <Suspense fallback={null}>
          {/* Centra y ajusta tamaño automáticamente */}
          <Bounds fit clip observe margin={1.15}>
            <CarModel url={url} />
          </Bounds>
          <Environment preset="city" />
        </Suspense>

        {/* Apunta la cámara un poco más arriba para que no “pese” abajo */}
        <OrbitControls target={[0, 0.4, 0]} enablePan={false} autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}

