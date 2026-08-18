"use client";

import Link from "next/link";
import RakhiSVG from "@/components/RakhiSVG";
import Reveal from "@/components/Reveal";
import { STYLES, type RakhiStyle } from "@/data/styles";
import RunningCount from "@/components/RunningCount";

const STEPS = [
  {
    n: "01",
    title: "Design",
    body: "Shape a kundan rakhi in 3D: thread, stones, charm, colour. It turns as you build.",
  },
  {
    n: "02",
    title: "Send",
    body: "Add a message and generate one private link. Share it on WhatsApp in seconds.",
  },
  {
    n: "03",
    title: "They open",
    body: "A gift box floats on their screen. One tap, and it opens into a moment.",
  },
];

const STYLE_SUB: Record<RakhiStyle, string> = {
  traditional: "Kundan flower, red enamel",
  minimal: "One clean line",
  cute: "Playful bead bloom",
  premium: "Gilded, dense stonework",
  festive: "Dense petals, lacquer glow",
  silk: "Soft thread fringe, green centerpiece",
  rudraksha: "Sacred beads, copper accents",
  silver: "Modern silver, blue enamel backing",
  royal: "Majestic gold, dense outer petals",
};

const CHARMS = ["om", "heart", "initial", "gem", "om", "heart", "initial", "gem", "om"] as const;

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl tracking-tight ${className}`}>
      Rakhi<span className="text-lacquer-bright">Box</span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex-1 bg-paper text-ink">
      {/* 1. HERO - full-bleed image */}
      <section className="relative bg-plum text-cream-ink overflow-hidden min-h-[100dvh] flex flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-festival.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-[78%_65%] sm:object-[56%_center] scale-110 origin-center brightness-100 sm:brightness-90"
        />
        {/* Soft left vignette only — smooth fade, no hard edge over the figures */}
        <div
          className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(18,16,20,0.6)_0%,rgba(18,16,20,0.25)_38%,rgba(18,16,20,0.55)_70%,rgba(18,16,20,0.85)_100%)] sm:bg-[linear-gradient(90deg,rgba(18,16,20,0.82)_0%,rgba(18,16,20,0.45)_14%,rgba(18,16,20,0.08)_28%,transparent_36%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(18,16,20,0.28)_0%,transparent_20%)]"
          aria-hidden
        />

        <div className="relative z-10 page-shell flex flex-col flex-1 min-h-0">
          <nav className="hero-shadow flex items-center justify-between py-5 h-16 shrink-0">
            <Wordmark className="text-cream-ink" />
            <Link
              href="/create"
              className="text-sm tracking-wide text-cream-ink/85 link-underline hover:text-cream-ink"
            >
              Design your rakhi
            </Link>
          </nav>

          <div className="flex-1 flex items-center pt-4 pb-16">
            <div className="max-w-xl flex flex-col items-start text-left hero-shadow">
              <p className="text-[10px] sm:text-xs tracking-[0.24em] sm:tracking-[0.28em] uppercase text-lacquer-bright mb-4 sm:mb-5 -ml-[0.14em]">
                Raksha Bandhan
              </p>
              <div className="hero-rise font-display leading-[1.05] sm:leading-[1.1] text-[2.1rem] min-[380px]:text-[2.5rem] sm:text-6xl lg:text-7xl pb-1 w-full">
                {["Not just a message.", "A moment."].map((l, i) => (
                  <div key={l} className="overflow-hidden">
                    <div className={`line-inner ${i === 1 ? "italic text-lacquer-bright" : ""}`}>
                      {l}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 sm:mt-7 max-w-md text-cream-ink/80 leading-relaxed text-sm sm:text-base hidden sm:block">
                Design a rakhi in 3D and send a gift-box link your sibling opens on their phone.
              </p>
              <div className="mt-7 sm:mt-9 flex flex-col items-start gap-1">
                <Link href="/create" className="btn-pill">
                  Design your rakhi
                </Link>
                <RunningCount />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS - vertical numbered list */}
      <section className="page-shell py-20 sm:py-28">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl max-w-xl leading-tight">
            Three steps, and the distance disappears.
          </h2>
        </Reveal>
        <ol className="mt-14 max-w-3xl border-b border-ink/10">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <li className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-8 border-t border-ink/10">
                <span className="font-display text-3xl text-lacquer leading-none pt-1">{s.n}</span>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 text-ink/65 leading-relaxed text-[15px] max-w-md">{s.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 3. FESTIVAL BAND - rounded banner card */}
      <section className="page-shell py-8 sm:py-12">
        <div className="relative h-[45vh] min-h-[320px] sm:h-[52vh] sm:min-h-[380px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-lg shadow-lacquer/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/rakhi-street.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-plum/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-plum/40 via-transparent to-transparent" />
          <div className="relative z-10 h-full flex items-end p-8 sm:p-12">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-5xl text-cream-ink max-w-xl leading-tight drop-shadow-md">
                A whole city, tying the same knot.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. STYLES */}
      <section className="bg-paper-2 py-20 sm:py-28">
        <div className="page-shell">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl max-w-xl leading-tight">
              Five styles. Yours to shape.
            </h2>
            <p className="mt-4 max-w-lg text-ink/60 text-[15px] leading-relaxed">
              Pick a starting point — thread, stones, and charm are all customisable in 3D.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {STYLES.map((s, i) => (
              <Reveal key={s.id} delay={i * 60} className="h-full">
                <Link
                  href="/create"
                  className="group soft-shell flex flex-col gap-4 p-6 h-full transition duration-200 hover:-translate-y-0.5 hover:border-lacquer/22 hover:shadow-[0_16px_48px_-20px_rgba(185,28,44,0.22)]"
                >
                  <div
                    className="w-[4.5rem] h-[4.5rem] grid place-items-center rounded-full bg-white border border-lacquer/10 shadow-[0_8px_24px_-12px_rgba(18,16,20,0.12)] transition group-hover:border-lacquer/20"
                  >
                    <RakhiSVG
                      style={s.id}
                      threadColor="#B91C2C"
                      beadColor="#E4C878"
                      charm={CHARMS[i]}
                      initial="R"
                      className="w-14 h-14"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl leading-tight">{s.label}</h3>
                    <p className="text-sm text-ink/55 mt-1.5 leading-relaxed">{STYLE_SUB[s.id]}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE MOMENT - dark cinematic */}
      <section className="bg-plum text-cream-ink">
        <div className="page-shell max-w-4xl py-24 sm:py-32 text-center">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-6xl leading-[1.12] pb-1">
              They don&apos;t read it.{" "}
              <span className="italic text-lacquer-bright">They open it.</span>
            </h2>
            <p className="mt-8 max-w-xl mx-auto text-cream-ink/70 leading-relaxed">
              A gift box floats in the dark. One tap, the lid lifts, the rakhi rises under a
              spotlight, and your message settles in.
            </p>
            <div className="flex flex-col items-center gap-1">
              <Link href="/create" className="btn-pill mt-10">
                Design your rakhi
              </Link>
              <RunningCount />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-plum text-cream-ink/60 border-t border-cream-ink/10">
        <div className="page-shell py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Wordmark className="text-cream-ink" />
          <p className="text-sm italic font-display text-cream-ink/70">
            Not just a message. A moment.
          </p>
          <Link href="/create" className="text-sm link-underline hover:text-cream-ink">
            Design your rakhi
          </Link>
        </div>
      </footer>
    </div>
  );
}
