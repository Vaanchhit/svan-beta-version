"use client";

import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";

export function ReelsComingSoon() {
  return (
    <section className="flex min-h-dvh items-center justify-center px-8 pb-24">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-glow"
          animate={{ y: [0, -10, 0], rotate: [0, -2, 0, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Clapperboard className="h-10 w-10 text-forest-light" />
        </motion.div>
        <motion.h1
          className="mt-7 text-3xl font-semibold text-white"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          Coming Soon
        </motion.h1>
      </motion.div>
    </section>
  );
}
