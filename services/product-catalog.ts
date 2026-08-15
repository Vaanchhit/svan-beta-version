import { hasConfiguredProductFeed, serverConfig } from "@/lib/server-config";
import { getAllOutfits } from "@/services/outfit-content";
import { loadProductsFromConfiguredFeeds } from "@/services/providers/product-feed-provider";
import { monetizeProductsWithCuelinks } from "@/services/providers/cuelinks-provider";
import { scrapeProductTargets } from "@/services/scrapers/product-page-scraper";
import type { Product, SegmentKey } from "@/types";

const segmentTerms: Record<SegmentKey, string[]> = {
  "upper-wear": [
    "top",
    "shirt",
    "blouse",
    "cami",
    "camisole",
    "cardigan",
    "blazer",
    "tank",
    "vest",
    "knit",
    "tee",
    "t-shirt"
  ],
  "lower-wear": [
    "jeans",
    "trouser",
    "trousers",
    "pant",
    "pants",
    "skirt",
    "cargo",
    "denim",
    "palazzo",
    "shorts"
  ]
};

export async function getProductsForSegment(
  outfitId: string,
  segmentKey: SegmentKey
) {
  const outfits = await getAllOutfits();
  const outfit = outfits.find((item) => item.id === outfitId);
  const segment = outfit?.segments.find((item) => item.key === segmentKey);

  if (!outfit || !segment) return null;

  const query = buildQuery(outfit.tags, outfit.style, segment.description, segmentKey);

  if (segment.scrapeTargets?.length) {
    const scrapedProducts = await scrapeProductTargets(segment.scrapeTargets);

    if (scrapedProducts.length > 0) {
      return {
        products: scrapedProducts,
        source: "scrape" as const,
        provider: "Runtime product-page scraper",
        query
      };
    }
  }

  if (!hasConfiguredProductFeed()) {
    return {
      products: segment.products,
      source: "mock" as const,
      provider: "Mock seed products",
      query
    };
  }

  const feedProducts = await loadProductsFromConfiguredFeeds(
    serverConfig.productFeedFile,
    serverConfig.productFeedUrls
  );
  const ranked = rankProducts(feedProducts, query, segmentKey).slice(0, 24);
  const products = ranked.length > 0
    ? await monetizeProductsWithCuelinks(ranked)
    : segment.products;

  return {
    products,
    source: ranked.length > 0 ? ("feed" as const) : ("mock" as const),
    provider:
      ranked.length > 0
        ? serverConfig.cuelinksApiKey
          ? "Product feed + Cuelinks"
          : "Product feed"
        : "Mock seed products",
    query
  };
}

function buildQuery(
  tags: string[],
  style: string,
  description: string,
  segmentKey: SegmentKey
) {
  return [...segmentTerms[segmentKey], ...tags, style, description]
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function rankProducts(products: Product[], query: string, segmentKey: SegmentKey) {
  const tokens = uniqueTerms(query);
  const requiredSegmentTerms = segmentTerms[segmentKey];

  return products
    .map((product) => ({
      product,
      score: scoreProduct(product, tokens, requiredSegmentTerms)
    }))
    .filter((item) => item.score > 2)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .map((item) => item.product);
}

function scoreProduct(
  product: Product,
  tokens: string[],
  requiredSegmentTerms: string[]
) {
  const haystack = [
    product.title,
    product.brand,
    product.retailer,
    product.color,
    product.sizes.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  const segmentMatch = requiredSegmentTerms.some((term) =>
    haystack.includes(term)
  );

  if (!segmentMatch) return 0;

  return tokens.reduce((score, token) => {
    if (token.length < 3) return score;
    return haystack.includes(token) ? score + 1 : score;
  }, 3);
}

function uniqueTerms(query: string) {
  return Array.from(new Set(query.split(" ").filter(Boolean)));
}
