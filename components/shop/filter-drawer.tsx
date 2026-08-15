"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import type { Retailer, SortOption } from "@/types";

interface FilterDrawerProps {
  brands: Retailer[];
  selectedBrands: Retailer[];
  maxPrice: number;
  priceCeiling: number;
  sort: SortOption;
  onBrandToggle: (brand: Retailer) => void;
  onPriceChange: (price: number) => void;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Recommended", value: "recommended" },
  { label: "Lowest", value: "price-low" },
  { label: "Highest", value: "price-high" }
];

export function FilterDrawer({
  brands,
  selectedBrands,
  maxPrice,
  priceCeiling,
  sort,
  onBrandToggle,
  onPriceChange,
  onSortChange
}: FilterDrawerProps) {
  return (
    <section className="surface rounded-[1.4rem] p-4">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-bronze-soft" />
        <h3 className="text-sm font-semibold text-white">Filters</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-white/50">
            <span>Price</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
          <input
            aria-label="Maximum price"
            type="range"
            min={800}
            max={priceCeiling}
            step={100}
            value={maxPrice}
            onChange={(event) => onPriceChange(Number(event.target.value))}
            className="h-2 w-full accent-bronze"
          />
        </div>

        <div>
          <p className="mb-2 text-xs text-white/50">Brand</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => {
              const selected = selectedBrands.includes(brand);
              return (
                <Button
                  key={brand}
                  type="button"
                  variant={selected ? "forest" : "outline"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => onBrandToggle(brand)}
                >
                  {brand}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-white/50">Sort</p>
          <div className="grid grid-cols-3 gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "h-9 rounded-full border text-xs font-semibold transition",
                  sort === option.value
                    ? "border-bronze bg-gradient-to-r from-forest to-bronze text-white shadow-glow"
                    : "border-white/10 bg-white/[0.08] text-white/60 hover:border-white/20 hover:bg-white/[0.12]"
                )}
                onClick={() => onSortChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
