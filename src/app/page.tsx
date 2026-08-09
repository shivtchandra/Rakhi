import Link from "next/link";
import RakhiSVG from "@/components/RakhiSVG";
import { DEFAULT_THREAD_COLOR, DEFAULT_BEAD_COLOR } from "@/data/styles";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-16 bg-gradient-to-b from-amber-50 to-rose-50 text-center">
      <RakhiSVG
        style="premium"
        threadColor={DEFAULT_THREAD_COLOR}
        beadColor={DEFAULT_BEAD_COLOR}
        charm="om"
        className="w-40 h-40"
      />
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold text-rose-900">
          Not just a message. A moment.
        </h1>
        <p className="text-rose-700/80 max-w-md mx-auto">
          Design a rakhi, add your message, and send a cinematic unboxing
          experience your sibling opens on their phone.
        </p>
      </div>
      <Link
        href="/create"
        className="rounded-full bg-rose-700 text-white px-8 py-3 font-medium hover:bg-rose-800 transition-colors"
      >
        Create your Rakhi
      </Link>
    </main>
  );
}
