import Link from "next/link";
import type { Metadata } from "next";

const TITLE = "Can You Send a Rakhi Without Shipping?";
const DESCRIPTION =
  "Yes — design a 3D rakhi and send it as a digital gift-box link in minutes. No courier, no cutoff date, no risk of it arriving late for Raksha Bandhan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/send-rakhi-without-shipping" },
  openGraph: {
    title: `${TITLE} | Make Your Rakhi`,
    description: DESCRIPTION,
    url: "/send-rakhi-without-shipping",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: "2026-08-23",
  dateModified: "2026-08-23",
  author: { "@type": "Organization", name: "Make Your Rakhi" },
  publisher: { "@type": "Organization", name: "Make Your Rakhi" },
};

export default function SendRakhiWithoutShippingPage() {
  return (
    <div className="flex-1 flex flex-col bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="page-shell flex items-center justify-between py-5 h-16">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Make Your <span className="text-lacquer-bright">Rakhi</span>
        </Link>
        <Link href="/create" className="text-sm tracking-wide text-ink/60 link-underline hover:text-ink">
          Design your rakhi
        </Link>
      </header>

      <main className="page-shell flex-1 py-8 sm:py-14">
        <nav className="text-xs text-ink/45 mb-8">
          <Link href="/" className="hover:text-ink">Home</Link>
          {" / "}
          <span className="text-ink/70">Send a rakhi without shipping</span>
        </nav>

        <article className="max-w-2xl">
          <p className="text-xs tracking-[0.28em] uppercase text-lacquer-bright -ml-[0.14em] mb-4">
            Raksha Bandhan 2026
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight">{TITLE}</h1>
          <p className="mt-6 text-lg text-ink/70 leading-relaxed">
            Yes. You can design a 3D rakhi and send it as a personal gift-box link in under two
            minutes — no courier, no cutoff date, no tracking number to refresh at midnight.
          </p>

          <h2 className="font-display text-2xl sm:text-3xl mt-12 mb-4">The shipping problem, honestly</h2>
          <p className="text-ink/70 leading-relaxed">
            Every year it's the same scramble: courier cutoffs land days before Raksha Bandhan
            itself, express shipping to another country costs more than the rakhi, and there's
            always a chance it just doesn't arrive in time — stuck in transit while the day comes
            and goes. If your sibling lives abroad, add customs delays on top. None of that is
            really about the rakhi. It's about a delivery window that was never built for how far
            apart families actually are.
          </p>

          <h2 className="font-display text-2xl sm:text-3xl mt-12 mb-4">How sending a rakhi online actually works</h2>
          <p className="text-ink/70 leading-relaxed">
            You design a rakhi in a real 3D builder — thread colour, stones, charm — and it turns
            in your hands as you build it, the same way you'd turn a real one over to check the
            back. Add a short message, and the site generates one personal link, not a public post.
            You send that link on WhatsApp the way you'd send anything else.
          </p>
          <p className="mt-4 text-ink/70 leading-relaxed">
            When your sibling opens it, they don't just see a photo. A gift box floats on their
            screen, the lid lifts, your rakhi rises under a spotlight, and your message settles
            in underneath it. It's built to feel like a moment, not a message — because a
            screenshot of a rakhi design isn't the same as watching one appear for you specifically.
          </p>

          <h2 className="font-display text-2xl sm:text-3xl mt-12 mb-4">Does it work if my sibling lives abroad?</h2>
          <p className="text-ink/70 leading-relaxed">
            Yes — that's actually where this matters most. There's no shipping cost, no customs
            form, and no dependence on which country's courier network is faster this year. The
            link opens the same way on a phone in Bangalore or Boston.
          </p>

          <h2 className="font-display text-2xl sm:text-3xl mt-12 mb-4">Is it the same as a physical rakhi?</h2>
          <p className="text-ink/70 leading-relaxed">
            No, and it isn't trying to be. A physical rakhi tied on the wrist has its own weight
            that a screen can't replace. What this is for is the moment shipping can't guarantee —
            it means Raksha Bandhan doesn't slip past while a package is still in a warehouse
            somewhere. Nothing stops you from also sending a real one that arrives a few days
            later; the digital rakhi is what's there on the actual day.
          </p>

          <h2 className="font-display text-2xl sm:text-3xl mt-12 mb-4">What about the shagun, not just the rakhi?</h2>
          <p className="text-ink/70 leading-relaxed">
            You can add your UPI ID when you create your rakhi, and your sibling gets a one-tap
            option to send shagun the moment they accept it — so the gesture that usually needs
            cash in hand still works even when neither of you is in the same city.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link href="/create" className="btn-pill">
              Design your rakhi
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-lacquer/30 text-lacquer px-6 py-2.5 text-sm font-medium hover:bg-lacquer-soft"
            >
              Browse rakhi designs
            </Link>
          </div>
        </article>
      </main>

      <footer className="bg-plum text-cream-ink/60 border-t border-cream-ink/10 mt-16">
        <div className="page-shell py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl">
            Make Your <span className="text-lacquer-bright">Rakhi</span>
          </span>
          <Link href="/create" className="text-sm link-underline hover:text-cream-ink">
            Design your rakhi
          </Link>
        </div>
      </footer>
    </div>
  );
}
