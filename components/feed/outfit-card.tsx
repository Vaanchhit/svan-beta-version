"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send
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
      className="px-4 pb-10 pt-4"
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <button
          type="button"
          className="flex min-w-0 items-center gap-3 text-left"
          onClick={() => router.push(`/profile/${outfit.creator.username}`)}
        >
          <Avatar
            src={outfit.creator.avatar}
            alt={outfit.creator.displayName}
            size="md"
          />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-white">
                {outfit.creator.username}
              </span>
              {outfit.creator.verified ? (
                <CheckCircle2 className="h-3.5 w-3.5 fill-forest text-white" />
              ) : null}
            </span>
            {outfit.location ? (
              <span className="mt-0.5 flex items-center gap-1 text-xs text-white/50">
                <MapPin className="h-3 w-3" />
                {outfit.location}
              </span>
            ) : null}
          </span>
        </button>
        <Button type="button" variant="bare" size="icon" aria-label="More">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <motion.button
        type="button"
        aria-label={`Open ${outfit.title}`}
        className="soft-edge relative aspect-[4/5] w-full overflow-hidden rounded-[1.9rem] bg-white/10 text-left"
        onClick={() => router.push(`/outfit/${outfit.id}`)}
        whileTap={{ scale: 0.982 }}
        whileHover={{ y: -2 }}
      >
        <motion.img
          src={outfit.image}
          alt={outfit.imageAlt}
          className="image-polish h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(15,76,58,0.14),transparent_34%),linear-gradient(to_top,rgba(0,0,0,0.82),rgba(0,0,0,0.12)_38%,transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-white/60">
                {outfit.style}
              </p>
              <h2 className="mt-1 max-w-[13rem] text-xl font-semibold leading-tight text-white">
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

      <div className="surface mt-4 flex items-center justify-between rounded-[1.45rem] px-2.5 py-2">
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            aria-label="Like"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle size={23} />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Share"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
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

      <div className="mt-3 space-y-1.5 px-1">
        <p className="text-sm font-semibold text-white">
          {formatCount(likeCount)} likes
        </p>
        <p className="text-sm leading-5 text-white/80">
          <button
            type="button"
            className="mr-1 font-semibold text-white"
            onClick={() => router.push(`/profile/${outfit.creator.username}`)}
          >
            {outfit.creator.username}
          </button>
          {outfit.caption}
        </p>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>{formatCount(outfit.commentCount)} comments</span>
          <span>{formatCount(saveCount)} saves</span>
          <span>{formatTimeAgo(outfit.postedAt)}</span>
        </div>
      </div>
    </motion.article>
  );
}
