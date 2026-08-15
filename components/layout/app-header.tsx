"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { aestheticCategories } from "@/lib/aesthetics";

export function AppHeader() {
  return (
    <header className="mobile-safe-top sticky top-0 z-20 bg-carbon/60 pb-3 backdrop-blur-2xl">
      <div className="flex items-center gap-3 pl-4">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="shrink-0"
        >
          <Link href="/" aria-label="SVAN home" className="glass flex h-11 w-11 items-center justify-center rounded-[1.15rem]">
            <Sparkles className="h-4 w-4 text-white" />
          </Link>
        </motion.div>

        <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto pr-4">
          {aestheticCategories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.025 }}
              whileTap={{ scale: 0.96 }}
              className="shrink-0"
            >
              <Link
                href={`/search?genre=${category.slug}`}
                className="surface flex h-11 items-center rounded-[1.05rem] px-4 text-sm font-semibold text-white/80 transition duration-300 hover:border-forest/50 hover:bg-white/10"
              >
                {category.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </header>
  );
}
