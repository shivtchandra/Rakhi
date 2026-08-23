import type { Metadata } from "next";
import IntentLanding from "@/components/IntentLanding";

export const metadata: Metadata = {
  title: "Free Digital Rakhi for Brother - Send on WhatsApp",
  description: "Make a personalised 3D Rakhi for your brother and send it as an instant WhatsApp gift link. Free, no signup, and no shipping needed.",
  alternates: { canonical: "/rakhi-for-brother" },
  openGraph: { title: "Send Your Brother a Rakhi Surprise", description: "A personalised Rakhi gift box he can open on any phone.", url: "/rakhi-for-brother" },
};

const questions = [
  { question: "Is the digital Rakhi free?", answer: "Yes. You can design, create and share the Rakhi link without paying or creating an account." },
  { question: "Does my brother need an app?", answer: "No. The gift opens in the browser from the WhatsApp link on any modern phone." },
  { question: "Can I add a personal message and song?", answer: "Yes. Add your own message and optionally include a Spotify song before sharing." },
];

export default function Page() {
  return <IntentLanding recipient="brother" title="Send your brother a Rakhi he gets to open." intro="Make a 3D Rakhi, add your message, and send the surprise on WhatsApp. No courier and no app required." questions={questions} />;
}

