import { profiles } from "@/lib/mock-data";
import {
  decorateOutfitForViewer,
  decorateOutfitsForViewer,
  getProfileForUser,
  type getStoredUserFromRequest
} from "@/services/auth-store";
import { getAllOutfits } from "@/services/outfit-content";
import type { Outfit, Profile } from "@/types";

async function byIds(ids: string[]) {
  const outfits = await getAllOutfits();

  return ids
    .map((id) => outfits.find((outfit) => outfit.id === id))
    .filter((outfit): outfit is Outfit => Boolean(outfit));
}

type Viewer = Awaited<ReturnType<typeof getStoredUserFromRequest>>;

export async function getFeed(viewer?: Viewer) {
  const outfits = await getAllOutfits();
  return { outfits: await decorateOutfitsForViewer(outfits, viewer) };
}

export async function getOutfit(id: string, viewer?: Viewer) {
  const outfits = await getAllOutfits();
  const outfit = outfits.find((item) => item.id === id);
  if (!outfit) return null;
  return { outfit: await decorateOutfitForViewer(outfit, viewer) };
}

export async function searchOutfits(query = "", genre = "", viewer?: Viewer) {
  const outfits = await getAllOutfits();
  const normalized = query.trim().toLowerCase();
  const normalizedGenre = genre.trim().toLowerCase();

  const filteredByGenre = normalizedGenre
    ? outfits.filter((outfit) => outfit.aesthetics.includes(normalizedGenre))
    : outfits;

  const results = normalized
    ? filteredByGenre.filter((outfit) => {
        const haystack = [
          outfit.title,
          outfit.caption,
          outfit.style,
          outfit.occasion,
          outfit.season,
          ...outfit.aesthetics,
          ...outfit.tags,
          outfit.creator.username,
          outfit.location ?? ""
        ]
          .join(" ")
          .toLowerCase();

        return normalized
          .split(/\s+/)
          .every((part) => haystack.includes(part));
      })
    : filteredByGenre;

  return {
    query,
    genre: normalizedGenre || undefined,
    results: await decorateOutfitsForViewer(
      results.length > 0 ? results : normalizedGenre ? [] : outfits.slice(0, 6),
      viewer
    ),
    nextCursor: results.length > 5 ? "page-2" : null
  };
}

export async function getProfile(username: string, viewer?: Viewer) {
  const accountProfile = await getProfileForUser(username);
  if (accountProfile) {
    return profileWithOutfits(accountProfile.profile, viewer);
  }

  const profile = profiles.find((item) => item.username === username);

  if (!profile) return null;

  return profileWithOutfits(
    {
      ...profile,
      savedIds: [],
      likedIds: []
    },
    viewer
  );
}

export async function profileWithOutfits(profile: Profile, viewer?: Viewer) {
  return {
    profile,
    outfits: await decorateOutfitsForViewer(await byIds(profile.outfitIds), viewer),
    saved: await decorateOutfitsForViewer(await byIds(profile.savedIds), viewer),
    liked: await decorateOutfitsForViewer(await byIds(profile.likedIds), viewer)
  };
}
