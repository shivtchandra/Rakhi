"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { GOLD, PEARL, threadMaterial, type ThreadType } from "./materials";

function FlutedSpacer({ x, metalColor = GOLD }: { x: number; metalColor?: string }) {
  return (
    <mesh position={[x, -0.12, -0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.12, 0.12, 0.22, 8]} />
      <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

function Cord({
  dir,
  threadColor,
  beadColor,
  type,
  attach = 0.55,
  tube = 0.055,
  showCordBeads = true,
  showGoldTwist = true,
  metalColor = GOLD,
}: {
  dir: 1 | -1;
  threadColor: string;
  beadColor: string;
  type: ThreadType;
  attach?: number;
  tube?: number;
  showCordBeads?: boolean;
  showGoldTwist?: boolean;
  metalColor?: string;
}) {
  const mat = threadMaterial(type);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        // tuck into the medallion rim so cords don't float
        new THREE.Vector3(dir * attach, -0.02, -0.02),
        new THREE.Vector3(dir * (attach + 0.55), -0.28, -0.08),
        new THREE.Vector3(dir * (attach + 1.25), -0.22, -0.12),
        new THREE.Vector3(dir * (attach + 1.9), -0.55, -0.14),
      ]),
    [dir, attach]
  );
  const goldCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        curve.getPoints(20).map((p, i) => p.clone().add(new THREE.Vector3(0, Math.sin(i) * 0.02, 0.02)))
      ),
    [curve]
  );
  const beadPts = useMemo(() => [0.45, 0.72].map((t) => curve.getPointAt(t)), [curve]);

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curve, 48, tube, 10, false]} />
        <meshStandardMaterial color={threadColor} roughness={mat.roughness} metalness={mat.metalness} />
      </mesh>
      {showGoldTwist && (
        <mesh>
          <tubeGeometry args={[goldCurve, 48, Math.max(0.012, tube * 0.35), 6, false]} />
          <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.85} />
        </mesh>
      )}
      {showCordBeads &&
        beadPts.map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <sphereGeometry args={[tube * 1.6, 16, 16]} />
            <meshStandardMaterial color={i % 2 ? PEARL : beadColor} metalness={0.85} roughness={0.18} />
          </mesh>
        ))}
      <mesh position={curve.getPointAt(1)} castShadow>
        <sphereGeometry args={[tube * 2.2, 16, 16]} />
        <meshStandardMaterial color={beadColor} metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

type ThreadProps = {
  threadColor: string;
  beadColor: string;
  type?: ThreadType;
  showSpacers?: boolean;
  /** Distance from origin where cords meet the medallion. */
  attach?: number;
  tube?: number;
  showCordBeads?: boolean;
  showGoldTwist?: boolean;
  metalColor?: string;
};

/** Left/right cords that attach into the medallion rim. */
export default function Thread({
  threadColor,
  beadColor,
  type = "cotton",
  showSpacers = false,
  attach = 0.55,
  tube = 0.055,
  showCordBeads = true,
  showGoldTwist = true,
  metalColor = GOLD,
}: ThreadProps) {
  return (
    <group>
      <Cord
        dir={-1}
        threadColor={threadColor}
        beadColor={beadColor}
        type={type}
        attach={attach}
        tube={tube}
        showCordBeads={showCordBeads}
        showGoldTwist={showGoldTwist}
        metalColor={metalColor}
      />
      <Cord
        dir={1}
        threadColor={threadColor}
        beadColor={beadColor}
        type={type}
        attach={attach}
        tube={tube}
        showCordBeads={showCordBeads}
        showGoldTwist={showGoldTwist}
        metalColor={metalColor}
      />
      {showSpacers && (
        <>
          <FlutedSpacer x={-0.7} metalColor={metalColor} />
          <FlutedSpacer x={0.7} metalColor={metalColor} />
        </>
      )}
    </group>
  );
}
