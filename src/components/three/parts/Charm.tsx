"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import type { Charm as CharmId } from "@/data/styles";
import { DEV_FONT, GOLD, GOLD_DARK } from "./materials";

function CharmSymbol({
  charm,
  beadColor,
  initial,
  metalColorDark = GOLD_DARK,
}: {
  charm: CharmId;
  beadColor: string;
  initial?: string;
  metalColorDark?: string;
}) {
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
        <Text
          font={DEV_FONT}
          fontSize={0.55}
          position={[0, -0.04, 0.22]}
          color={metalColorDark}
          anchorX="center"
          anchorY="middle"
        >
          ॐ
        </Text>
      );
    case "heart":
      return (
        <mesh position={[0, 0.02, 0.18]} castShadow>
          <extrudeGeometry
            args={[heart, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }]}
          />
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
        <Text
          fontSize={0.5}
          position={[0, 0, 0.22]}
          color={metalColorDark}
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          {(initial || "R").slice(0, 1).toUpperCase()}
        </Text>
      );
  }
}

type CharmProps = {
  charm: CharmId;
  beadColor: string;
  initial?: string;
  fieldColor: string;
  fieldR: number;
  compact?: boolean;
  metalColor?: string;
  metalColorDark?: string;
};

/** Enamel field + cream setting disc + charm symbol (om / heart / gem / initial). */
export default function Charm({
  charm,
  beadColor,
  initial,
  fieldColor,
  fieldR,
  compact = false,
  metalColor = GOLD,
  metalColorDark = GOLD_DARK,
}: CharmProps) {
  const discR = compact ? 0.32 : 0.4;
  const fieldH = compact ? 0.1 : 0.14;
  const discH = compact ? 0.09 : 0.12;

  return (
    <group>
      <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[fieldR * 0.58, fieldR * 0.58, fieldH, 48]} />
        <meshStandardMaterial color={fieldColor} metalness={0.15} roughness={0.55} />
      </mesh>

      <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[discR, discR, discH, 48]} />
        <meshStandardMaterial color="#FDF6E3" metalness={0.25} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[discR, compact ? 0.02 : 0.03, 12, 48]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.2} />
      </mesh>

      <group scale={compact ? 0.85 : 1}>
        <CharmSymbol charm={charm} beadColor={beadColor} initial={initial} metalColorDark={metalColorDark} />
      </group>
    </group>
  );
}
