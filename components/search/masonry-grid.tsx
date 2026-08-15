"use client";

import { motion } from "framer-motion";
import { Bookmark, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatCount } from "@/lib/utils";
import type { Outfit } from "@/types";

interface MasonryGridProps {
  outfits: Outfit[];
}

export function MasonryGrid({ outfits }: MasonryGridProps) {
  return (
    <div className="columns-2 gap-3 px-4 pb-28 [column-fill:_balance]">
      {outfits.map((outfit, index) => (
        <motion.article
          key={outfit.id}
          className="surface mb-3 break-inside-avoid overflow-hidden rounded-[1.55rem]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.22) }}
          whileHover={{ y: -3 }}
        >
          <Link href={`/outfit/${outfit.id}`} className="block">
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
                className="image-polish h-full w-full object-cover"
                loading={index < 3 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5" />
            </div>
            <div className="space-y-2 p-3">
              <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                {outfit.title}
              </h3>
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
