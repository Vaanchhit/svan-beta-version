"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Outfit } from "@/types";

interface ProfileGridProps {
  outfits: Outfit[];
  emptyLabel?: string;
}

export function ProfileGrid({ outfits, emptyLabel = "No outfits yet." }: ProfileGridProps) {
  if (outfits.length === 0) {
    return (
      <div className="px-5 py-16 text-center text-sm text-white/50">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 px-1 pb-28 pt-5">
      {outfits.map((outfit, index) => (
        <motion.div
          key={outfit.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.18) }}
        >
          <Link
            href={`/outfit/${outfit.id}`}
          className="soft-edge block aspect-[3/4] overflow-hidden bg-white/10"
          >
            <img
              src={outfit.image}
              alt={outfit.imageAlt}
              className="image-polish h-full w-full object-cover"
              loading={index < 6 ? "eager" : "lazy"}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
