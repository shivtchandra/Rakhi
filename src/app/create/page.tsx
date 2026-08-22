"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import RakhiStage from "@/components/RakhiStage";
import RakhiSVG from "@/components/RakhiSVG";
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
import { createRakhi, isFirebaseConfigured } from "@/lib/rakhi";
import { fileToDataUrl, MAX_SONG_BYTES } from "@/lib/songStore";
import { toSpotifyEmbedUrl } from "@/lib/spotify";

const STYLE_CHARMS: Charm[] = ["om", "heart", "initial", "gem", "om", "heart", "initial", "gem", "om"];
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
          type="button"
          onClick={() => onChange(c)}
          aria-label={c}
          style={{ background: c }}
          className={`w-8 h-8 rounded-full ring-offset-2 ring-offset-paper transition ${
            value === c ? "ring-2 ring-lacquer scale-110" : "ring-1 ring-ink/10"
          }`}
        >
          {value === c && <span className="text-white text-xs drop-shadow">✓</span>}
        </button>
      ))}
      <button
        type="button"
        onClick={() => picker.current?.click()}
        style={isCustom ? { background: value } : undefined}
        className={`w-8 h-8 rounded-full border border-dashed grid place-items-center text-lacquer hover:border-lacquer ${
          isCustom ? "ring-2 ring-lacquer text-white" : "border-lacquer/40"
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


function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl tracking-tight ${className}`}>
      Make Your <span className="text-lacquer-bright">Rakhi</span>
    </span>
  );
}

function Header() {
  return (
    <header className="page-shell flex items-center justify-between py-5 h-16">
      <Link href="/">
        <Wordmark className="text-ink" />
      </Link>
      <Link href="/" className="text-sm tracking-wide text-ink/70 link-underline hover:text-ink">
        Home
      </Link>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-plum text-cream-ink/60 border-t border-cream-ink/10 mt-auto">
      <div className="page-shell py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/">
          <Wordmark className="text-cream-ink" />
        </Link>
        <p className="text-sm italic font-display text-cream-ink/70">
          Not just a message. A moment.
        </p>
        <Link href="/" className="text-sm link-underline hover:text-cream-ink">
          Home
        </Link>
      </div>
    </footer>
  );
}

