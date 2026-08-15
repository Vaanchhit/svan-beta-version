"use client";

import { useEffect, useState } from "react";
import { svanApi } from "@/services/svan-api";
import type { Outfit } from "@/types";

export function useFeed() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    svanApi
      .feed()
      .then((response) => {
        if (isMounted) {
          setOutfits(response.outfits);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError("Could not load the feed.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { outfits, isLoading, error };
}
