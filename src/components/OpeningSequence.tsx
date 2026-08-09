"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RakhiSVG from "./RakhiSVG";
import type { RakhiConfig } from "@/lib/rakhi";

type Stage = "landing" | "opening" | "revealed";

export default function OpeningSequence({ rakhi }: { rakhi: RakhiConfig }) {
  const [stage, setStage] = useState<Stage>("landing");

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-rose-950 via-rose-900 to-amber-900 text-center overflow-hidden relative min-h-screen">
      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-amber-100 text-lg">
              {rakhi.name ? `${rakhi.name}, you` : "You"} received a Rakhi 🎁
            </p>
            <motion.button
              onClick={() => {
                setStage("opening");
                setTimeout(() => setStage("revealed"), 1600);
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-40 h-40 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-600 shadow-2xl flex items-center justify-center text-white font-medium"
            >
              Tap to open
            </motion.button>
          </motion.div>
        )}

        {stage === "opening" && (
          <motion.div key="opening" className="relative w-40 h-40">
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -110 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-amber-400 to-rose-600 rounded-t-2xl z-10"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-br from-amber-500 to-rose-700 rounded-b-2xl" />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.6 }}
              animate={{ y: -60, opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <RakhiSVG {...rakhiProps(rakhi)} className="w-28 h-28 drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        )}

        {stage === "revealed" && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 max-w-md"
          >
            <motion.div
              animate={{ rotate: [0, -3, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <RakhiSVG {...rakhiProps(rakhi)} className="w-40 h-40 drop-shadow-2xl" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-amber-50 text-xl leading-relaxed"
            >
              {rakhi.message}
            </motion.p>
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              href="/create"
              className="rounded-full bg-white text-rose-800 px-6 py-2 text-sm font-medium hover:bg-amber-50"
            >
              Send one back
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function rakhiProps(rakhi: RakhiConfig) {
  return {
    style: rakhi.style,
    threadColor: rakhi.threadColor,
    beadColor: rakhi.beadColor,
    charm: rakhi.charm,
    initial: rakhi.name,
  };
}
