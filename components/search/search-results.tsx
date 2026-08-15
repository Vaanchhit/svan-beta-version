"use client";

import { motion } from "framer-motion";
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
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <p className="text-xs font-medium uppercase text-white/40">Discover</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            {title}
          </h1>
        </motion.div>

        {!query && !genre ? (
          <div className="no-scrollbar -mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-2">
            {aestheticCategories.map((item) => (
              <a key={item.slug} href={`/search?genre=${item.slug}`}>
                <Badge className="whitespace-nowrap">{item.label}</Badge>
              </a>
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
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center text-xs text-white/50">
            More outfit pages can be streamed from the same search API shape.
          </div>
        </div>
      ) : null}
    </section>
  );
}
