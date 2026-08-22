import Link from "next/link";
import type { Metadata } from "next";
import { STYLES } from "@/data/styles";
import { GALLERY_COPY } from "./[style]/copy";

export const metadata: Metadata = {
  title: "Rakhi Designs — Browse Every Style",
  description:
    "Kundan, minimal, silver, gold, rudraksha and more — browse every rakhi design and build yours in 3D for Raksha Bandhan 2026.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Rakhi Designs — Browse Every Style | Make Your Rakhi",
    description:
      "Kundan, minimal, silver, gold, rudraksha and more — browse every rakhi design and build yours in 3D for Raksha Bandhan 2026.",
    url: "/gallery",
  },
};

export default function GalleryPage() {
  return (
    <div className="flex-1 flex flex-col bg-paper">
      <header className="page-shell flex items-center justify-between py-5 h-16">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Make Your <span className="text-lacquer-bright">Rakhi</span>
        </Link>
        <Link href="/create" className="text-sm tracking-wide text-ink/60 link-underline hover:text-ink">
          Design your rakhi
        </Link>
      </header>

      <main className="page-shell flex-1 py-8 sm:py-14">
        <p className="text-xs tracking-[0.28em] uppercase text-lacquer-bright -ml-[0.14em] mb-4">
          Rakhi Designs
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight max-w-2xl">
          Every rakhi design, ready to build in 3D.
        </h1>
        <p className="mt-4 text-ink/60 max-w-xl leading-relaxed">
          Nine styles, from a classic kundan flower to sterling silver — pick one to start, then
          change thread, stones and charm freely once you're in the builder.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {STYLES.map((s) => (
            <Link
              key={s.id}
              href={`/gallery/${s.id}`}
              className="group soft-shell flex flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-lacquer/22 hover:shadow-[0_16px_48px_-20px_rgba(185,28,44,0.22)]"
            >
              <div className="aspect-[4/3] bg-white grid place-items-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/gallery/${s.id}.png`}
                  alt={`${s.label} rakhi — ${s.blurb}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 p-6">
                <h2 className="font-display text-2xl leading-tight">{s.label}</h2>
                <p className="text-sm text-ink/55 mt-1.5 leading-relaxed">{s.blurb}</p>
                <p className="text-xs text-lacquer-bright mt-2 uppercase tracking-wide">
                  {GALLERY_COPY[s.id].keyword}
                </p>
              </div>
            </Link>
          ))}
        </div>
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
