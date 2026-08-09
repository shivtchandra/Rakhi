"use client";

import { useState } from "react";
import RakhiSVG from "@/components/RakhiSVG";
import { STYLES, CHARMS, DEFAULT_THREAD_COLOR, DEFAULT_BEAD_COLOR, type RakhiStyle, type Charm } from "@/data/styles";
import { createRakhi } from "@/lib/rakhi";

export default function CreatePage() {
  const [style, setStyle] = useState<RakhiStyle>("traditional");
  const [threadColor, setThreadColor] = useState(DEFAULT_THREAD_COLOR);
  const [beadColor, setBeadColor] = useState(DEFAULT_BEAD_COLOR);
  const [charm, setCharm] = useState<Charm>("om");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
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
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-16 text-center bg-gradient-to-b from-amber-50 to-rose-50">
        <h1 className="text-2xl font-semibold text-rose-900">Your Rakhi is ready 🎁</h1>
        <p className="text-rose-700/80">Share this link — it opens as a gift.</p>
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-rose-100">
          <code className="text-sm text-rose-800">{link}</code>
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="text-xs font-medium text-rose-700 hover:text-rose-900"
          >
            Copy
          </button>
        </div>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`I made you a rakhi online ❤️ ${link}`)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-green-600 text-white px-6 py-2 text-sm font-medium hover:bg-green-700"
        >
          Share on WhatsApp
        </a>
      </main>
    );
  }

  return (
    <main className="flex-1 grid md:grid-cols-2 gap-10 px-6 py-12 max-w-5xl mx-auto w-full">
      <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-amber-50 to-rose-50 rounded-2xl p-8 sticky top-8 self-start">
        <RakhiSVG style={style} threadColor={threadColor} beadColor={beadColor} charm={charm} initial={name} className="w-56 h-56" />
        <p className="text-sm text-rose-700/70">Live preview</p>
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-rose-900">Design your Rakhi</h1>

        <div>
          <label className="text-sm font-medium text-rose-900">Style</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`rounded-lg border px-3 py-2 text-sm text-left transition-colors ${
                  style === s.id ? "border-rose-600 bg-rose-50 text-rose-900" : "border-gray-200 text-gray-700"
                }`}
              >
                <div className="font-medium">{s.label}</div>
                <div className="text-xs text-gray-500">{s.blurb}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <div>
            <label className="text-sm font-medium text-rose-900">Thread color</label>
            <input type="color" value={threadColor} onChange={(e) => setThreadColor(e.target.value)} className="block mt-2 w-12 h-10 rounded cursor-pointer" />
          </div>
          <div>
            <label className="text-sm font-medium text-rose-900">Bead color</label>
            <input type="color" value={beadColor} onChange={(e) => setBeadColor(e.target.value)} className="block mt-2 w-12 h-10 rounded cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-rose-900">Charm</label>
          <div className="flex gap-2 mt-2">
            {CHARMS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCharm(c.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  charm === c.id ? "border-rose-600 bg-rose-50 text-rose-900" : "border-gray-200 text-gray-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {charm === "initial" && (
          <div>
            <label className="text-sm font-medium text-rose-900">Initial</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 1))}
              maxLength={1}
              className="block mt-2 w-16 rounded border border-gray-300 px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-rose-900">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Happy Rakhi bhai ❤️"
            className="block mt-2 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={submitting}
          className="rounded-full bg-rose-700 text-white px-8 py-3 font-medium hover:bg-rose-800 disabled:opacity-60 transition-colors"
        >
          {submitting ? "Creating…" : "Generate link"}
        </button>
      </div>
    </main>
  );
}
