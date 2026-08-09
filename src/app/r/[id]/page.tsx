"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OpeningSequence from "@/components/OpeningSequence";
import { getRakhi, type RakhiConfig } from "@/lib/rakhi";

export default function ReceivePage() {
  const params = useParams<{ id: string }>();
  const [rakhi, setRakhi] = useState<RakhiConfig | null | undefined>(undefined);

  useEffect(() => {
    getRakhi(params.id).then(setRakhi);
  }, [params.id]);

  if (rakhi === undefined) {
    return (
      <main className="flex-1 flex items-center justify-center bg-rose-950">
        <p className="text-amber-100">Loading your rakhi…</p>
      </main>
    );
  }

  if (rakhi === null) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 bg-rose-950 text-center px-6">
        <p className="text-amber-100">This rakhi link doesn&apos;t exist.</p>
        <Link href="/create" className="text-amber-300 underline">
          Create your own
        </Link>
      </main>
    );
  }

  return <OpeningSequence rakhi={rakhi} />;
}
