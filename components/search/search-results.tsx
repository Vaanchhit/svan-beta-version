"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GridLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ExpandingSearchBar } from "@/components/search/expanding-search-bar";
import { MasonryGrid } from "@/components/search/masonry-grid";
import { useSearchOutfits } from "@/hooks/use-search-outfits";
import { aestheticCategories, getAestheticLabel } from "@/lib/aesthetics";

interface SearchResultsProps {
  query: string;
  genre?: string;
}

const quickSearches = [
  "brown lace top",
  "linen shirt",
  "green top",
  "cargo pants",
  "workwear"
];

const categoryMoods: Record<string, string[]> = {
  "clean-girl": ["skin", "linen", "tonal", "soft polish"],
  y2k: ["chrome", "denim", "baby tee", "after dark"],
  minimalist: ["line", "quiet", "monochrome", "tailored"],
  summer: ["cotton", "sun", "bare shoulder", "daylight"],
  date: ["silk", "low light", "red lip", "close fit"],
  street: ["utility", "oversized", "sneaker", "city"],
  workwear: ["structure", "crease", "commute", "sharp"],
  travel: ["layers", "airport", "capsule", "easy"],
  monsoon: ["Mumbai", "rain", "linen", "waterproof"],
  evening: ["black", "metal", "drape", "glow"]
};

export function SearchResults({ query, genre = "" }: SearchResultsProps) {
  const { results, nextCursor, isLoading, error } = useSearchOutfits(query, genre);
  const genreLabel = getAestheticLabel(genre);
  const title = genreLabel
    ? query
      ? `${genreLabel}: "${query}"`
      : `${genreLabel} outfits`
    : query
      ? `Results for "${query}"`
      : "Outfits worth saving";

  return (
    <section>
      <ExpandingSearchBar defaultValue={query} genre={genre} />
      <div className="px-4 pb-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr] md:items-end"
        >
          <div>
            <p className="label-editorial editorial-rule pl-16 text-white/42">Discover</p>
            <h1 className="display-editorial mt-4 max-w-3xl text-6xl leading-[0.88] text-white md:text-8xl">
              {title}
            </h1>
          </div>
          <div className="surface hidden rounded-[1rem] p-4 md:block">
            <p className="text-sm leading-6 text-white/62">
              Search behaves like a moodboard: color, garment, creator, and
              occasion all rearrange the same community wardrobe.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(genre ? categoryMoods[genre] ?? [] : ["red + denim", "date night", "linen", "street"]).map((mood) => (
                <Link
                  key={mood}
                  href={`/search?q=${encodeURIComponent(mood)}${genre ? `&genre=${genre}` : ""}`}
                  data-cursor="Search"
                  className="garment-tag magnetic rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/72 hover:text-white"
                >
                  {mood}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {!query && !genre ? (
          <div className="no-scrollbar -mx-4 mb-2 flex gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
            {aestheticCategories.map((item, index) => (
              <motion.a
                key={item.slug}
                href={`/search?genre=${item.slug}`}
                data-cursor="Explore"
                className="group relative flex h-28 min-w-[10.5rem] flex-col justify-between overflow-hidden rounded-[1rem] border border-white/10 bg-white/[0.055] p-3 shadow-glass md:h-36 md:min-w-[13rem]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.025, 0.18) }}
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(247,245,239,0.18),transparent_38%),linear-gradient(135deg,rgba(15,76,58,0.25),rgba(150,62,63,0.16),rgba(39,34,52,0.32))] opacity-80 transition group-hover:scale-105" />
                <span className="relative label-editorial text-white/46">Editorial room</span>
                <span className="relative display-editorial text-4xl leading-none text-white md:text-5xl">
                  {item.label}
                </span>
              </motion.a>
            ))}
            {quickSearches.map((item) => (
              <a key={item} href={`/search?q=${encodeURIComponent(item)}`}>
                <Badge className="whitespace-nowrap">{item}</Badge>
              </a>
            ))}
          </div>
        ) : null}
      </div>

      {isLoading ? <GridLoadingSkeleton /> : null}
      {error ? (
        <div className="px-5 py-16 text-center text-sm text-white/50">
          {error}
        </div>
      ) : null}
      {!isLoading && !error && results.length > 0 ? (
        <MasonryGrid outfits={results} />
      ) : null}

      {!isLoading && !error && results.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <p className="text-base font-semibold text-white">No outfits yet</p>
          <p className="mt-2 text-sm leading-6 text-white/50">
            This aesthetic is ready in the mock API, but it needs more seeded looks.
          </p>
        </div>
      ) : null}

      {!isLoading && nextCursor ? (
        <div className="-mt-20 px-4 pb-28">
          <div className="rounded-[1rem] border border-white/10 bg-white/5 p-4 text-center text-xs text-white/50">
            More outfit pages can be streamed from the same search API shape.
          </div>
        </div>
      ) : null}
    </section>
  );
}
