"use client";

import { useEffect, useState } from "react";
import { svanApi } from "@/services/svan-api";
import type { Outfit } from "@/types";

export function useSearchOutfits(query: string, genre = "") {
  const [results, setResults] = useState<Outfit[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    svanApi
      .search(query, genre)
      .then((response) => {
        if (isMounted) {
          setResults(response.results);
          setNextCursor(response.nextCursor);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError("Could not search outfits.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query, genre]);

  return { results, nextCursor, isLoading, error };
}