export default function CreatePage() {
  const [style, setStyle] = useState<RakhiStyle>("traditional");
  const [threadColor, setThreadColor] = useState(DEFAULT_THREAD_COLOR);
  const [beadColor, setBeadColor] = useState(DEFAULT_BEAD_COLOR);
  const [charm, setCharm] = useState<Charm>("om");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("Happy Rakhi, bhai.");
  const [upiId, setUpiId] = useState('');
  const [songName, setSongName] = useState<string | null>(null);
  const [songDataUrl, setSongDataUrl] = useState<string | null>(null);
  const [spotifyInput, setSpotifyInput] = useState("");
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const songInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const styleParam = new URLSearchParams(window.location.search).get("style");
    if (styleParam && STYLES.some((s) => s.id === styleParam)) {
      setStyle(styleParam as RakhiStyle);
    }
  }, []);

  async function handleGenerate() {
    if (!message.trim()) {
      setError("Add a message before sending.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const id = await createRakhi({
        style,
        threadColor,
        beadColor,
        charm,
        name,
        message,
        ...(songName && songDataUrl ? { songName, songDataUrl } : {}),
        ...(spotifyEmbedUrl ? { spotifyEmbedUrl } : {}),
        ...(upiId ? { upiId } : {}),
      });
      setLink(`${window.location.origin}/r/${id}`);
    } catch (err) {
      console.error(err);
      setError("Couldn't create your rakhi. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (link) {
    return (
      <div className="flex-1 flex flex-col bg-paper">
        <Header />
        <main className="page-shell flex-1 flex flex-col items-center justify-center gap-6 py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight">Your rakhi is ready</h1>
          <p className="text-[15px] text-ink/60 leading-relaxed">Share this link. It opens as a gift.</p>
          {!isFirebaseConfigured() && (
            <p className="text-xs text-ink/45 max-w-sm">
              Link includes your design (no cloud DB yet). Works across phones. Attached audio
              files stay on this device — use Spotify for songs that travel.
            </p>
          )}
          <div className="flex items-center gap-3 pill-shell px-5 py-3 shadow-sm max-w-full">
            <code className="text-sm text-ink max-w-[55vw] truncate">{link}</code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(link)}
              className="shrink-0 rounded-full bg-lacquer text-white text-xs font-medium px-4 py-1.5 hover:bg-lacquer-deep"
            >
              Copy
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I made you a rakhi. Open it on your phone: ${link}`)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#25D366] text-white px-6 py-2.5 text-sm font-medium hover:brightness-95"
            >
              Share on WhatsApp
            </a>
            {typeof navigator !== "undefined" && !!navigator.share && (
              <button
                type="button"
                onClick={() =>
                  navigator.share({ title: "I made you a rakhi", text: "Open it on your phone", url: link }).catch(() => {})
                }
                className="rounded-full border border-lacquer/30 text-lacquer px-6 py-2.5 text-sm font-medium hover:bg-lacquer-soft"
              >
                More share options
              </button>
            )}
            <a
              href={link}
              className="rounded-full border border-lacquer/30 text-lacquer px-6 py-2.5 text-sm font-medium hover:bg-lacquer-soft"
            >
              Preview it
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <Header />
      <main className="page-shell pb-10 pt-1 lg:pt-2">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        <RakhiStage style={style} threadColor={threadColor} beadColor={beadColor} charm={charm} initial={name} />

        <div className="soft-shell p-6 sm:p-8 flex flex-col gap-7 shadow-[0_16px_48px_-20px_rgba(185,28,44,0.12)]">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-lacquer-bright -ml-[0.14em]">Create</p>
            <h1 className="font-display text-4xl sm:text-[2.75rem] leading-tight text-ink mt-3">Design your rakhi</h1>
            <p className="mt-3 text-[15px] text-ink/60 leading-relaxed max-w-md">Thread, stones, charm, colour — it turns as you build.</p>
          </div>

          <div>
            <label className="text-xs font-medium tracking-[0.12em] uppercase text-ink/50">
              Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {STYLES.map((s, i) => {
                const on = style === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    className={`flex items-center gap-3 rounded-[1.5rem] border p-4 text-left transition duration-200 ${
                      on
                        ? "border-lacquer/25 bg-white ring-1 ring-lacquer/20 shadow-[0_12px_36px_-16px_rgba(185,28,44,0.2)]"
                        : "border-ink/10 bg-white/70 hover:border-lacquer/20 hover:-translate-y-0.5"
                    }`}
                  >
                    <div
                      className="w-14 h-14 shrink-0 grid place-items-center rounded-full bg-white border border-lacquer/10 shadow-sm"
                    >
                      <RakhiSVG
                        style={s.id}
                        threadColor="#B91C2C"
                        beadColor="#E4C878"
                        charm={STYLE_CHARMS[i]}
                        initial="R"
                        className="w-10 h-10"
                      />
                    </div>
                    <span className="leading-tight min-w-0">
                      <span className="block font-display text-lg leading-tight text-ink">
                        {s.label}
                      </span>
                      <span className="block text-sm text-ink/55 mt-0.5">{s.blurb}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium tracking-[0.12em] uppercase text-ink/50">Thread color</label>
              <Swatches colors={THREAD_SWATCHES} value={threadColor} onChange={setThreadColor} />
            </div>
            <div>
              <label className="text-xs font-medium tracking-[0.12em] uppercase text-ink/50">Bead color</label>
              <Swatches colors={BEAD_SWATCHES} value={beadColor} onChange={setBeadColor} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium tracking-[0.12em] uppercase text-ink/50">Charm</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {CHARMS.map((c) => {
                const on = charm === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCharm(c.id)}
                    className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-sm transition ${
                      on
                        ? "border-lacquer/25 bg-white text-ink ring-1 ring-lacquer/20 shadow-sm"
                        : "border-ink/10 bg-white/70 text-ink/70 hover:border-lacquer/20"
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
              <label className="text-xs font-medium tracking-[0.12em] uppercase text-ink/50" htmlFor="initial">
                Initial
              </label>
              <input
                id="initial"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 1))}
                maxLength={1}
                className="block mt-2 w-16 rounded-full border border-ink/15 px-3 py-2 text-center bg-white focus:outline-none focus:ring-2 focus:ring-lacquer/30"
              />
            </div>
          )}


          <div>
            <label className="text-xs font-medium tracking-[0.12em] uppercase text-ink/50">Song (optional</label>
            <p className="text-xs text-ink/45 mt-0.5">
              Paste a Spotify link, or attach an audio file. Plays when they open the gift.
            </p>
            <div className="mt-2 flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={spotifyInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSpotifyInput(value);
                    const embed = toSpotifyEmbedUrl(value);
                    if (embed) {
                      setSpotifyEmbedUrl(embed);
                      setSongName(null);
                      setSongDataUrl(null);
                      setError(null);
                    } else if (value.trim()) {
                      setSpotifyEmbedUrl(null);
                    } else {
                      setSpotifyEmbedUrl(null);
                    }
                  }}
                  onBlur={() => {
                    if (spotifyInput.trim() && !toSpotifyEmbedUrl(spotifyInput)) {
                      setError("That does not look like a Spotify song link.");
                    }
                  }}
                  className="flex-1 min-w-0 rounded-full border border-ink/15 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-lacquer/30"
                  aria-label="Spotify song link"
                />
                {spotifyEmbedUrl && (
                  <button
                    type="button"
                    aria-label="Clear Spotify link"
                    onClick={() => {
                      setSpotifyInput("");
                      setSpotifyEmbedUrl(null);
                    }}
                    className="shrink-0 rounded-full border border-ink/10 text-ink/50 px-3 hover:text-lacquer"
                  >
                    ×
                  </button>
                )}
              </div>
              {spotifyEmbedUrl && (
                <p className="text-xs text-lacquer">Spotify track ready</p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={songInput}
                  type="file"
                  accept="audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    if (file.size > MAX_SONG_BYTES) {
                      setError("Song is too large. Keep it under 2.5 MB.");
                      return;
                    }
                    try {
                      const dataUrl = await fileToDataUrl(file);
                      setSongName(file.name);
                      setSongDataUrl(dataUrl);
                      setSpotifyInput("");
                      setSpotifyEmbedUrl(null);
                      setError(null);
                    } catch {
                      setError("Couldn't read that audio file.");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => songInput.current?.click()}
                  className="rounded-full border border-lacquer/30 text-lacquer text-sm px-4 py-2 hover:bg-lacquer-soft"
                >
                  {songName ? "Change file" : "Or attach a file"}
                </button>
                {songName && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-lacquer-soft text-ink text-sm px-3 py-1.5 max-w-full">
                    <span className="truncate max-w-[12rem]">{songName}</span>
                    <button
                      type="button"
                      aria-label="Remove song file"
                      onClick={() => {
                        setSongName(null);
                        setSongDataUrl(null);
                      }}
                      className="text-lacquer font-semibold leading-none"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium tracking-[0.12em] uppercase text-ink/50" htmlFor="message">
              Message
            </label>
            <div className="relative mt-2">
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                rows={3}
                placeholder="Happy Rakhi, bhai."
                className="block w-full rounded-[1.25rem] border border-ink/15 px-4 py-3 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-lacquer/30"
              />
              <span className="absolute bottom-2.5 right-4 text-[11px] text-ink/35">
                {message.length} / 200
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium tracking-[0.12em] uppercase text-ink/50">
              Your UPI ID (optional)
            </label>
            <p className="text-xs text-ink/45 mt-0.5">
              Add your UPI so your bhai can send shagun when they accept. E.g. <span className="font-mono">name@upi</span> or a phone number.
            </p>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value.trim())}
              placeholder="name@upi or 9876543210"
              className="block mt-2 w-full rounded-full border border-ink/15 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-lacquer/30"
            />
          </div>

          {error && <p className="text-sm text-lacquer">{error}</p>}

          <div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={submitting}
              className="btn-pill w-full"
            >
              {submitting ? "Creating..." : "Generate link"}
            </button>

          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
