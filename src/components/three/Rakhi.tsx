"use client";

import type { RakhiStyle, Charm as CharmId } from "@/data/styles";
import Thread from "./parts/Thread";
import Beads from "./parts/Beads";
import Stones from "./parts/Stones";
import Charm from "./parts/Charm";
import SilkRakhi from "./parts/SilkRakhi";
import { shade, type StyleParams, GOLD, GOLD_DARK, SILVER, SILVER_DARK, BRONZE, BRONZE_DARK } from "./parts/materials";

export type RakhiProps = {
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: CharmId;
  initial?: string;
};

export const STYLE_PARAMS: Record<RakhiStyle, StyleParams> = {
  traditional: {
    petals: 10,
    stones: 16,
    beads: 0,
    goldRim: true,
    fieldR: 0.9,
    beadR: 0.07,
    metal: 0.6,
    threadType: "cotton",
  },
  minimal: {
    petals: 0,
    stones: 0,
    beads: 0,
    goldRim: true,
    fieldR: 0.72,
    beadR: 0.05,
    metal: 0.35,
    threadType: "silk",
  },
  cute: {
    petals: 0,
    stones: 0,
    beads: 8,
    goldRim: false,
    fieldR: 0.95,
    beadR: 0.11,
    metal: 0.5,
    threadType: "cotton",
  },
  premium: {
    petals: 12,
    stones: 20,
    beads: 0,
    goldRim: true,
    fieldR: 0.92,
    beadR: 0.06,
    metal: 0.9,
    threadType: "silk",
  },
  festive: {
    petals: 14,
    stones: 24,
    beads: 10,
    goldRim: true,
    fieldR: 0.96,
    beadR: 0.08,
    metal: 0.75,
    threadType: "silk",
  },
  silk: {
    petals: 0,
    stones: 0,
    beads: 0,
    goldRim: false,
    fieldR: 0.9,
    beadR: 0.07,
    metal: 0.6,
    threadType: "cotton",
  },
  rudraksha: {
    petals: 0,
    stones: 0,
    beads: 10,
    goldRim: true,
    fieldR: 0.8,
    beadR: 0.14,
    metal: 0.1,
    threadType: "cotton",
  },
  silver: {
    petals: 8,
    stones: 14,
    beads: 0,
    goldRim: true,
    fieldR: 0.86,
    beadR: 0.05,
    metal: 0.95,
    threadType: "silk",
  },
  royal: {
    petals: 16,
    stones: 28,
    beads: 14,
    goldRim: true,
    fieldR: 1.05,
    beadR: 0.065,
    metal: 0.9,
    threadType: "silk",
  },
};

/** Composed modular rakhi (Thread + Stones + Beads + Charm). */
export default function Rakhi({ style, threadColor, beadColor, charm, initial }: RakhiProps) {
  if (style === "silk") {
    return <SilkRakhi threadColor={threadColor} beadColor={beadColor} />;
  }

  const p = STYLE_PARAMS[style];
  const fieldBoost = style === "cute" || style === "festive" ? 0.05 : -0.05;
  const field = shade(threadColor, fieldBoost);
  const isMinimal = style === "minimal";
  const attach = Math.max(0.38, p.fieldR * 0.58 - (isMinimal ? 0.02 : 0.05));

  let metalColor = GOLD;
  let metalColorDark = GOLD_DARK;
  if (style === "silver") {
    metalColor = SILVER;
    metalColorDark = SILVER_DARK;
  } else if (style === "rudraksha") {
    metalColor = BRONZE;
    metalColorDark = BRONZE_DARK;
  }

  return (
    <group>
      <Thread
        threadColor={threadColor}
        beadColor={beadColor}
        type={p.threadType}
        showSpacers={p.petals > 0}
        attach={attach}
        tube={isMinimal ? 0.032 : 0.055}
        showCordBeads={!isMinimal}
        showGoldTwist={!isMinimal}
        metalColor={metalColor}
      />

      <Stones
        petals={p.petals}
        stones={p.stones}
        goldRim={p.goldRim}
        rimRadius={isMinimal ? 0.42 : 0.6}
        rimTube={isMinimal ? 0.025 : 0.05}
        metalColor={metalColor}
      />

      {p.beads > 0 && style === "cute" && (
        <Beads count={p.beads} radius={0.72} size={0.26} color={beadColor} metalness={p.metal} />
      )}
      {p.beads > 0 && style === "festive" && (
        <Beads count={p.beads} radius={0.68} size={p.beadR} color={beadColor} metalness={p.metal} />
      )}
      {p.beads > 0 && style === "rudraksha" && (
        <Beads count={p.beads} radius={0.65} size={p.beadR} color="#7A4B23" metalness={p.metal} />
      )}
      {p.beads > 0 && style !== "cute" && style !== "festive" && style !== "rudraksha" && style !== "minimal" && (
        <Beads count={p.beads} radius={0.6} size={p.beadR} color={beadColor} metalness={p.metal} />
      )}

      <Charm
        charm={charm}
        beadColor={beadColor}
        initial={initial}
        fieldColor={field}
        fieldR={p.fieldR}
        compact={isMinimal}
        metalColor={metalColor}
        metalColorDark={metalColorDark}
      />
    </group>
  );
}
