import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design & Make Your Own Rakhi Online — 3D Rakhi Maker for Raksha Bandhan 2026",
  description:
    "Design and make your own rakhi online in minutes. Pick a style, thread colour, stones and charm, then share your 3D rakhi as an instant gift-box link — no shipping needed, works for siblings abroad too.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    title: "Design & Make Your Own Rakhi Online | Make Your Rakhi",
    description:
      "Design and make your own rakhi online — a 3D rakhi you share as an instant gift-box link.",
    url: "/create",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
