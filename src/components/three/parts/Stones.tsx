"use client";

import { GOLD, PEARL } from "./materials";

function KundanPetals({ count, radius, metalColor = GOLD }: { count: number; radius: number; metalColor?: string }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        const rz = a - Math.PI / 2;
        return (
          <group key={i} position={[x, y, 0.02]} rotation={[0, 0, rz]}>
            <mesh position={[0, 0, -0.03]} scale={[0.17, 0.3, 0.05]} castShadow>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.25} />
            </mesh>
            <mesh scale={[0.13, 0.24, 0.06]} castShadow>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color={PEARL} metalness={0.15} roughness={0.45} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function StoneRing({ count, radius, metalColor = GOLD }: { count: number; radius: number; metalColor?: string }) {
  return (
    <group>
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
            <meshStandardMaterial
              color={alt ? PEARL : metalColor}
              metalness={alt ? 0.2 : 0.9}
              roughness={alt ? 0.45 : 0.22}
            />
          </mesh>
        );
      })}
    </group>
  );
}

type StonesProps = {
  petals: number;
  stones: number;
  goldRim: boolean;
  petalRadius?: number;
  stoneRadius?: number;
  rimRadius?: number;
  rimTube?: number;
  metalColor?: string;
};

/** Kundan petals, square stone ring, and optional gold torus rim. */
export default function Stones({
  petals,
  stones,
  goldRim,
  petalRadius = 0.74,
  stoneRadius = 0.5,
  rimRadius = 0.6,
  rimTube = 0.05,
  metalColor = GOLD,
}: StonesProps) {
  return (
    <group>
      {petals > 0 && <KundanPetals count={petals} radius={petalRadius} metalColor={metalColor} />}
      {goldRim && (
        <mesh castShadow>
          <torusGeometry args={[rimRadius, rimTube, 16, 64]} />
          <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.2} />
        </mesh>
      )}
      {stones > 0 && <StoneRing count={stones} radius={stoneRadius} metalColor={metalColor} />}
    </group>
  );
}
