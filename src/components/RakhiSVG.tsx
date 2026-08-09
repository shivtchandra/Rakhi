"use client";

import { useId } from "react";
import type { RakhiStyle, Charm } from "@/data/styles";

type Props = {
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  initial?: string;
  className?: string;
};

/** Lighten (amt > 0) or darken (amt < 0) a hex color. */
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

const C = 120; // center

function Charmed({ charm, uid, initial }: { charm: Charm; uid: string; initial?: string }) {
  const fill = `url(#${uid}-stone)`;
  switch (charm) {
    case "om":
      return (
        <text x={C} y={C + 15} textAnchor="middle" fontSize="44" fontWeight="600" fill={fill}>
          ॐ
        </text>
      );
    case "heart":
      return (
        <path
          d="M120 139 C99 123, 91 110, 100 102 C107 96, 116 99, 120 107 C124 99, 133 96, 140 102 C149 110, 141 123, 120 139 Z"
          fill={fill}
        />
      );
    case "gem":
      return (
        <g>
          <polygon points="120,97 138,109 138,131 120,143 102,131 102,109" fill={fill} />
          <polygon points="120,107 130,113 130,127 120,133 110,127 110,113" fill="#fff" fillOpacity="0.35" />
          <g stroke="#fff" strokeOpacity="0.5" strokeWidth="1">
            <line x1="120" y1="97" x2="120" y2="107" />
            <line x1="138" y1="109" x2="130" y2="113" />
            <line x1="138" y1="131" x2="130" y2="127" />
            <line x1="120" y1="143" x2="120" y2="133" />
            <line x1="102" y1="131" x2="110" y2="127" />
            <line x1="102" y1="109" x2="110" y2="113" />
          </g>
        </g>
      );
    case "initial":
    default:
      return (
        <text x={C} y={C + 14} textAnchor="middle" fontSize="40" fontWeight="700" fill={fill} fontFamily="Georgia, serif">
          {(initial || "R").slice(0, 1).toUpperCase()}
        </text>
      );
  }
}

