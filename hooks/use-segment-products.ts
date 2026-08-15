"use client";

import { useEffect, useState } from "react";
import { svanApi } from "@/services/svan-api";
import type { Product, ProductCatalogResponse, SegmentKey } from "@/types";

const emptyResponse: ProductCatalogResponse = {
  products: [],
  source: "mock",
  provider: "Mock seed products",
  query: ""
};

export function useSegmentProducts(
  outfitId: string,
  segment: SegmentKey | undefined,
  enabled: boolean,
  fallbackProducts: Product[]
) {
  const [state, setState] = useState<ProductCatalogResponse>(emptyResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !segment) {
      setState({
        ...emptyResponse,
        products: fallbackProducts
      });
      return;
    }

    let isMounted = true;

    setIsLoading(true);
    svanApi
      .products(outfitId, segment)
      .then((response) => {
        if (isMounted) {
          setState({
            ...response,
            products: response.products.length > 0 ? response.products : fallbackProducts
          });
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setState({
            ...emptyResponse,
            products: fallbackProducts
          });
          setError("Real product feed unavailable. Showing fallback products.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enabled, fallbackProducts, outfitId, segment]);

  return { ...state, isLoading, error };
}
