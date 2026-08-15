import { readFile } from "node:fs/promises";
import { serverConfig } from "@/lib/server-config";
import { outfits as mockOutfits } from "@/lib/mock-data";
import type { Creator, Occasion, Outfit, OutfitSegment, Season } from "@/types";

const defaultCreator: Creator = {
  username: "svan.creator",
  displayName: "SVAN Creator",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&h=900&q=82",
  verified: false
};

export async function getAllOutfits() {
  if (!serverConfig.outfitFeedFile) return mockOutfits;

  try {
    const text = await readFile(serverConfig.outfitFeedFile, "utf8");
    const parsed = JSON.parse(text) as unknown;
    const records = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { outfits?: unknown[] }).outfits)
        ? (parsed as { outfits: unknown[] }).outfits
        : [];
    const realOutfits = records
      .map(normalizeOutfit)
      .filter((outfit): outfit is Outfit => Boolean(outfit));

    return realOutfits.length > 0 ? realOutfits : mockOutfits;
  } catch {
    return mockOutfits;
  }
}

function normalizeOutfit(record: unknown): Outfit | null {
  if (!record || typeof record !== "object") return null;

  const item = record as Partial<Outfit>;
  if (!item.id || !item.image || !item.title) return null;

  return {
    id: item.id,
    title: item.title,
    image: item.image,
    imageAlt: item.imageAlt ?? item.title,
    creator: item.creator ?? defaultCreator,
    location: item.location,
    caption: item.caption ?? "",
    likeCount: item.likeCount ?? 0,
    commentCount: item.commentCount ?? 0,
    saveCount: item.saveCount ?? 0,
    postedAt: item.postedAt ?? new Date().toISOString(),
    occasion: item.occasion ?? ("Weekend" as Occasion),
    season: item.season ?? ("All Season" as Season),
    style: item.style ?? "Curated",
    aesthetics: item.aesthetics ?? [],
    tags: item.tags ?? [],
    palette: item.palette ?? ["#050505", "#F7F5EF"],
    segments: normalizeSegments(item.segments)
  };
}

function normalizeSegments(segments: OutfitSegment[] | undefined) {
  if (segments?.length) return segments;

  return [
    {
      key: "upper-wear" as const,
      label: "Upper Wear",
      description: "Matched tops, shirts, blouses, and layers",
      swatch: "#F7F5EF",
      products: []
    },
    {
      key: "lower-wear" as const,
      label: "Lower Wear",
      description: "Matched jeans, trousers, skirts, and bottoms",
      swatch: "#050505",
      products: []
    }
  ];
}
