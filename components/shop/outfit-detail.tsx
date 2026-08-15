"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Heart,
  MessageCircle,
  ShoppingBag
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductBottomSheet } from "@/components/shop/product-bottom-sheet";
import { FeedLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useOutfit } from "@/hooks/use-outfit";
import { formatCount } from "@/lib/utils";
import { swatchClass } from "@/lib/swatch-classes";
import { svanApi } from "@/services/svan-api";
import type { OutfitSegment } from "@/types";

interface OutfitDetailProps {
  id: string;
}

export function OutfitDetail({ id }: OutfitDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { outfit, isLoading, error } = useOutfit(id);
  const [activeSegment, setActiveSegment] = useState<OutfitSegment | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);

  useEffect(() => {
    if (!outfit) return;
    setLiked(Boolean(outfit.viewerLiked));
    setSaved(Boolean(outfit.viewerSaved));
    setLikeCount(outfit.likeCount);
    setSaveCount(outfit.saveCount);
  }, [outfit]);

  const toggle = async (type: "like" | "save") => {
    if (!outfit) return;
    if (!user) {
      router.push(`/account?next=/outfit/${outfit.id}`);
      return;
    }

    const previous = { liked, saved, likeCount, saveCount };
    if (type === "like") {
      setLiked((value) => !value);
      setLikeCount((value) => value + (liked ? -1 : 1));
    } else {
      setSaved((value) => !value);
      setSaveCount((value) => value + (saved ? -1 : 1));
    }

    try {
      const response = await svanApi.interaction({ outfitId: outfit.id, type });
      setLiked(response.liked);
      setSaved(response.saved);
      setLikeCount(response.likeCount);
      setSaveCount(response.saveCount);
    } catch {
      setLiked(previous.liked);
      setSaved(previous.saved);
      setLikeCount(previous.likeCount);
      setSaveCount(previous.saveCount);
      router.push(`/account?next=/outfit/${outfit.id}`);
    }
  };

  if (isLoading) return <FeedLoadingSkeleton />;

  if (error || !outfit) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
        <p className="text-lg font-semibold text-white">Outfit unavailable</p>
        <p className="mt-2 text-sm text-white/50">
          The look may have moved or the mock API could not find it.
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to feed
        </Button>
      </div>
    );
  }

  return (
    <>
      <section className="pb-7">
        <div className="relative">
          <motion.img
            src={outfit.image}
            alt={outfit.imageAlt}
            className="image-polish h-[62dvh] min-h-[31rem] w-full object-cover"
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 mobile-safe-top">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Back"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="surface rounded-full px-3 py-1.5 text-xs font-semibold text-white">
              Outfit ID {outfit.id}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon via-carbon/60 to-transparent p-5 pt-28">
            <div className="flex items-center gap-3">
              <Avatar
                src={outfit.creator.avatar}
                alt={outfit.creator.displayName}
                size="md"
              />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  {outfit.creator.username}
                  {outfit.creator.verified ? (
                    <CheckCircle2 className="h-3.5 w-3.5 fill-forest text-white" />
                  ) : null}
                </p>
                <p className="truncate text-xs text-white/50">{outfit.location}</p>
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white">
              {outfit.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/70">{outfit.caption}</p>
          </div>
        </div>

        <div className="px-5">
          <div className="surface mt-4 flex items-center justify-between rounded-[1.5rem] p-3">
            <div className="flex items-center gap-5 text-sm text-white/70">
              <button
                type="button"
                className="flex items-center gap-1.5 transition hover:text-white"
                onClick={() => toggle("like")}
              >
                <Heart className={liked ? "h-4 w-4 fill-red-500 text-red-500" : "h-4 w-4"} />
                {formatCount(likeCount)}
              </button>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                {formatCount(outfit.commentCount)}
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 transition hover:text-white"
                onClick={() => toggle("save")}
              >
                <Bookmark className={saved ? "h-4 w-4 fill-white text-white" : "h-4 w-4"} />
                {formatCount(saveCount)}
              </button>
            </div>
            <div className="flex -space-x-2">
              {outfit.palette.map((color) => (
                <span
                  key={color}
                  className={`h-6 w-6 rounded-full border border-white/[0.35] shadow-glass ${swatchClass(color)}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[outfit.occasion, outfit.season, outfit.style].map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Shop the look</h2>
              <p className="text-xs text-white/40">Upper and lower wear</p>
            </div>
            <div className="grid gap-3">
              {outfit.segments.map((segment) => (
                <motion.button
                  key={segment.key}
                  type="button"
                  className="surface group flex items-center gap-4 rounded-[1.6rem] p-3 text-left transition duration-300 hover:border-bronze/40 hover:bg-white/[0.12]"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSegment(segment)}
                >
                  <span
                    className={`h-16 w-16 rounded-[1.2rem] border border-white/20 shadow-glow ${swatchClass(segment.swatch)}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-white">
                      {segment.label}
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm leading-5 text-white/60">
                      {segment.description}
                    </span>
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-forest to-bronze text-white shadow-glow">
                    <ShoppingBag className="h-4 w-4" />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductBottomSheet
        outfitId={outfit.id}
        segment={activeSegment}
        open={Boolean(activeSegment)}
        onClose={() => setActiveSegment(null)}
      />
    </>
  );
}
