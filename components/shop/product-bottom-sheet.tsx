"use client";

import { useEffect, useMemo, useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { FilterDrawer } from "@/components/shop/filter-drawer";
import { ProductCard } from "@/components/shop/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSegmentProducts } from "@/hooks/use-segment-products";
import { unique } from "@/lib/utils";
import type { OutfitSegment, Retailer, SortOption } from "@/types";

interface ProductBottomSheetProps {
  outfitId: string;
  segment: OutfitSegment | null;
  open: boolean;
  onClose: () => void;
}

export function ProductBottomSheet({
  outfitId,
  segment,
  open,
  onClose
}: ProductBottomSheetProps) {
  const [maxPrice, setMaxPrice] = useState(6500);
  const [selectedBrands, setSelectedBrands] = useState<Retailer[]>([]);
  const [sort, setSort] = useState<SortOption>("recommended");
  const fallbackProducts = useMemo(() => segment?.products ?? [], [segment]);
  const {
    products,
    source,
    provider,
    isLoading,
    error
  } = useSegmentProducts(outfitId, segment?.key, open, fallbackProducts);
  const priceCeiling = useMemo(() => {
    const highest = Math.max(6500, ...products.map((product) => product.price));
    return Math.ceil(highest / 500) * 500;
  }, [products]);

  useEffect(() => {
    if (!open) return;
    setMaxPrice(priceCeiling);
    setSelectedBrands([]);
  }, [open, priceCeiling, segment?.key]);

  const brands = useMemo(
    () => unique(products.map((product) => product.retailer)),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const priceMatch = product.price <= maxPrice;
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.retailer);
      return priceMatch && brandMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return b.rating - a.rating;
    });
  }, [maxPrice, products, selectedBrands, sort]);

  const toggleBrand = (brand: Retailer) => {
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand]
    );
  };

  return (
    <BottomSheet
      open={open && Boolean(segment)}
      title={segment?.label ?? "Shop"}
      description={segment?.description}
      onClose={onClose}
    >
      {segment ? (
        <div className="space-y-4">
          <div className="surface rounded-[1.25rem] px-3 py-2">
            <p className="text-xs font-medium text-white/70">
              {source === "scrape"
                ? "Runtime retailer search"
                : source === "feed"
                  ? "Saved product catalog"
                  : "Backup product catalog"}
            </p>
            <p className="mt-0.5 text-[0.7rem] text-white/40">{provider}</p>
          </div>

          <FilterDrawer
            brands={brands}
            selectedBrands={selectedBrands}
            maxPrice={maxPrice}
            priceCeiling={priceCeiling}
            sort={sort}
            onBrandToggle={toggleBrand}
            onPriceChange={setMaxPrice}
            onSortChange={setSort}
          />
          <div className="space-y-3">
            {error ? (
              <p className="surface rounded-2xl p-3 text-xs text-white/50">
                {error}
              </p>
            ) : null}
            {isLoading ? (
              <>
                <Skeleton className="h-32 rounded-[1.35rem]" />
                <Skeleton className="h-32 rounded-[1.35rem]" />
              </>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      ) : null}
    </BottomSheet>
  );
}
