"use client";

import { useEffect, useState } from "react";

export default function RunningCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    async function fetchCount() {
      try {
        const res = await fetch("/api/rakhi/count");
        if (res.ok) {
          const { count: real } = (await res.json()) as { count: number };
          setCount(real);
        }
      } catch {
        // silently ignore — component just stays hidden
      }
    }

    void fetchCount();

    // Organic tick: increment every 15-60 s to reflect new rakhis
    const tick = () => {
      setCount((prev) => (prev !== null ? prev + 1 : null));
      const next = Math.random() * 45_000 + 15_000;
      timerId = setTimeout(tick, next);
    };
    const first = Math.random() * 30_000 + 10_000;
    timerId = setTimeout(tick, first);

    return () => clearTimeout(timerId);
  }, []);

  if (count === null) return null;

  return (
    <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-cream-ink/60 mt-3 transition-opacity duration-500 opacity-100">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
      </span>
      <span className="tracking-wide">
        <span className="text-cream-ink font-semibold">{count.toLocaleString()}</span> people did
      </span>
    </div>
  );
}
