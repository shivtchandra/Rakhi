import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design your Rakhi",
  description: "Pick a style, stones, thread colour and charm — your 3D rakhi turns as you build it.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    title: "Design your Rakhi | Make Your Rakhi",
    description: "Pick a style, stones, thread colour and charm — your 3D rakhi turns as you build it.",
    url: "/create",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
