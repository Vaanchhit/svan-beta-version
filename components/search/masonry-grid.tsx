"use client";

import { motion } from "framer-motion";
import { Bookmark, CheckCircle2, Eye } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatCount } from "@/lib/utils";
import type { Outfit } from "@/types";

interface MasonryGridProps {
  outfits: Outfit[];
}

export function MasonryGrid({ outfits }: MasonryGridProps) {
  return (
    <div className="columns-2 gap-3 px-4 pb-28 [column-fill:_balance] md:columns-3 md:gap-4 md:px-8 lg:columns-4">
      {outfits.map((outfit, index) => (
        <motion.article
          key={outfit.id}
          className="group mb-3 break-inside-avoid overflow-hidden rounded-[1rem] border border-white/10 bg-white/[0.045] shadow-glass md:mb-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.22) }}
          whileHover={{ y: -3 }}
        >
          <Link href={`/outfit/${outfit.id}`} data-cursor="View" className="fashion-focus block">
            <div
              className={
                index % 3 === 0
                  ? "relative aspect-[3/4] bg-white/10"
                  : index % 3 === 1
                    ? "relative aspect-[4/5] bg-white/10"
                    : "relative aspect-[5/7] bg-white/10"
              }
            >
              <img
                src={outfit.image}
                alt={outfit.imageAlt}
                className="image-polish h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
                loading={index < 3 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/5 to-white/5 opacity-70 transition duration-300 group-hover:opacity-100" />
              <div className="absolute right-3 top-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full border border-white/15 bg-black/35 opacity-0 backdrop-blur-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="label-editorial text-white/58">{outfit.style}</p>
                <h3 className="display-editorial mt-1 text-3xl leading-[0.9] text-white">
                  {outfit.title}
                </h3>
              </div>
            </div>
            <div className="space-y-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar
                    src={outfit.creator.avatar}
                    alt={outfit.creator.displayName}
                    size="sm"
                  />
                  <span className="min-w-0 truncate text-xs font-medium text-white/60">
                    {outfit.creator.username}
                  </span>
                  {outfit.creator.verified ? (
                    <CheckCircle2 className="h-3 w-3 shrink-0 fill-forest text-white" />
                  ) : null}
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-white/50">
                  <Bookmark className="h-3.5 w-3.5" />
                  {formatCount(outfit.saveCount)}
                </span>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
