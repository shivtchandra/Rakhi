import Link from "next/link";

type IntentLandingProps = {
  title: string;
  intro: string;
  recipient: "brother" | "sister";
  questions: { question: string; answer: string }[];
};

export default function IntentLanding({ title, intro, recipient, questions }: IntentLandingProps) {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="flex-1 bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <section className="relative min-h-[78dvh] overflow-hidden bg-plum text-cream-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-festival.png" alt="A sister and brother celebrating Raksha Bandhan together" className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-plum via-plum/80 to-transparent" />
        <div className="page-shell relative flex min-h-[78dvh] flex-col py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="font-display text-2xl">Make Your <span className="text-lacquer-bright">Rakhi</span></Link>
            <Link href="/r/demo" className="text-sm text-cream-ink/80 underline underline-offset-4">Open demo</Link>
          </nav>
          <div className="my-auto max-w-2xl py-16">
            <h1 className="font-display text-4xl leading-[1.08] sm:text-6xl">{title}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-ink/80 sm:text-lg">{intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/create?recipient=${recipient}&source=seo_landing`} className="btn-pill">Make one now</Link>
              <Link href="/r/demo" className="inline-flex items-center justify-center rounded-full border border-cream-ink/30 bg-plum/30 px-6 py-3 text-sm font-medium text-cream-ink backdrop-blur-sm">Open demo surprise</Link>
            </div>
            <p className="mt-4 text-sm text-cream-ink/65">Free. No signup. Opens on any phone.</p>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-28">
        <h2 className="font-display text-4xl sm:text-5xl">A personal Rakhi, sent in minutes.</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-[1.25fr_1fr]">
          <div className="rounded-[2rem] bg-plum p-8 text-cream-ink sm:p-10">
            <p className="font-display text-3xl">They do not just read it. They open it.</p>
            <p className="mt-4 max-w-lg leading-relaxed text-cream-ink/70">Choose a 3D Rakhi, write your message, and share one link on WhatsApp. A gift box opens before the Rakhi and your words appear.</p>
          </div>
          <ol className="space-y-6 pt-2">
            <li><strong className="block font-display text-2xl">Choose</strong><span className="text-ink/60">Pick a finished design or personalize it.</span></li>
            <li><strong className="block font-display text-2xl">Write</strong><span className="text-ink/60">Start from a message or use your own words.</span></li>
            <li><strong className="block font-display text-2xl">Send</strong><span className="text-ink/60">Share the personal gift link on WhatsApp.</span></li>
          </ol>
        </div>
      </section>

      <section className="bg-paper-2 py-20 sm:py-24">
        <div className="page-shell max-w-3xl">
          <h2 className="font-display text-4xl">Questions, answered.</h2>
          <div className="mt-10 border-t border-ink/10">{questions.map((item) => <article key={item.question} className="border-b border-ink/10 py-6"><h3 className="font-display text-2xl">{item.question}</h3><p className="mt-2 leading-relaxed text-ink/65">{item.answer}</p></article>)}</div>
          <Link href={`/create?recipient=${recipient}&source=seo_landing_bottom`} className="btn-pill mt-10">Make their Rakhi</Link>
        </div>
      </section>
    </main>
  );
}
