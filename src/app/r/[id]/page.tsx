"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getRakhi, type RakhiConfig } from "@/lib/rakhi";

const GiftBoxReveal = dynamic(() => import("@/components/three/GiftBoxReveal"), {
  ssr: false,
  loading: () => (
    <main className="flex-1 flex items-center justify-center bg-[#160a16]">
      <p className="text-amber-100">Preparing your gift…</p>
    </main>
  ),
});

// Dev-only hard-coded config so the reveal can be tested without Firebase keys.
const DEMO: RakhiConfig = {
  id: "demo",
  style: "traditional",
  threadColor: "#C0392B",
  beadColor: "#F4C430",
  charm: "om",
  name: "Bhai",
  message: "Happy Raksha Bandhan! No matter the distance, you're always my safest place. ❤️",
};

export default function ReceivePage() {
  const params = useParams<{ id: string }>();
  const [rakhi, setRakhi] = useState<RakhiConfig | null | undefined>(undefined);

  useEffect(() => {
    if (params.id === "demo") {
      setRakhi(DEMO);
      return;
    }
    getRakhi(params.id).then(setRakhi);
  }, [params.id]);

  if (rakhi === undefined) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#160a16]">
        <p className="text-amber-100">Loading your rakhi…</p>
      </main>
    );
  }

  if (rakhi === null) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#160a16] text-center px-6">
        <p className="text-amber-100">This rakhi link doesn&apos;t exist.</p>
        <Link href="/create" className="text-amber-300 underline">
          Create your own
        </Link>
      </main>
    );
  }

  return <GiftBoxReveal rakhi={rakhi} />;
}
