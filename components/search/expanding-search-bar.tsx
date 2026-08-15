"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandingSearchBarProps {
  defaultValue?: string;
  genre?: string;
  autoFocus?: boolean;
}

export function ExpandingSearchBar({
  defaultValue = "",
  genre = "",
  autoFocus = false
}: ExpandingSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(autoFocus);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim();
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (normalized) params.set("q", normalized);

    router.push(params.toString() ? `/search?${params.toString()}` : "/search");
  };

  return (
    <motion.form
      onSubmit={submit}
      className={cn(
        "sticky top-0 z-20 bg-carbon/60 px-4 pb-4 mobile-safe-top backdrop-blur-2xl"
      )}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        layout
        className={cn(
          "surface flex items-center gap-2 rounded-[1.45rem] px-3 transition duration-300",
          focused
            ? "border-forest/70 bg-white/[0.12] shadow-glow"
            : "border-white/10 bg-white/[0.08]"
        )}
      >
        <Search className="h-5 w-5 text-white/50" />
        <input
          value={query}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search outfits, colors, moods"
          className="h-14 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40"
        />
        <AnimatePresence>
          {query ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                type="button"
                size="icon"
                variant="bare"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  router.push(genre ? `/search?genre=${genre}` : "/search");
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.form>
  );
}
