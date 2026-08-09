"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import RakhiSVG from "./RakhiSVG";
import type { RakhiSceneHandle } from "./three/RakhiScene";
import type { RakhiStyle, Charm } from "@/data/styles";

const RakhiScene = dynamic(() => import("./three/RakhiScene"), { ssr: false });

type Props = {
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  initial?: string;
};

const TRUST = [
  { icon: "🌿", title: "100% Digital", sub: "Eco-friendly" },
  { icon: "✈️", title: "Instant Delivery", sub: "Share in seconds" },
  { icon: "🔒", title: "Private & Secure", sub: "Only they can view" },
  { icon: "🖥️", title: "Works Everywhere", sub: "Mobile, tablet, desktop" },
];

function CtrlButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-xl bg-white/80 backdrop-blur px-2.5 py-2 shadow-sm hover:bg-white transition-colors"
    >
      <span className="text-rose-700 text-lg leading-none">{icon}</span>
      <span className="text-[10px] font-medium text-rose-900/70">{label}</span>
    </button>
  );
}

export default function RakhiStage(props: Props) {
  const scene = useRef<RakhiSceneHandle>(null);
  const [ready, setReady] = useState(false);

  // Mount the canvas only after the client is up (three cannot SSR); fade it in.
  useEffect(() => setReady(true), []);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-rose-100/60 flex flex-col">
      {/* festive backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-100 to-amber-50" />
      <div className="absolute -top-16 -left-10 w-56 h-56 rounded-full bg-rose-300/40 blur-3xl" />
      <div className="absolute bottom-10 right-0 w-64 h-64 rounded-full bg-amber-300/40 blur-3xl" />
      <div className="absolute top-1/3 left-1/2 w-40 h-40 rounded-full bg-white/50 blur-2xl" />

      {/* badge */}
      <div className="relative z-10 p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 shadow">
          ◈ 3D LIVE PREVIEW
        </span>
      </div>

      {/* controls */}
      <div className="absolute z-20 left-5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <CtrlButton label="Rotate" icon="⟳" onClick={() => scene.current?.toggleSpin()} />
        <CtrlButton label="Zoom" icon="⌕" onClick={() => scene.current?.zoomStep()} />
        <CtrlButton label="Reset" icon="⟲" onClick={() => scene.current?.reset()} />
      </div>

      {/* stage: SVG paints instantly, 3D canvas fades in over it once ready */}
      <div className="relative z-10 flex-1 min-h-[360px]">
        <div
          className={`absolute inset-0 flex items-center justify-center px-6 pointer-events-none transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        >
          <RakhiSVG {...props} className="w-64 h-64 drop-shadow-2xl" />
        </div>
        {ready && (
          <div className="absolute inset-0 transition-opacity duration-700 opacity-100">
            <RakhiScene {...props} apiRef={scene} />
          </div>
        )}
      </div>

      {/* hint */}
      <div className="relative z-10 flex justify-center pb-4">
        <span className="rounded-full bg-white/85 backdrop-blur text-rose-900/70 text-xs px-4 py-2 shadow-sm">
          👆 Drag to rotate • Scroll to zoom
        </span>
      </div>

      {/* trust row */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/70 backdrop-blur px-5 py-4 border-t border-rose-100/60">
        {TRUST.map((t) => (
          <div key={t.title} className="flex items-start gap-2">
            <span className="text-base leading-none">{t.icon}</span>
            <div className="leading-tight">
              <div className="text-[11px] font-semibold text-rose-900">{t.title}</div>
              <div className="text-[10px] text-rose-900/60">{t.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
