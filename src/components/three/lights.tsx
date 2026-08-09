"use client";

import { ContactShadows } from "@react-three/drei";

/** Soft, warm three-point rig for the cream builder scene. */
export function WarmLights() {
  return (
    <>
      <ambientLight intensity={0.7} color="#fff6e8" />
      <directionalLight position={[3, 6, 4]} intensity={1.6} color="#fff2d8" castShadow />
      <pointLight position={[-4, 2, 3]} intensity={0.5} color="#ffd9b0" />
      <pointLight position={[0, -3, 2]} intensity={0.3} color="#ffe4c4" />
    </>
  );
}

/** Single dramatic spotlight for the dark receiver reveal. */
export function SpotlightRig() {
  return (
    <>
      <ambientLight intensity={0.18} color="#3a2a4a" />
      <spotLight
        position={[0, 8, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={90}
        distance={30}
        color="#fff0d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 1, 4]} intensity={0.6} color="#ffb36b" />
      <pointLight position={[3, 0, 3]} intensity={0.5} color="#c98bff" />
      <ContactShadows position={[0, -2.4, 0]} opacity={0.5} scale={12} blur={2.6} far={5} color="#000000" />
    </>
  );
}
