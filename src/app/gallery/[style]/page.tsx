import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STYLES } from "@/data/styles";
import { GALLERY_COPY } from "./copy";

export function generateStaticParams() {
  return STYLES.map((s) => ({ style: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>;
}): Promise<Metadata> {
  const { style: styleParam } = await params;
  const style = STYLES.find((s) => s.id === styleParam);
  if (!style) return {};
  const copy = GALLERY_COPY[style.id];
  return {
    title: copy.seoTitle,
    description: copy.description,
    alternates: { canonical: `/gallery/${style.id}` },
    openGraph: {
      title: `${copy.seoTitle} | Make Your Rakhi`,
      description: copy.description,
      url: `/gallery/${style.id}`,
    },
  };
}

export default async function GalleryStylePage({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style: styleParam } = await params;
  const style = STYLES.find((s) => s.id === styleParam);
  if (!style) notFound();
  const copy = GALLERY_COPY[style.id];

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <header className="page-shell flex items-center justify-between py-5 h-16">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Make Your <span className="text-lacquer-bright">Rakhi</span>
        </Link>
        <Link href="/gallery" className="text-sm tracking-wide text-ink/60 link-underline hover:text-ink">
          All designs
        </Link>
      </header>

      <main className="page-shell flex-1 py-8 sm:py-14">
        <nav className="text-xs text-ink/45 mb-8">
          <Link href="/" className="hover:text-ink">Home</Link>
          {" / "}
          <Link href="/gallery" className="hover:text-ink">Rakhi Designs</Link>
          {" / "}
          <span className="text-ink/70">{style.label}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="soft-shell aspect-square grid place-items-center p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/gallery/${style.id}.png`}
              alt={`${style.label} rakhi — ${style.blurb}, rendered in 3D`}
              className="w-full h-full max-w-sm object-contain drop-shadow-xl"
            />
          </div>

          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-lacquer-bright -ml-[0.14em] mb-4">
              {copy.keyword}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl leading-tight">{style.label}</h1>
            <p className="mt-3 text-ink/55">{style.blurb}</p>
            <p className="mt-6 text-ink/70 leading-relaxed max-w-md">{copy.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`/create?style=${style.id}`} className="btn-pill">
                Design this rakhi
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-lacquer/30 text-lacquer px-6 py-2.5 text-sm font-medium hover:bg-lacquer-soft"
              >
                See other designs
              </Link>
            </div>
          </div>
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
