"use client";

import { motion } from "framer-motion";
import { OutfitCard } from "@/components/feed/outfit-card";
import { FeedLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useFeed } from "@/hooks/use-feed";

export function HomeFeed() {
  const { outfits, isLoading, error } = useFeed();

  if (isLoading) return <FeedLoadingSkeleton />;

  if (error) {
    return (
      <div className="px-5 py-16 text-center text-sm text-white/50">
        {error}
      </div>
    );
  }

  const leadOutfit = outfits[0];

  return (
    <section className="snap-y snap-mandatory pb-6">
      {leadOutfit ? (
        <motion.header
          className="px-4 pb-3 pt-6 md:px-8 md:pb-4 md:pt-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div>
              <p className="label-editorial editorial-rule pl-16 text-white/45">
                Today on SVAN
              </p>
              <h1 className="display-editorial mt-4 max-w-3xl text-6xl leading-[0.86] text-white md:text-8xl">
                Wear the mood before it trends.
              </h1>
            </div>
            <div className="hidden border-l border-white/10 pl-5 md:block">
              <p className="text-sm leading-6 text-white/62">
                Community looks, saved pieces, creator identities, and wardrobe
                inspiration in one living fashion graph.
              </p>
              <div className="mt-4 flex gap-2">
                {leadOutfit.palette.slice(0, 5).map((color) => (
                  <span
                    key={color}
                    className="h-8 flex-1 rounded-[0.3rem] border border-white/15 bg-white/10"
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.header>
      ) : null}
      {outfits.map((outfit, index) => (
        <div key={outfit.id} className="snap-start">
          <OutfitCard outfit={outfit} priority={index === 0} />
        </div>
      ))}
    </section>
  );
}
