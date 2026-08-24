"use client";

import { useEffect } from "react";
import Link from "next/link";
import RakhiSVG from "@/components/RakhiSVG";
import Reveal from "@/components/Reveal";
import { STYLES, type RakhiStyle } from "@/data/styles";
import RunningCount from "@/components/RunningCount";
import ShareSiteButton from "@/components/ShareSiteButton";
import { trackFunnel } from "@/lib/analytics";

const STEPS = [
  {
    n: "01",
    title: "Design",
    body: "Shape a kundan rakhi in 3D: thread, stones, charm, colour. It turns as you build.",
  },
  {
    n: "02",
    title: "Send",
    body: "Add a message and generate one gift link. Share it on WhatsApp in seconds. No shipping required, and it works abroad too.",
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

const FAQS = [
  {
    q: "When is Raksha Bandhan 2026?",
    a: "Raksha Bandhan 2026 falls on Friday, 28 August 2026.",
  },
  {
    q: "Is sending a rakhi online free?",
    a: "Yes. Designing your 3D rakhi and sharing it as a gift-box link is completely free.",
  },
  {
    q: "Does this work for a sibling living abroad?",
    a: "Yes. There is no shipping involved. The link works the same whether your sibling is next door or overseas.",
  },
  {
    q: "What does my sibling actually receive?",
    a: "A gift link that opens as an animated reveal on their phone. The lid lifts, your 3D Rakhi rises, and your message appears.",
  },
  {
    q: "Can I still send a real shagun gift, not just the rakhi?",
    a: "Yes. You can add your UPI ID when creating your rakhi, and your sibling gets a one-tap option to send shagun once they accept it.",
  },
] as const;

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to send a rakhi online",
  description: "Design a 3D Rakhi and send it as a digital gift-box link for Raksha Bandhan. No shipping needed.",
  step: STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.body,
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl tracking-tight ${className}`}>
      Make Your <span className="text-lacquer-bright">Rakhi</span>
    </span>
  );
}

export default function Home() {
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get("utm_source") || "direct";
    trackFunnel("landing_view", { source });
  }, []);

  return (
    <div className="flex-1 bg-paper text-ink">
      {/* 1. HERO - full-bleed image */}
      <section className="relative bg-plum text-cream-ink overflow-hidden min-h-[100dvh] flex flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-festival.png"
          alt="Sister tying a rakhi on her brother's wrist for Raksha Bandhan, with a diya lit beside them"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
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

          <div className="flex-1 flex items-center pt-4 pb-10">
            <div className="max-w-xl flex flex-col items-start text-left hero-shadow">
              <p className="text-[10px] sm:text-xs tracking-[0.24em] sm:tracking-[0.28em] uppercase text-lacquer-bright mb-4 sm:mb-5 -ml-[0.14em]">
                Raksha Bandhan 2026 · Aug 28
              </p>
              <h1 className="hero-rise font-display leading-[1.08] text-[2.1rem] min-[380px]:text-[2.5rem] lg:text-[2.7rem] pb-1 w-full">
                <span className="block">Send a Rakhi surprise.</span>
                <span className="block italic text-lacquer-bright pb-1">WhatsApp it in 60 seconds.</span>
              </h1>
              <p className="mt-5 sm:mt-7 max-w-md text-cream-ink/80 leading-relaxed text-sm sm:text-base hidden sm:block">
                They tap your link, open a gift box, and discover the Rakhi and message you made for them.
              </p>
              <div className="mt-7 sm:mt-9 flex flex-col items-start gap-3">
                <div className="flex flex-wrap gap-3">
                  <Link href="/r/demo" onClick={() => trackFunnel("demo_opened", { source: "homepage" })} className="btn-pill">
                    Open demo surprise
                  </Link>
                  <Link href="/create?source=homepage" className="inline-flex items-center justify-center rounded-full border border-cream-ink/35 bg-plum/30 px-6 py-3 text-sm font-medium text-cream-ink backdrop-blur-sm transition hover:bg-cream-ink/10 active:scale-[0.98]">
                    Make one now
                  </Link>
                </div>
                <p className="text-xs text-cream-ink/70">Free. No signup. Opens on any phone.</p>
                <RunningCount />
                <ShareSiteButton className="text-cream-ink/60 hover:text-cream-ink mt-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEMO PREVIEW */}
      <section className="page-shell py-16 sm:py-24">
        <Reveal>
          <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_320px] md:gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-lacquer">The surprise they receive</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
                A small moment that feels close.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink/65">
                Your sibling opens the link, reveals the Rakhi, reads your message, and can wear it on their wrist for a photo.
              </p>
              <Link href="/r/demo" onClick={() => trackFunnel("demo_opened", { source: "homepage_demo_section" })} className="mt-7 inline-flex items-center text-sm font-medium text-lacquer link-underline">
                Open the full demo
              </Link>
            </div>
            <div className="mx-auto overflow-hidden rounded-[2rem] border border-ink/10 bg-plum shadow-xl shadow-plum/15" aria-label="Live preview of the Rakhi gift opening">
              <iframe src="/r/demo?preview=1" title="Rakhi gift opening preview" tabIndex={-1} className="pointer-events-none h-[568px] w-[320px]" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* 3. HOW IT WORKS - vertical numbered list */}
      <section className="page-shell py-20 sm:py-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
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
            alt="A festive street market decorated for Raksha Bandhan, stalls selling colourful rakhi and sweets"
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
              Nine styles. Yours to shape.
            </h2>
            <p className="mt-4 max-w-lg text-ink/60 text-[15px] leading-relaxed">
              Pick a starting point. Thread, stones, and charm are all customisable in 3D.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {STYLES.map((s, i) => (
              <Reveal key={s.id} delay={i * 60} className="h-full">
                <Link
                  href={`/gallery/${s.id}`}
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
            <p className="mt-3 text-cream-ink/45 text-sm">
              Ordering something to ship? Courier cutoffs are already tight. This arrives the
              moment you hit send.{" "}
              <Link href="/send-rakhi-without-shipping" className="underline underline-offset-2 hover:text-cream-ink/70">
                Here&apos;s how.
              </Link>
            </p>
            <div className="flex flex-col items-center gap-2">
              <Link href="/create" className="btn-pill mt-10">
                Design your rakhi
              </Link>
              <RunningCount />
              <ShareSiteButton className="text-cream-ink/60 hover:text-cream-ink" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5b. FAQ */}
      <section className="page-shell py-20 sm:py-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl max-w-xl leading-tight">
            Questions, answered.
          </h2>
        </Reveal>
        <div className="mt-12 max-w-2xl border-t border-ink/10">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="py-6 border-b border-ink/10">
                <h3 className="font-display text-xl sm:text-2xl">{f.q}</h3>
                <p className="mt-2 text-ink/65 leading-relaxed text-[15px]">{f.a}</p>
              </div>
            </Reveal>
          ))}
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
