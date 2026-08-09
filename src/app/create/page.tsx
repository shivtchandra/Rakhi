"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import RakhiStage from "@/components/RakhiStage";
import {
  STYLES,
  CHARMS,
  THREAD_SWATCHES,
  BEAD_SWATCHES,
  DEFAULT_THREAD_COLOR,
  DEFAULT_BEAD_COLOR,
  type RakhiStyle,
  type Charm,
} from "@/data/styles";
import { createRakhi } from "@/lib/rakhi";

const STYLE_ICON: Record<RakhiStyle, string> = {
  traditional: "◉",
  minimal: "◡",
  cute: "✿",
  premium: "♛",
};
const CHARM_ICON: Record<Charm, string> = {
  om: "ॐ",
  heart: "♥",
  initial: "A",
  gem: "◈",
};

function Swatches({
  colors,
  value,
  onChange,
}: {
  colors: string[];
  value: string;
  onChange: (c: string) => void;
}) {
  const picker = useRef<HTMLInputElement>(null);
  const isCustom = !colors.includes(value);
  return (
    <div className="flex items-center gap-2 mt-2 flex-wrap">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          aria-label={c}
          style={{ background: c }}
          className={`w-7 h-7 rounded-full ring-offset-2 transition ${
            value === c ? "ring-2 ring-rose-600 scale-110" : "ring-1 ring-black/10"
          }`}
        >
          {value === c && <span className="text-white text-xs drop-shadow">✓</span>}
        </button>
      ))}
      <button
        onClick={() => picker.current?.click()}
        style={isCustom ? { background: value } : undefined}
        className={`w-7 h-7 rounded-full border border-dashed grid place-items-center text-rose-500 hover:border-rose-400 ${
          isCustom ? "ring-2 ring-rose-600 text-white" : "border-rose-300"
        }`}
        aria-label="Custom color"
      >
        {isCustom ? "✓" : "+"}
      </button>
      <input
        ref={picker}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}

function Stepper({ active }: { active: 1 | 2 | 3 }) {
  const steps = ["Design", "Preview", "Share"];
  return (
    <div className="hidden md:flex items-center gap-3 rounded-full bg-white shadow-sm border border-rose-100 px-4 py-2">
      {steps.map((s, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const on = n === active;
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 grid place-items-center rounded-full text-xs font-semibold ${
                  on ? "bg-rose-700 text-white" : "bg-rose-50 text-rose-400"
                }`}
              >
                {n}
              </span>
              <span className={`text-sm ${on ? "text-rose-900 font-semibold" : "text-rose-400"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <span className="w-6 h-px bg-rose-200" />}
          </div>
        );
      })}
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
      <Link href="/" className="leading-tight">
        <span className="block font-display text-2xl text-rose-900">Rakhi<span className="text-gold">Box</span></span>
        <span className="block text-[11px] tracking-wide text-rose-500">Design. Personalise. Send.</span>
      </Link>
      <Stepper active={1} />
      <Link href="/" className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-rose-200 text-rose-700 text-sm px-4 py-2 hover:bg-rose-50">
        My Creations
      </Link>
    </header>
  );
}

