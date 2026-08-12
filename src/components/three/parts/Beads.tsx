"use client";

type BeadsProps = {
  count: number;
  radius: number;
  size: number;
  color: string;
  metalness?: number;
};

/** Ring of spherical beads around the medallion (cute / minimal accents). */
export default function Beads({ count, radius, size, color, metalness = 0.5 }: BeadsProps) {
  if (count <= 0) return null;

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0.04]} castShadow>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial color={color} metalness={metalness} roughness={0.25} />
          </mesh>
        );
      })}
    </group>
  );
}
