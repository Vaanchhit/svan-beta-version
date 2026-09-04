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
    <div className="grid grid-cols-3 gap-1 px-1 pb-28 pt-5 md:grid-cols-4 md:gap-3 md:px-8 lg:grid-cols-5">
      {outfits.map((outfit, index) => (
        <motion.div
          key={outfit.id}
          className={index % 7 === 0 ? "md:col-span-2 md:row-span-2" : ""}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.18) }}
        >
          <Link
            href={`/outfit/${outfit.id}`}
            data-cursor="View"
            className="soft-edge group fashion-focus relative block aspect-[3/4] overflow-hidden bg-white/10 md:rounded-[0.85rem]"
          >
            <img
              src={outfit.image}
              alt={outfit.imageAlt}
              className="image-polish h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
              loading={index < 6 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-2 bottom-2 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="line-clamp-2 text-xs font-semibold leading-4 text-white">
                {outfit.title}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
