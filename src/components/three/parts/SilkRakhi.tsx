"use client";

/**
 * Procedural classic silk rakhi reconstructed from reference photo
 * (public/ref-silk-rakhi.png) via img2threejs analysis.
 *
 * Approximate / stylized: fringe fibers are instanced cylinders (not each real thread);
 * underside and cord tips are inferred from a single top-down view.
 */

import { useMemo } from "react";
import * as THREE from "three";

/** Palette observed from the reference. */
export const SILK = {
  fringe: "#B91C2C",
  fringeDeep: "#8F1422",
  cream: "#F0D9A8",
  yellow: "#E6B422",
  yellowDeep: "#C4921A",
  green: "#6FAE44",
  greenHi: "#83B552",
} as const;

function TwistedCord({ dir, attach = 0.55 }: { dir: 1 | -1; attach?: number }) {
  const curves = useMemo(() => {
    const spine = new THREE.CatmullRomCurve3([
      new THREE.Vector3(dir * attach, 0.02, 0.02),
      new THREE.Vector3(dir * (attach + 0.45), -0.12, 0.0),
      new THREE.Vector3(dir * (attach + 1.05), dir > 0 ? -0.05 : -0.18, -0.04),
      new THREE.Vector3(dir * (attach + 1.75), dir > 0 ? -0.28 : -0.35, -0.06),
      new THREE.Vector3(dir * (attach + 2.35), -0.42, -0.05),
    ]);
    const pts = spine.getSpacedPoints(64);
    const redPts: THREE.Vector3[] = [];
    const yelPts: THREE.Vector3[] = [];
    const radius = 0.028;
    for (let i = 0; i < pts.length; i++) {
      const t = i / (pts.length - 1);
      const tang = spine.getTangentAt(t).normalize();
      const up = Math.abs(tang.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const side = new THREE.Vector3().crossVectors(tang, up).normalize();
      const bit = new THREE.Vector3().crossVectors(tang, side).normalize();
      const ang = t * Math.PI * 14;
      const ox = Math.cos(ang) * radius;
      const oy = Math.sin(ang) * radius;
      const off = side.clone().multiplyScalar(ox).add(bit.clone().multiplyScalar(oy));
      redPts.push(pts[i].clone().add(off));
      yelPts.push(pts[i].clone().add(off.clone().multiplyScalar(-1)));
    }
    return {
      red: new THREE.CatmullRomCurve3(redPts),
      yellow: new THREE.CatmullRomCurve3(yelPts),
      tip: spine.getPointAt(1),
    };
  }, [dir, attach]);

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curves.red, 64, 0.022, 8, false]} />
        <meshStandardMaterial color={SILK.fringe} roughness={0.78} metalness={0} />
      </mesh>
      <mesh castShadow>
        <tubeGeometry args={[curves.yellow, 64, 0.022, 8, false]} />
        <meshStandardMaterial color={SILK.yellow} roughness={0.72} metalness={0} />
      </mesh>
      <mesh position={curves.tip} castShadow>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color={SILK.fringeDeep} roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}

function Fringe({
  color,
  count = 110,
  innerR = 0.4,
  outerR = 0.74,
}: {
  color: string;
  count?: number;
  innerR?: number;
  outerR?: number;
}) {
  const deep = useMemo(() => {
    try {
      const c = new THREE.Color(color);
      c.offsetHSL(0, 0.02, -0.12);
      return `#${c.getHexString()}`;
    } catch {
      return SILK.fringeDeep;
    }
  }, [color]);

  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      const jitter = ((i * 17) % 7) * 0.004;
      const len = outerR - innerR + jitter;
      const mid = innerR + len * 0.5;
      return {
        pos: [Math.cos(a) * mid, Math.sin(a) * mid, 0.012 + (i % 3) * 0.003] as [number, number, number],
        rot: a,
        len,
        thick: 0.011 + (i % 5) * 0.0014,
      };
    });
  }, [count, innerR, outerR]);

  return (
    <group>
      <mesh position={[0, 0, 0.004]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerR * 0.9, outerR * 0.98, 64]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} rotation={[Math.PI / 2, 0, it.rot]} castShadow>
          <cylinderGeometry args={[it.thick * 0.4, it.thick, it.len, 5]} />
          <meshStandardMaterial color={i % 3 === 0 ? deep : color} roughness={0.88} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

function YellowSpokes({ count = 18, radius = 0.34 }: { count?: number; radius?: number }) {
  return (
    <group>
      <mesh position={[0, 0, 0.032]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, 0.018, 48]} />
        <meshStandardMaterial color={SILK.yellowDeep} roughness={0.7} metalness={0} />
      </mesh>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const len = radius * 0.88;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * len * 0.5, Math.sin(a) * len * 0.5, 0.046]}
            rotation={[Math.PI / 2, 0, a]}
          >
            <cylinderGeometry args={[0.008, 0.01, len, 5]} />
            <meshStandardMaterial color={SILK.yellow} roughness={0.65} metalness={0} />
          </mesh>
        );
      })}
    </group>
  );
}

type Props = {
  threadColor?: string;
  beadColor?: string;
};

export default function SilkRakhi({ threadColor, beadColor }: Props) {
  const fringe = threadColor || SILK.fringe;
  const cream = beadColor || SILK.cream;

  return (
    <group>
      <TwistedCord dir={-1} attach={0.5} />
      <TwistedCord dir={1} attach={0.5} />

      <Fringe color={fringe} />
      <YellowSpokes />

      {Array.from({ length: 13 }).map((_, i) => {
        const a = (i / 13) * Math.PI * 2 + Math.PI / 13;
        const r = 0.38;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, Math.sin(a) * r, 0.062]}
            scale={[1, 1, 0.7]}
            castShadow
          >
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshStandardMaterial color={cream} roughness={0.55} metalness={0.05} />
          </mesh>
        );
      })}

      <mesh position={[0, 0, 0.1]} scale={[1, 1, 0.78]} castShadow>
        <sphereGeometry args={[0.145, 24, 18]} />
        <meshStandardMaterial color={SILK.green} roughness={0.28} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0, 0.165]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={SILK.greenHi} roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}
