"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShopButton } from "@/components/shop/shop-button";
import { formatCount, formatTimeAgo } from "@/lib/utils";
import { swatchClass } from "@/lib/swatch-classes";
import { svanApi } from "@/services/svan-api";
import type { Outfit } from "@/types";

interface OutfitCardProps {
  outfit: Outfit;
  priority?: boolean;
}

export function OutfitCard({ outfit, priority = false }: OutfitCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [liked, setLiked] = useState(Boolean(outfit.viewerLiked));
  const [saved, setSaved] = useState(Boolean(outfit.viewerSaved));
  const [likeCount, setLikeCount] = useState(outfit.likeCount);
  const [saveCount, setSaveCount] = useState(outfit.saveCount);
  const [isSyncing, setIsSyncing] = useState<"like" | "save" | null>(null);

  useEffect(() => {
    setLiked(Boolean(outfit.viewerLiked));
    setSaved(Boolean(outfit.viewerSaved));
    setLikeCount(outfit.likeCount);
    setSaveCount(outfit.saveCount);
  }, [outfit.id, outfit.likeCount, outfit.saveCount, outfit.viewerLiked, outfit.viewerSaved]);

  const toggle = async (type: "like" | "save") => {
    if (!user) {
      router.push(`/account?next=/outfit/${outfit.id}`);
      return;
    }

    setIsSyncing(type);
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
    } finally {
      setIsSyncing(null);
    }
  };

  return (
    <motion.article
      className="px-4 pb-14 pt-5 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex items-center justify-between px-1 md:px-3">
        <button
          type="button"
          data-cursor="Profile"
          className="fashion-focus magnetic flex min-w-0 items-center gap-3 rounded-[0.9rem] text-left"
          onClick={() => router.push(`/profile/${outfit.creator.username}`)}
        >
          <Avatar src={outfit.creator.avatar} alt={outfit.creator.displayName} size="md" />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold tracking-[0.02em] text-white">
                {outfit.creator.username}
              </span>
              {outfit.creator.verified ? (
                <CheckCircle2 className="h-3.5 w-3.5 fill-forest text-white" />
              ) : null}
            </span>
            {outfit.location ? (
              <span className="mt-0.5 flex items-center gap-1 text-[0.64rem] uppercase tracking-[0.18em] text-white/45">
                <MapPin className="h-3 w-3" />
                {outfit.location}
              </span>
            ) : null}
          </span>
        </button>
        <Button type="button" variant="bare" size="icon" aria-label="More" className="rounded-[0.9rem]">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <motion.button
        type="button"
        aria-label={`Open ${outfit.title}`}
        data-cursor="View"
        className="group fashion-focus soft-edge relative aspect-[4/5] w-full overflow-hidden rounded-[1.35rem] bg-white/10 text-left md:aspect-[16/19] md:rounded-[1.65rem] lg:aspect-[16/17]"
        onClick={() => router.push(`/outfit/${outfit.id}`)}
        whileTap={{ scale: 0.985 }}
        whileHover={{ y: -4, scale: 1.008 }}
      >
        <motion.img
          layoutId={`look-image-${outfit.id}`}
          src={outfit.image}
          alt={outfit.imageAlt}
          className="image-polish h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
          loading={priority ? "eager" : "lazy"}
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="image-veil absolute inset-0" />
        <div className="absolute left-4 top-4 flex items-center gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="garment-tag rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white">
            {outfit.occasion}
          </span>
          <span className="garment-tag hidden rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/75 sm:inline-flex">
            {outfit.season}
          </span>
        </div>
        <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 opacity-0 shadow-glass backdrop-blur-xl transition duration-300 group-hover:opacity-100">
          <Eye className="h-5 w-5 text-white" />
        </div>
        <div className="absolute inset-x-4 top-[38%] hidden translate-y-4 gap-2 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          {outfit.segments.map((segment) => (
            <span
              key={segment.key}
              className="garment-tag rounded-full px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white"
            >
              {segment.label}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="label-editorial flex items-center gap-2 text-white/65">
                <Sparkles className="h-3 w-3" />
                {outfit.style}
              </p>
              <h2 className="display-editorial mt-2 max-w-[18rem] text-4xl leading-[0.9] text-white md:text-6xl">
                {outfit.title}
              </h2>
            </div>
            <div className="flex -space-x-2">
              {outfit.palette.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className={`h-6 w-6 rounded-full border border-white/40 shadow-[0_6px_16px_rgba(0,0,0,0.3)] ${swatchClass(color)}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.button>

      <div className="surface mt-4 flex items-center justify-between rounded-[1.1rem] px-2.5 py-2 md:mx-3 md:px-3">
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            aria-label="Like"
            data-cursor={liked ? "Loved" : "Love"}
            className="fashion-focus flex h-11 w-11 items-center justify-center rounded-[0.85rem] text-white transition hover:bg-white/10"
            whileTap={{ scale: 0.82 }}
            onClick={() => toggle("like")}
            disabled={isSyncing === "like"}
          >
            <Heart
              className={liked ? "fill-red-500 text-red-500" : "text-white"}
              size={24}
            />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Comment"
            data-cursor="Ask"
            className="fashion-focus flex h-11 w-11 items-center justify-center rounded-[0.85rem] text-white transition hover:bg-white/10"
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle size={23} />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Share"
            data-cursor="Share"
            className="fashion-focus flex h-11 w-11 items-center justify-center rounded-[0.85rem] text-white transition hover:bg-white/10"
            whileTap={{ scale: 0.9 }}
          >
            <Send size={22} />
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <ShopButton outfitId={outfit.id} compact />
          <motion.button
            type="button"
            aria-label="Save"
            data-cursor={saved ? "Wardrobe" : "Save"}
            className="fashion-focus flex h-11 w-11 items-center justify-center rounded-[0.85rem] text-white transition hover:bg-white/10"
            whileTap={{ scale: 0.86 }}
            onClick={() => toggle("save")}
            disabled={isSyncing === "save"}
          >
            <Bookmark
              className={saved ? "fill-white text-white" : "text-white"}
              size={23}
            />
          </motion.button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 px-1 md:px-3">
        <p className="text-sm font-semibold tracking-[0.04em] text-white/90">
          {formatCount(likeCount)} likes
        </p>
        <p className="text-sm leading-6 text-white/80">
          <button
            type="button"
            data-cursor="Profile"
            className="fashion-focus mr-1 rounded font-semibold text-white"
            onClick={() => router.push(`/profile/${outfit.creator.username}`)}
          >
            {outfit.creator.username}
          </button>
          {outfit.caption}
        </p>
        <div className="flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.14em] text-white/40">
          <span>{formatCount(outfit.commentCount)} comments</span>
          <span>{formatCount(saveCount)} saves</span>
          <span>{formatTimeAgo(outfit.postedAt)}</span>
        </div>
      </div>
    </motion.article>
  );
}
