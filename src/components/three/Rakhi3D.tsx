"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import type { RakhiStyle, Charm } from "@/data/styles";

const DEV_FONT = "/fonts/NotoSansDevanagari-Regular.ttf";
const GOLD = "#D9A93E";
const GOLD_DARK = "#8a6416";
const PEARL = "#F3ECDD";

type Props = {
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  initial?: string;
};

function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const t = amt < 0 ? 0 : 255;
    return Math.round((t - v) * Math.abs(amt) + v);
  });
  return "#" + ch.map((v) => v.toString(16).padStart(2, "0")).join("");
}

const PARAMS: Record<
  RakhiStyle,
  { petals: number; stones: number; beads: number; goldRim: boolean; fieldR: number; beadR: number; metal: number }
> = {
  traditional: { petals: 10, stones: 16, beads: 0, goldRim: true, fieldR: 0.9, beadR: 0.07, metal: 0.6 },
  minimal: { petals: 0, stones: 6, beads: 4, goldRim: false, fieldR: 0.78, beadR: 0.06, metal: 0.5 },
  cute: { petals: 0, stones: 0, beads: 8, goldRim: false, fieldR: 0.95, beadR: 0.11, metal: 0.5 },
  premium: { petals: 12, stones: 20, beads: 0, goldRim: true, fieldR: 0.92, beadR: 0.06, metal: 0.9 },
};

/** Radial teardrop kundan petals: pearly ellipsoid seated in a gold rim. */
function KundanPetals({ count, radius }: { count: number; radius: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        const rz = a - Math.PI / 2; // long axis points radially outward
        return (
          <group key={i} position={[x, y, 0.02]} rotation={[0, 0, rz]}>
            {/* gold rim behind */}
            <mesh position={[0, 0, -0.03]} scale={[0.17, 0.3, 0.05]} castShadow>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
            </mesh>
            {/* pearly kundan stone */}
            <mesh scale={[0.13, 0.24, 0.06]} castShadow>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color={PEARL} metalness={0.15} roughness={0.45} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/** Ring of tiny square kundan stones around the charm setting. */
function StoneRing({ count, radius }: { count: number; radius: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const alt = i % 2 === 0;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * radius, Math.sin(a) * radius, 0.16]}
            rotation={[0, 0, a]}
            castShadow
          >
            <boxGeometry args={[0.06, 0.06, 0.05]} />
            <meshStandardMaterial color={alt ? PEARL : GOLD} metalness={alt ? 0.2 : 0.9} roughness={alt ? 0.45 : 0.22} />
          </mesh>
        );
      })}
    </>
  );
}

/** Chunky colored-bead flower (cute style). */
function BeadFlower({ count, radius, size, color }: { count: number; radius: number; size: number; color: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0.04]} castShadow>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.25} />
          </mesh>
        );
      })}
    </>
  );
}

function FlutedSpacer({ x }: { x: number }) {
  return (
    <mesh position={[x, -0.12, -0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.12, 0.12, 0.22, 8]} />
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

/** One braided-looking cord: main colored tube + thin gold twist + tip bead. */
function Cord({ dir, threadColor, beadColor }: { dir: 1 | -1; threadColor: string; beadColor: string }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(dir * 0.85, -0.12, -0.18),
        new THREE.Vector3(dir * 1.5, -0.45, -0.18),
        new THREE.Vector3(dir * 2.35, -0.35, -0.18),
        new THREE.Vector3(dir * 2.95, -0.7, -0.18),
      ]),
    [dir]
  );
  const goldCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        curve.getPoints(20).map((p, i) => p.clone().add(new THREE.Vector3(0, Math.sin(i) * 0.03, 0.03)))
      ),
    [curve]
  );
  const beadPts = useMemo(() => [0.5, 0.75].map((t) => curve.getPointAt(t)), [curve]);
  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curve, 40, 0.055, 8, false]} />
        <meshStandardMaterial color={threadColor} roughness={0.9} metalness={0} />
      </mesh>
      {/* thin gold twist */}
      <mesh>
        <tubeGeometry args={[goldCurve, 40, 0.02, 6, false]} />
        <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.85} />
      </mesh>
      {beadPts.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={i % 2 ? PEARL : beadColor} metalness={0.85} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={curve.getPointAt(1)} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={beadColor} metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

function CharmSymbol({ charm, beadColor, initial }: { charm: Charm; beadColor: string; initial?: string }) {
  const heart = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.12);
    s.bezierCurveTo(0.16, 0.34, 0.42, 0.18, 0.24, -0.06);
    s.lineTo(0, -0.28);
    s.lineTo(-0.24, -0.06);
    s.bezierCurveTo(-0.42, 0.18, -0.16, 0.34, 0, 0.12);
    return s;
  }, []);

  switch (charm) {
    case "om":
      return (
        <Text font={DEV_FONT} fontSize={0.55} position={[0, -0.04, 0.22]} color={GOLD_DARK} anchorX="center" anchorY="middle">
          ॐ
        </Text>
      );
    case "heart":
      return (
        <mesh position={[0, 0.02, 0.18]} castShadow>
          <extrudeGeometry args={[heart, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }]} />
          <meshStandardMaterial color={beadColor} metalness={0.7} roughness={0.2} />
        </mesh>
      );
    case "gem":
      return (
        <mesh position={[0, 0, 0.26]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color={beadColor} metalness={0.6} roughness={0.05} flatShading />
        </mesh>
      );
    case "initial":
    default:
      return (
        <Text fontSize={0.5} position={[0, 0, 0.22]} color={GOLD_DARK} anchorX="center" anchorY="middle" fontWeight={700}>
          {(initial || "R").slice(0, 1).toUpperCase()}
        </Text>
      );
  }
}

export default function Rakhi3D({ style, threadColor, beadColor, charm, initial }: Props) {
  const p = PARAMS[style];
  const field = shade(threadColor, style === "cute" ? 0.05 : -0.05);

  return (
    <group>
      {/* cords behind medallion + fluted spacers at the junction */}
      <Cord dir={-1} threadColor={threadColor} beadColor={beadColor} />
      <Cord dir={1} threadColor={threadColor} beadColor={beadColor} />
      {p.petals > 0 && <FlutedSpacer x={-0.7} />}
      {p.petals > 0 && <FlutedSpacer x={0.7} />}

      {/* decorative flower layer */}
      {p.petals > 0 && <KundanPetals count={p.petals} radius={0.74} />}
      {p.beads > 0 && style === "cute" && <BeadFlower count={p.beads} radius={0.72} size={0.26} color={beadColor} />}

      {/* gold rim */}
      {p.goldRim && (
        <mesh castShadow>
          <torusGeometry args={[0.6, 0.05, 16, 64]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} />
        </mesh>
      )}

      {/* small metallic beads (minimal/cute accents) */}
      {p.beads > 0 && style !== "cute" && <BeadFlower count={p.beads} radius={0.6} size={p.beadR} color={beadColor} />}

      {/* enamel / velvet field */}
      <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[p.fieldR * 0.58, p.fieldR * 0.58, 0.14, 48]} />
        <meshStandardMaterial color={field} metalness={0.2} roughness={0.5} />
      </mesh>

      {/* square kundan stone ring */}
      {p.stones > 0 && <StoneRing count={p.stones} radius={0.5} />}

      {/* gold charm disc */}
      <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.12, 48]} />
        <meshStandardMaterial color="#FDF6E3" metalness={0.3} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.03, 12, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} />
      </mesh>

      <CharmSymbol charm={charm} beadColor={beadColor} initial={initial} />
    </group>
  );
}
