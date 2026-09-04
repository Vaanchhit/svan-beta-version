"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Heart,
  MessageCircle,
  Send,
  ShoppingBag,
  Tag
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
      <section className="pb-28 md:grid md:min-h-dvh md:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] md:gap-0 md:pb-0">
        <div className="relative md:sticky md:top-0 md:h-dvh">
          <motion.img
            layoutId={`look-image-${outfit.id}`}
            src={outfit.image}
            alt={outfit.imageAlt}
            className="image-polish h-[68dvh] min-h-[32rem] w-full object-cover md:h-full"
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
            <div className="garment-tag rounded-full px-3 py-1.5 text-xs font-semibold text-white">
              {outfit.style}
            </div>
          </div>
          <div className="absolute left-[14%] top-[34%] hidden md:block">
            {outfit.segments[0] ? (
              <button
                type="button"
                data-cursor="Inspect"
                className="garment-tag fashion-focus magnetic rounded-full px-4 py-2 text-[0.67rem] font-bold uppercase tracking-[0.18em] text-white"
                onClick={() => setActiveSegment(outfit.segments[0])}
              >
                <Tag className="mr-2 inline h-3.5 w-3.5" />
                {outfit.segments[0].label}
              </button>
            ) : null}
          </div>
          <div className="absolute bottom-[20%] right-[12%] hidden md:block">
            {outfit.segments[1] ? (
              <button
                type="button"
                data-cursor="Inspect"
                className="garment-tag fashion-focus magnetic rounded-full px-4 py-2 text-[0.67rem] font-bold uppercase tracking-[0.18em] text-white"
                onClick={() => setActiveSegment(outfit.segments[1])}
              >
                <Tag className="mr-2 inline h-3.5 w-3.5" />
                {outfit.segments[1].label}
              </button>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon via-carbon/60 to-transparent p-5 pt-28 md:hidden">
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

        <div className="px-5 pt-5 md:flex md:min-h-dvh md:flex-col md:justify-center md:px-8 md:py-24 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block"
          >
            <button
              type="button"
              data-cursor="Profile"
              className="fashion-focus magnetic flex items-center gap-3 rounded-[1rem] text-left"
              onClick={() => router.push(`/profile/${outfit.creator.username}`)}
            >
              <Avatar
                src={outfit.creator.avatar}
                alt={outfit.creator.displayName}
                size="md"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  {outfit.creator.username}
                  {outfit.creator.verified ? (
                    <CheckCircle2 className="h-3.5 w-3.5 fill-forest text-white" />
                  ) : null}
                </span>
                <span className="truncate text-xs text-white/48">{outfit.location}</span>
              </span>
            </button>
            <h1 className="display-editorial mt-7 max-w-xl text-7xl leading-[0.86] text-white">
              {outfit.title}
            </h1>
            <p className="caption-balance mt-5 max-w-lg text-base leading-7 text-white/68">
              {outfit.caption}
            </p>
          </motion.div>

          <div className="surface mt-0 flex items-center justify-between rounded-[1.1rem] p-3 md:mt-8">
            <div className="flex items-center gap-4 text-sm text-white/70">
              <button
                type="button"
                data-cursor={liked ? "Loved" : "Love"}
                className="fashion-focus flex items-center gap-1.5 rounded-[0.7rem] transition hover:text-white"
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
                data-cursor={saved ? "Wardrobe" : "Save"}
                className="fashion-focus flex items-center gap-1.5 rounded-[0.7rem] transition hover:text-white"
                onClick={() => toggle("save")}
              >
                <Bookmark className={saved ? "h-4 w-4 fill-white text-white" : "h-4 w-4"} />
                {formatCount(saveCount)}
              </button>
              <span className="hidden items-center gap-1.5 md:flex">
                <Send className="h-4 w-4" />
                Share
              </span>
            </div>
            <div className="flex -space-x-2">
              {outfit.palette.map((color) => (
                <span
                  key={color}
                  className={`h-6 w-6 rounded-[0.35rem] border border-white/[0.35] shadow-glass ${swatchClass(color)}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[outfit.occasion, outfit.season, outfit.style].map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="display-editorial text-3xl text-white">Garment graph</h2>
              <p className="label-editorial text-white/35">Tap to inspect</p>
            </div>
            <div className="grid gap-3">
              {outfit.segments.map((segment) => (
                <motion.button
                  key={segment.key}
                  type="button"
                  data-cursor="Inspect"
                  className="surface group fashion-focus flex items-center gap-4 rounded-[1rem] p-3 text-left transition duration-300 hover:border-bronze/40 hover:bg-white/[0.12]"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSegment(segment)}
                >
                  <span
                    className={`h-16 w-16 rounded-[0.8rem] border border-white/20 shadow-glow ${swatchClass(segment.swatch)}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-white">
                      {segment.label}
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm leading-5 text-white/60">
                      {segment.description}
                    </span>
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-[0.8rem] bg-gradient-to-br from-forest to-bronze text-white shadow-glow">
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
