"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import RakhiSVG from "@/components/RakhiSVG";
import Reveal from "@/components/Reveal";
import { STYLES, type RakhiStyle } from "@/data/styles";

const RakhiScene = dynamic(() => import("@/components/three/RakhiScene"), { ssr: false });

const STEPS = [
  { n: "01", title: "Design", body: "Shape a kundan rakhi in 3D — thread, stones, charm, colour. It turns as you build." },
  { n: "02", title: "Send", body: "Add a message and generate one private link. Share it on WhatsApp in seconds." },
  { n: "03", title: "They open", body: "A gift box floats on their screen. One tap, and it opens into a moment." },
];

const STYLE_SUB: Record<RakhiStyle, string> = {
  traditional: "Kundan flower, red enamel",
  minimal: "One clean line",
  cute: "Playful bead bloom",
  premium: "Gilded, dense stonework",
};

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl tracking-tight ${className}`}>
      Rakhi<span className="text-gold">Box</span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex-1 bg-cream text-ink">
      {/* ---- HERO (painterly festival + live 3D inset) ---- */}
      <section className="relative bg-plum text-cream-ink overflow-hidden min-h-[94vh] flex flex-col">
        {/* full-bleed painterly art */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-festival.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        {/* scrims for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-plum via-plum/85 to-plum/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum via-transparent to-plum/50" />

        <nav className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-6">
          <Wordmark className="text-cream-ink" />
          <Link
            href="/create"
            className="text-sm tracking-wide text-cream-ink/80 gold-underline hover:text-cream-ink"
          >
            Design yours
          </Link>
        </nav>

        <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 flex items-center">
          <div className="max-w-2xl py-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-6">Raksha Bandhan</p>
            <div className="hero-rise font-display leading-[0.95] text-[13vw] sm:text-6xl lg:text-7xl">
              {["Not just", "a message.", "A moment."].map((l, i) => (
                <div key={i} className="overflow-hidden">
                  <div className={`line-inner ${i === 2 ? "italic text-gold-bright" : ""}`}>{l}</div>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-md text-cream-ink/80 leading-relaxed">
              Design a rakhi in 3D and send a cinematic gift-box link your sibling opens on
              their phone — the thread they can almost feel across any distance.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/create"
                className="inline-block rounded-full bg-gold text-plum font-medium px-8 py-3.5 shadow-[0_6px_0_0_#8a6f2f] hover:translate-y-[3px] hover:shadow-[0_3px_0_0_#8a6f2f] active:translate-y-[6px] active:shadow-none transition-all"
              >
                Design your rakhi
              </Link>
              <span className="text-sm text-cream-ink/60">No sign-up. One link.</span>
            </div>
          </div>
        </div>

        {/* live 3D inset — floating card, desktop only (perf) */}
        <div className="hidden lg:block absolute z-10 bottom-10 right-8 w-[300px] h-[330px] rounded-2xl overflow-hidden ring-1 ring-gold/30 shadow-2xl bg-gradient-to-b from-plum-2 to-plum">
          <div className="absolute inset-0">
            <RakhiScene style="premium" threadColor="#7E2432" beadColor="#E4C878" charm="om" />
          </div>
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-plum/70 text-cream-ink text-[10px] font-semibold tracking-wide px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-bright" />
            3D LIVE PREVIEW
          </span>
        </div>

        <div className="relative z-10 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="max-w-6xl mx-auto w-full px-6 py-20 sm:py-28">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">How it works</p>
          <h2 className="font-display text-4xl sm:text-5xl max-w-xl leading-tight">
            Three steps, and the distance disappears.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-3 gap-px bg-ink/10">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 120} className="bg-cream">
              <div className="px-2 md:px-8 py-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-2xl text-gold">{s.n}</span>
                  <span className="h-px flex-1 bg-ink/15" />
                </div>
                <h3 className="font-display text-2xl mt-4">{s.title}</h3>
                <p className="mt-3 text-ink/70 leading-relaxed text-[15px]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- IMMERSIVE FESTIVAL BAND ---- */}
      <section className="relative overflow-hidden border-y border-ink/10">
        <div className="relative h-[58vh] min-h-[400px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/rakhi-street.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum/90 via-plum/15 to-transparent" />
          <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex items-end pb-12">
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-gold-bright mb-2 drop-shadow">Raksha Bandhan</p>
              <h2 className="font-display text-4xl sm:text-5xl text-cream-ink max-w-xl leading-tight drop-shadow-lg">
                A whole city, tying the same knot.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- FOUR STYLES ---- */}
      <section className="bg-cream-2/60 border-y border-ink/10">
        <div className="max-w-6xl mx-auto w-full px-6 py-20 sm:py-28">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The rakhis</p>
            <h2 className="font-display text-4xl sm:text-5xl max-w-xl leading-tight">
              Four characters. Yours to shape.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STYLES.map((s, i) => (
              <Reveal key={s.id} delay={i * 100}>
                <div className="group text-center">
                  <div className="rounded-2xl bg-gradient-to-b from-white to-cream-2 border border-ink/5 p-6 shadow-sm transition-transform group-hover:-translate-y-1">
                    <RakhiSVG
                      style={s.id}
                      threadColor="#7E2432"
                      beadColor="#C4A052"
                      charm={(["om", "heart", "initial", "gem"] as const)[i]}
                      initial="R"
                      className="w-full h-36"
                    />
                  </div>
                  <h3 className="font-display text-xl mt-4">{s.label}</h3>
                  <p className="text-sm text-ink/55">{STYLE_SUB[s.id]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- THE MOMENT (dark band) ---- */}
      <section className="bg-plum text-cream-ink">
        <div className="max-w-4xl mx-auto w-full px-6 py-24 sm:py-32 text-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-6">The unboxing</p>
            <h2 className="font-display text-4xl sm:text-6xl leading-tight">
              They don&apos;t read it. <span className="italic text-gold-bright">They open it.</span>
            </h2>
            <p className="mt-8 max-w-xl mx-auto text-cream-ink/70 leading-relaxed">
              A gift box floats in the dark. One tap — the lid lifts, the rakhi rises and turns
              under a spotlight, and your message settles in. Slow, cinematic, made to be
              replayed.
            </p>
            <Link
              href="/create"
              className="mt-10 inline-block rounded-full bg-gold text-plum font-medium px-8 py-3.5 shadow-[0_6px_0_0_#8a6f2f] hover:translate-y-[3px] hover:shadow-[0_3px_0_0_#8a6f2f] active:translate-y-[6px] active:shadow-none transition-all"
            >
              Make one now
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="bg-plum text-cream-ink/60 border-t border-cream-ink/10">
        <div className="max-w-6xl mx-auto w-full px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Wordmark className="text-cream-ink" />
          <p className="text-sm italic font-display text-cream-ink/70">Not just a message. A moment.</p>
          <Link href="/create" className="text-sm gold-underline hover:text-cream-ink">
            Design yours
          </Link>
        </div>
      </footer>
    </div>
  );
}
