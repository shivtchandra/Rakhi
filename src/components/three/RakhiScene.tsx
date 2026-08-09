"use client";

import { Suspense, useImperativeHandle, useRef, type Ref } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Rakhi3D from "./Rakhi3D";
import { WarmLights } from "./lights";
import type { RakhiStyle, Charm } from "@/data/styles";

export type RakhiSceneHandle = {
  toggleSpin: () => void;
  zoomStep: () => void;
  reset: () => void;
};

type Props = {
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  initial?: string;
  // Passed as a normal prop (not React `ref`) so next/dynamic(ssr:false) keeps it wired.
  apiRef?: Ref<RakhiSceneHandle>;
};

export default function RakhiScene({ apiRef, ...props }: Props) {
  const controls = useRef<OrbitControlsImpl>(null);

  useImperativeHandle(apiRef, () => ({
    toggleSpin() {
      const c = controls.current;
      if (c) c.autoRotate = !c.autoRotate;
    },
    zoomStep() {
      const c = controls.current;
      if (!c) return;
      const cam = c.object;
      const next = cam.position.length() <= 3.6 ? 6 : 3.2;
      cam.position.setLength(next);
      c.update();
    },
    reset() {
      const c = controls.current;
      if (!c) return;
      c.autoRotate = true;
      c.object.position.set(0, 0.3, 6);
      c.reset();
    },
  }));

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0.3, 6]} fov={40} />
      <WarmLights />
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
          <Rakhi3D {...props} />
        </Float>
      </Suspense>
      <OrbitControls
        ref={controls}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.1}
        minDistance={3.2}
        maxDistance={7}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  );
}
