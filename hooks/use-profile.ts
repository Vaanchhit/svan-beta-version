"use client";

import { useEffect, useState } from "react";
import { svanApi } from "@/services/svan-api";
import type { Outfit, Profile } from "@/types";

interface ProfileState {
  profile: Profile | null;
  outfits: Outfit[];
  saved: Outfit[];
  liked: Outfit[];
}

export function useProfile(username: string) {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    outfits: [],
    saved: [],
    liked: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    svanApi
      .profile(username)
      .then((response) => {
        if (isMounted) {
          setState(response);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError("Could not load this profile.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [username]);

  return { ...state, isLoading, error };
}
