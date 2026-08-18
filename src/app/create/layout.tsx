import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Your Rakhi Online — 3D Rakhi Maker",
  description:
    "Pick a style, thread colour, stones and charm, then send your 3D rakhi as an instant digital gift-box link — no shipping needed, works for siblings abroad too.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    title: "Design Your Rakhi Online — 3D Rakhi Maker | Make Your Rakhi",
    description:
      "Pick a style, thread colour, stones and charm, then send your 3D rakhi as an instant digital gift-box link.",
    url: "/create",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
