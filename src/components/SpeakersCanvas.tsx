import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "./Loader";

const Computers: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { scene } = useGLTF("3dmodels/scene.gltf");

  return (
      <group>
        <hemisphereLight intensity={0.15} groundColor='black' />
        <ambientLight
        intensity={1}
        position={[-20,50, 10]}
        />
           <directionalLight
        position={[10, 10, 5]}
        intensity={7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
        <pointLight intensity={3} />
        <primitive
          object={scene}
          scale={isMobile ? 0.4 : 0.8}
          position={isMobile ? [0, 0, 0] : [0, 0, 0]}
          rotation={[0, -1, 0,]}
        />
      </group>
  );
};

const SpeakersCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 850px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      dpr={[1, 2]}
      camera={{ position: [0, 9, 3], fov: 35 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
      <OrbitControls
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
      />
      <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default SpeakersCanvas;
