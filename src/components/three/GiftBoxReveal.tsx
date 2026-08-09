"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import Rakhi3D from "./Rakhi3D";
import { SpotlightRig } from "./lights";
import type { RakhiConfig } from "@/lib/rakhi";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function GiftBox({ box }: { box: string }) {
  const gold = "#D9A93E";
  return (
    <group>
      {/* base */}
      <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 1.1, 1.7]} />
        <meshStandardMaterial color={box} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* gold ribbon bands */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.28, 1.12, 1.72]} />
        <meshStandardMaterial color={gold} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[1.72, 1.12, 0.28]} />
        <meshStandardMaterial color={gold} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

type SceneProps = { rakhi: RakhiConfig; play: boolean; onRevealed: () => void };

function Scene({ rakhi, play, onRevealed }: SceneProps) {
  const boxGroup = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const riser = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const spinning = useRef(false);
  const target = useRef(new THREE.Vector3(0, 0.95, 0));

  useFrame((state) => {
    if (!play) {
      if (boxGroup.current) boxGroup.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
      camera.lookAt(0, -0.7, 0); // deterministic idle framing (aim at box center)
    }
    if (spinning.current && riser.current) {
      riser.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    if (!play || !hinge.current || !riser.current) return;

    if (prefersReducedMotion()) {
      hinge.current.rotation.x = -2.2;
      riser.current.position.y = 0.7;
      spinning.current = true;
      camera.position.set(0, 0.95, 3.2);
      camera.lookAt(target.current);
      onRevealed();
      return;
    }

    const tl = gsap.timeline();
    // 1. lid hinges open
    tl.to(hinge.current.rotation, { x: -2.3, duration: 1.2, ease: "power2.inOut" });
    // 2. slight delay, then rakhi rises
    tl.to(riser.current.position, { y: 0.7, duration: 1.6, ease: "power2.inOut" }, "+=0.3");
    tl.add(() => { spinning.current = true; }, "<");
    // 3. camera zooms toward the rakhi
    tl.to(
      camera.position,
      { x: 0, y: 0.95, z: 3.2, duration: 2.0, ease: "power2.inOut", onUpdate: () => camera.lookAt(target.current) },
      "<0.2"
    );
    // 4. message overlay fades in
    tl.add(() => onRevealed());

    return () => { tl.kill(); };
  }, [play, camera, onRevealed]);

  return (
    <>
      <SpotlightRig />
      <group ref={boxGroup} scale={1.4}>
        <GiftBox box={rakhi.threadColor} />
        {/* rakhi rises from inside; starts hidden below the rim */}
        <group ref={riser} position={[0, -0.7, 0]}>
          <group scale={0.62}>
            <Rakhi3D
              style={rakhi.style}
              threadColor={rakhi.threadColor}
              beadColor={rakhi.beadColor}
              charm={rakhi.charm}
              initial={rakhi.name}
            />
          </group>
        </group>
        {/* lid on a hinge pivot at the back-top edge */}
        <group ref={hinge} position={[0, 0.02, -0.85]}>
          <mesh position={[0, 0, 0.85]} castShadow>
            <boxGeometry args={[1.82, 0.26, 1.82]} />
            <meshStandardMaterial color={rakhi.threadColor} metalness={0.35} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.02, 0.85]}>
            <boxGeometry args={[0.3, 0.28, 1.84]} />
            <meshStandardMaterial color="#D9A93E" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default function GiftBoxReveal({ rakhi }: { rakhi: RakhiConfig }) {
  const [play, setPlay] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="flex-1 relative min-h-screen bg-gradient-to-b from-[#1a0d1a] via-[#2a1226] to-[#3a1a14] overflow-hidden">
      <div className="absolute inset-0">
        <Canvas shadows dpr={[1, 2]} className="!h-full !w-full">
          <color attach="background" args={["#160a16"]} />
          <PerspectiveCamera makeDefault position={[0, -0.2, 4.5]} fov={46} />
          <Suspense fallback={null}>
            <Scene rakhi={rakhi} play={play} onRevealed={() => setRevealed(true)} />
          </Suspense>
        </Canvas>
      </div>

      {/* landing overlay */}
      {!play && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-24 gap-6 pointer-events-none">
          <p className="text-amber-100 text-lg drop-shadow">
            {rakhi.name ? `${rakhi.name}, you` : "You"} received a rakhi
          </p>
          <button
            onClick={() => setPlay(true)}
            className="pointer-events-auto rounded-full bg-gradient-to-br from-amber-400 to-rose-600 text-white font-medium px-8 py-3 shadow-2xl hover:scale-105 transition-transform"
          >
            Tap to open
          </button>
        </div>
      )}

      {/* message reveal */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-5 px-6 pb-16 text-center transition-opacity duration-1000 ${
          revealed ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <p className="text-amber-50 text-xl leading-relaxed max-w-md drop-shadow">{rakhi.message}</p>
        <a
          href="/create"
          className="rounded-full bg-white text-rose-800 px-6 py-2 text-sm font-medium hover:bg-amber-50"
        >
          Send one back
        </a>
      </div>
    </main>
  );
}
