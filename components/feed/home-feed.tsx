"use client";

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

  return (
    <section className="snap-y snap-mandatory">
      {outfits.map((outfit, index) => (
        <div key={outfit.id} className="snap-start">
          <OutfitCard outfit={outfit} priority={index === 0} />
        </div>
      ))}
    </section>
  );
}
