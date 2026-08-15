"use client";

import { useEffect, useState } from "react";
import { svanApi } from "@/services/svan-api";
import type { Outfit } from "@/types";

export function useOutfit(id: string) {
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    svanApi
      .outfit(id)
      .then((response) => {
        if (isMounted) {
          setOutfit(response.outfit);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError("This outfit could not be found.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { outfit, isLoading, error };
}