export default function CreatePage() {
  const [style, setStyle] = useState<RakhiStyle>("traditional");
  const [threadColor, setThreadColor] = useState(DEFAULT_THREAD_COLOR);
  const [beadColor, setBeadColor] = useState(DEFAULT_BEAD_COLOR);
  const [charm, setCharm] = useState<Charm>("om");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("Happy Rakhi, bhai.");
  const [submitting, setSubmitting] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!message.trim()) {
      setError("Add a message before sending.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const id = await createRakhi({ style, threadColor, beadColor, charm, name, message });
      setLink(`${window.location.origin}/r/${id}`);
    } catch {
      setError("Couldn't create your rakhi. Check Firebase setup and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (link) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-amber-50 to-rose-50">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
          <h1 className="font-display text-3xl text-rose-900">Your rakhi is ready</h1>
          <p className="text-rose-700/80">Share this link — it opens as a gift.</p>
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-rose-100">
            <code className="text-sm text-rose-800 max-w-[60vw] truncate">{link}</code>
            <button onClick={() => navigator.clipboard.writeText(link)} className="text-xs font-medium text-rose-700 hover:text-rose-900">
              Copy
            </button>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I made you a rakhi. Open it on your phone: ${link}`)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-green-600 text-white px-6 py-2 text-sm font-medium hover:bg-green-700"
            >
              Share on WhatsApp
            </a>
            <a href={link} className="rounded-full border border-rose-300 text-rose-700 px-6 py-2 text-sm font-medium hover:bg-rose-50">
              Preview it
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-rose-50/50 to-amber-50/50">
      <Header />
      <main className="grid lg:grid-cols-2 gap-6 px-6 pb-10 max-w-7xl mx-auto w-full">
        {/* preview */}
        <RakhiStage style={style} threadColor={threadColor} beadColor={beadColor} charm={charm} initial={name} />

        {/* form */}
        <div className="rounded-3xl bg-white/70 backdrop-blur border border-rose-100/60 shadow-lg p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-rose-800">Design your Rakhi</h1>
            <p className="text-sm text-rose-500 mt-1">Make it unique. Make it yours.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-rose-900">Style</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {STYLES.map((s) => {
                const on = style === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      on ? "border-rose-400 bg-rose-50/70 ring-1 ring-rose-200" : "border-gray-200 hover:border-rose-200"
                    }`}
                  >
                    <span className={`w-9 h-9 grid place-items-center rounded-full text-lg ${on ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-500"}`}>
                      {STYLE_ICON[s.id]}
                    </span>
                    <span className="leading-tight">
                      <span className={`block text-sm font-semibold ${on ? "text-rose-900" : "text-gray-800"}`}>{s.label}</span>
                      <span className="block text-xs text-gray-500">{s.blurb}</span>
                    </span>
                    {on && <span className="absolute top-2 right-2 w-5 h-5 grid place-items-center rounded-full bg-rose-600 text-white text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-rose-900">Thread color</label>
              <Swatches colors={THREAD_SWATCHES} value={threadColor} onChange={setThreadColor} />
            </div>
            <div>
              <label className="text-sm font-medium text-rose-900">Bead color</label>
              <Swatches colors={BEAD_SWATCHES} value={beadColor} onChange={setBeadColor} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-rose-900">Charm</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {CHARMS.map((c) => {
                const on = charm === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCharm(c.id)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                      on ? "border-rose-400 bg-rose-50/70 text-rose-900 ring-1 ring-rose-200" : "border-gray-200 text-gray-700 hover:border-rose-200"
                    }`}
                  >
                    <span className="text-base">{CHARM_ICON[c.id]}</span>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {charm === "initial" && (
            <div>
              <label className="text-sm font-medium text-rose-900">Initial</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 1))}
                maxLength={1}
                className="block mt-2 w-16 rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-rose-900">Message</label>
            <div className="relative mt-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                rows={3}
                placeholder="Happy Rakhi, bhai."
                className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 resize-none"
              />
              <span className="absolute bottom-2 right-3 text-[11px] text-gray-400">{message.length} / 200</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              disabled
              title="Coming soon"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 text-gray-400 text-sm py-2.5 cursor-not-allowed"
            >
              Add voice message
            </button>
            <button
              disabled
              title="Coming soon"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 text-gray-400 text-sm py-2.5 cursor-not-allowed"
            >
              Upload image/video
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              onClick={handleGenerate}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-700 text-white px-8 py-4 font-semibold hover:bg-rose-800 disabled:opacity-60 transition shadow-lg shadow-rose-700/20"
            >
              {submitting ? "Creating…" : "Generate link"}
            </button>
            <p className="text-center text-xs text-rose-500/70 mt-2">You can preview and share on the next step</p>
          </div>
        </div>
      </main>
    </div>
  );
}
