import type { Metadata } from "next";
import IntentLanding from "@/components/IntentLanding";

export const metadata: Metadata = {
  title: "Free Digital Rakhi for Sister - Send on WhatsApp",
  description: "Make a personalised 3D Rakhi surprise for your sister and share it instantly on WhatsApp. Free, no signup, and opens on any phone.",
  alternates: { canonical: "/rakhi-for-sister" },
  openGraph: { title: "Send Your Sister a Rakhi Surprise", description: "A personalised Rakhi gift box she can open on any phone.", url: "/rakhi-for-sister" },
};

const questions = [
  { question: "Can I send this Rakhi to my sister?", answer: "Yes. Raksha Bandhan celebrates sibling bonds, and the creator supports brothers, sisters, cousins and chosen siblings." },
  { question: "Is an account required?", answer: "No. Choose a design, add a message and share the finished link without signing up." },
  { question: "Can she open it outside India?", answer: "Yes. The gift link works anywhere with a modern phone browser and internet connection." },
];

export default function Page() {
  return <IntentLanding recipient="sister" title="Send your sister a Rakhi surprise in 60 seconds." intro="Choose her Rakhi, write what she means to you, and share a gift box link that opens on her phone." questions={questions} />;
}

