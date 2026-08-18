import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rakhi Online — Design Your Own 3D Rakhi for Raksha Bandhan 2026",
  description:
    "Send rakhi online in minutes. Pick a style, thread colour, stones and charm, then share your 3D rakhi as an instant gift-box link — no shipping needed, works for siblings abroad too.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    title: "Rakhi Online — Design Your Own 3D Rakhi | Make Your Rakhi",
    description:
      "Send rakhi online in minutes — design your 3D rakhi and share it as an instant gift-box link.",
    url: "/create",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
