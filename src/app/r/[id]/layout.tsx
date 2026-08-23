import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Rakhi surprise is waiting",
  description: "Someone made you a personal Rakhi gift. Tap to open it on your phone.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Someone made you a Rakhi surprise",
    description: "Tap to open your personal gift box.",
    type: "website",
  },
};

export default function GiftLayout({ children }: { children: React.ReactNode }) {
  return children;
}
