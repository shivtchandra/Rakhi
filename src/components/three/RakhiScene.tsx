"use client";

import { Suspense, useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Rakhi3D from "./Rakhi3D";
import { WarmLights } from "./lights";
import type { RakhiStyle, Charm } from "@/data/styles";

export type RakhiSceneHandle = {
  zoomStep: () => void;
  reset: () => void;
  snapshot: () => Promise<Blob | null>;
};

type Props = {
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  initial?: string;
  // Passed as a normal prop (not React `ref`) so next/dynamic(ssr:false) keeps it wired.
  apiRef?: Ref<RakhiSceneHandle>;
  /** Disables auto-rotate/float — used for one-shot capture so the frame is deterministic. */
  still?: boolean;
};

function CanvasBridge({ canvasElRef }: { canvasElRef: React.MutableRefObject<HTMLCanvasElement | null> }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    canvasElRef.current = gl.domElement;
  }, [gl]);
  return null;
}

export default function RakhiScene({ apiRef, still, ...props }: Props) {
  const controls = useRef<OrbitControlsImpl>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(apiRef, () => ({
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
    snapshot() {
      const canvas = canvasElRef.current;
      if (!canvas) return Promise.resolve(null);
      return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
    },
  }));

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
      <CanvasBridge canvasElRef={canvasElRef} />
      <PerspectiveCamera makeDefault position={[0, 0.3, 6]} fov={40} />
      <WarmLights />
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={still ? 0 : 0.15} floatIntensity={still ? 0 : 0.5}>
          <Rakhi3D {...props} />
        </Float>
      </Suspense>
      <OrbitControls
        ref={controls}
        enablePan={false}
        autoRotate={!still}
        autoRotateSpeed={1.1}
        minDistance={3.2}
        maxDistance={7}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  );
}
