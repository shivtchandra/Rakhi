import type { RakhiStyle, Charm } from "@/data/styles";

type Props = {
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  initial?: string;
  className?: string;
};

function CharmShape({ charm, beadColor, initial }: { charm: Charm; beadColor: string; initial?: string }) {
  switch (charm) {
    case "om":
      return (
        <text x="100" y="112" textAnchor="middle" fontSize="46" fontWeight="700" fill={beadColor}>
          ॐ
        </text>
      );
    case "heart":
      return (
        <path
          d="M100 122 C70 100 60 78 78 66 C90 58 100 68 100 78 C100 68 110 58 122 66 C140 78 130 100 100 122 Z"
          fill={beadColor}
        />
      );
    case "gem":
      return <polygon points="100,66 124,88 112,122 88,122 76,88" fill={beadColor} />;
    case "initial":
    default:
      return (
        <text x="100" y="112" textAnchor="middle" fontSize="42" fontWeight="700" fill={beadColor}>
          {(initial || "R").slice(0, 1).toUpperCase()}
        </text>
      );
  }
}

export default function RakhiSVG({ style, threadColor, beadColor, charm, initial, className }: Props) {
  const shine = style === "premium";
  const beadCount = style === "cute" ? 7 : 5;
  const beadRadius = style === "minimal" ? 4 : style === "cute" ? 7 : 5.5;
  const strokeWidth = style === "minimal" ? 3 : 6;

  const beads = Array.from({ length: beadCount }).map((_, i) => {
    const angle = (i / (beadCount - 1)) * Math.PI - Math.PI / 2;
    const r = 58;
    const x = 100 + Math.cos(angle) * r;
    const y = 95 - Math.sin(angle) * r * 0.55;
    return <circle key={i} cx={x} cy={y - 10} r={beadRadius} fill={beadColor} />;
  });

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Rakhi">
      <circle cx="100" cy="95" r="62" fill="none" stroke={threadColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      {shine && (
        <circle cx="100" cy="95" r="62" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth={2} strokeDasharray="8 14" />
      )}
      {style !== "minimal" && beads}
      <circle cx="100" cy="95" r="34" fill={threadColor} opacity="0.12" />
      <circle cx="100" cy="95" r="30" fill="#fff" stroke={threadColor} strokeWidth="2" />
      <CharmShape charm={charm} beadColor={beadColor} initial={initial} />
      <path d="M60 140 Q100 165 140 140" stroke={threadColor} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
