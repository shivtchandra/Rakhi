import type { Metadata } from "next";
import IntentLanding from "@/components/IntentLanding";

export const metadata: Metadata = {
  title: "Send a Long-Distance Rakhi Instantly - No Shipping",
  description: "Send a personalised digital Rakhi to a sibling in another city or country. Share the animated gift link instantly on WhatsApp.",
  alternates: { canonical: "/long-distance-rakhi" },
  openGraph: { title: "A Long-Distance Rakhi That Arrives Instantly", description: "Make a personal 3D Rakhi surprise and send it on WhatsApp.", url: "/long-distance-rakhi" },
};

const questions = [
  { question: "Can I send a Rakhi after courier cutoffs?", answer: "Yes. The digital gift arrives as soon as you send the WhatsApp link, so there is no delivery deadline." },
  { question: "Does it work internationally?", answer: "Yes. Your sibling can open the gift link from any country on a modern phone browser." },
  { question: "Is this a replacement for a physical Rakhi?", answer: "It can be the complete gesture or an instant personal surprise while a physical Rakhi is still in transit." },
];

export default function Page() {
  return <IntentLanding recipient="brother" title="Distance should not make your Rakhi feel generic." intro="Send a personal Rakhi gift box instantly to another city or country. It opens from one WhatsApp link." questions={questions} />;
}
