"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      className="surface grid grid-cols-[6rem_1fr] gap-3 rounded-[1.35rem] p-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      whileHover={{ y: -2 }}
    >
      <div className="soft-edge aspect-[4/5] overflow-hidden rounded-[1rem] bg-white/10">
        <img
          src={product.image}
          alt={product.title}
          className="image-polish h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-col py-1 pr-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-bronze-soft">
              {product.retailer}
            </p>
            <h3 className="mt-1 truncate text-sm font-semibold text-white">
              {product.brand}
            </h3>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[0.7rem] text-white/70">
            <Star className="h-3 w-3 fill-white text-white" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.matchType ? (
            <span className="rounded-full bg-gradient-to-r from-forest to-bronze px-2 py-1 text-[0.68rem] font-semibold text-white shadow-glow">
              {product.matchType}
            </span>
          ) : null}
          {product.availability ? (
            <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[0.68rem] text-white/60">
              {product.availability}
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/60">
          {product.title}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-base font-semibold text-white">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice ? (
              <p className="text-xs text-white/40 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            ) : null}
          </div>
          <Button asChild size="sm" variant="default">
            <a href={product.buyUrl} target="_blank" rel="noreferrer">
              Buy
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