export default function RakhiSVG({ style, threadColor, beadColor, charm, initial, className }: Props) {
  const uid = useId().replace(/:/g, "");

  // Coordinates are rounded: raw Math.cos/sin output differs in the last
  // float digit between Node and the browser, which trips React hydration.
  const round = (v: number) => Math.round(v * 1000) / 1000;

  const ring = (n: number, r: number, dot: number, fill: string, phase = 0) =>
    Array.from({ length: n }).map((_, i) => {
      const a = ((i + phase) * 2 * Math.PI) / n;
      return (
        <circle
          key={i}
          cx={round(C + Math.cos(a) * r)}
          cy={round(C + Math.sin(a) * r)}
          r={dot}
          fill={fill}
        />
      );
    });

  const petals = (n: number, ry: number, rx: number, dist: number, fill: string) =>
    Array.from({ length: n }).map((_, i) => (
      <ellipse
        key={i}
        cx={C}
        cy={C - dist}
        rx={rx}
        ry={ry}
        fill={fill}
        transform={`rotate(${(i * 360) / n} ${C} ${C})`}
      />
    ));

  /** Pointed sunburst spikes — the shape most real kundan/zari rakhis use. */
  const spikes = (n: number, outer: number, inner: number, w: number, fill: string, phase = 0) =>
    Array.from({ length: n }).map((_, i) => (
      <path
        key={i}
        d={`M ${C} ${C - outer} L ${C + w} ${C - inner} L ${C - w} ${C - inner} Z`}
        fill={fill}
        transform={`rotate(${(i * 360) / n + phase} ${C} ${C})`}
      />
    ));

  const gold = `url(#${uid}-gold)`;
  const pearl = `url(#${uid}-pearl)`;
  const bead = `url(#${uid}-bead)`;
  const silk = `url(#${uid}-silk)`;

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="Rakhi">
      <defs>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#F9EBB4" />
          <stop offset="30%" stopColor="#DDB25A" />
          <stop offset="60%" stopColor="#B07F24" />
          <stop offset="85%" stopColor="#E5C97E" />
          <stop offset="100%" stopColor="#C79B3E" />
        </linearGradient>
        <radialGradient id={`${uid}-pearl`} cx="34%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#F4EBDD" />
          <stop offset="100%" stopColor="#D2C0A8" />
        </radialGradient>
        <radialGradient id={`${uid}-bead`} cx="34%" cy="28%">
          <stop offset="0%" stopColor={shade(beadColor, 0.55)} />
          <stop offset="55%" stopColor={beadColor} />
          <stop offset="100%" stopColor={shade(beadColor, -0.35)} />
        </radialGradient>
        <radialGradient id={`${uid}-stone`} cx="34%" cy="28%">
          <stop offset="0%" stopColor={shade(beadColor, 0.5)} />
          <stop offset="60%" stopColor={beadColor} />
          <stop offset="100%" stopColor={shade(beadColor, -0.3)} />
        </radialGradient>
        <linearGradient id={`${uid}-silk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(threadColor, 0.3)} />
          <stop offset="50%" stopColor={threadColor} />
          <stop offset="100%" stopColor={shade(threadColor, -0.3)} />
        </linearGradient>
        <radialGradient id={`${uid}-velvet`} cx="38%" cy="30%">
          <stop offset="0%" stopColor={shade(threadColor, 0.28)} />
          <stop offset="70%" stopColor={threadColor} />
          <stop offset="100%" stopColor={shade(threadColor, -0.4)} />
        </radialGradient>
        <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#3a1f14" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* ---- thread (behind medallion) ---- */}
      <g strokeLinecap="round" fill="none">
        <path d="M120 150 C 82 178, 44 186, 4 176" stroke={silk} strokeWidth={style === "cute" ? 6 : 4} />
        <path d="M120 150 C 158 178, 196 186, 236 176" stroke={silk} strokeWidth={style === "cute" ? 6 : 4} />
        {(style === "traditional" || style === "premium") && (
          <>
            <path d="M120 154 C 84 182, 46 190, 6 181" stroke={gold} strokeWidth="1.8" strokeDasharray="4 6" />
            <path d="M120 154 C 156 182, 194 190, 234 181" stroke={gold} strokeWidth="1.8" strokeDasharray="4 6" />
          </>
        )}
      </g>
      {/* flanking beads strung on the cord, plus end beads */}
      {[
        { x: 72, y: 172, r: 4.5 },
        { x: 56, y: 176, r: 3.5 },
        { x: 168, y: 172, r: 4.5 },
        { x: 184, y: 176, r: 3.5 },
      ].map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={i % 2 ? pearl : bead} />
      ))}
      <circle cx="30" cy="180" r={style === "cute" ? 7 : 5.5} fill={bead} />
      <circle cx="210" cy="180" r={style === "cute" ? 7 : 5.5} fill={bead} />

      <g filter={`url(#${uid}-shadow)`}>
        {/* ---- outer decorative layer ---- */}
        {style === "traditional" && (
          <>
            {spikes(16, 78, 52, 9, gold)}
            {spikes(16, 68, 52, 6, shade(threadColor, -0.15), 11.25)}
            <circle cx={C} cy={C} r="56" fill={gold} />
          </>
        )}
        {style === "premium" && (
          <>
            {petals(16, 15, 8, 63, gold)}
            {ring(16, 74, 4, shade(beadColor, 0.1))}
            <circle cx={C} cy={C} r="58" fill={gold} />
            <path d="M120 62 A 58 58 0 0 1 178 120" stroke="#fff" strokeOpacity="0.55" strokeWidth="5" fill="none" strokeLinecap="round" />
          </>
        )}
        {style === "cute" && (
          <>
            {petals(8, 24, 18, 44, bead)}
            <circle cx={C} cy={C} r="46" fill={`url(#${uid}-velvet)`} />
          </>
        )}
        {style === "minimal" && (
          <>
            <circle cx={C} cy={C} r="48" fill="none" stroke={silk} strokeWidth="3" />
            <circle cx={C} cy={C} r="42" fill="#FFFDF8" stroke={gold} strokeWidth="1.5" />
          </>
        )}

        {/* ---- pearl / bead ring ---- */}
        {style === "traditional" && (
          <>
            {ring(12, 49, 7, shade("#B07F24", -0.1))}
            {ring(12, 49, 5, pearl)}
          </>
        )}
        {style === "premium" && (
          <>
            {ring(20, 51, 4.6, shade("#B07F24", -0.1))}
            {ring(20, 51, 3.2, pearl)}
            {ring(16, 42, 3, bead, 0.5)}
          </>
        )}
        {style === "cute" && ring(10, 40, 6, pearl)}
        {style === "minimal" && ring(3, 42, 3.5, bead, 0.5)}

        {/* ---- enamel / velvet field ---- */}
        {style !== "minimal" && (
          <circle cx={C} cy={C} r={style === "cute" ? 32 : 40} fill={`url(#${uid}-velvet)`} />
        )}
        {(style === "traditional" || style === "premium") && (
          <circle cx={C} cy={C} r="34" fill="none" stroke={gold} strokeWidth="3" />
        )}

        {/* ---- center disc holding the charm ---- */}
        <circle cx={C} cy={C} r={style === "minimal" ? 26 : 29} fill="#FFFCF4" />
        <circle
          cx={C}
          cy={C}
          r={style === "minimal" ? 26 : 29}
          fill="none"
          stroke={style === "cute" ? bead : gold}
          strokeWidth="2"
        />
        <path
          d={`M ${C - 20} ${C - 12} A 24 24 0 0 1 ${C + 4} ${C - 26}`}
          stroke="#fff"
          strokeOpacity="0.9"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Charmed charm={charm} uid={uid} initial={initial} />
      </g>
    </svg>
  );
}
