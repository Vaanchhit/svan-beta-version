import { readFile } from "node:fs/promises";
import { parseDelimitedFeed, type FeedRecord } from "@/services/providers/csv-feed-parser";
import type { Product } from "@/types";

const recordArrays = ["products", "items", "resources", "data", "offers"];

export async function loadProductsFromConfiguredFeeds(
  feedFile: string,
  feedUrls: string[]
) {
  const batches = await Promise.allSettled([
    ...feedUrls.map((url) => loadFeedUrl(url)),
    ...(feedFile ? [loadFeedFile(feedFile)] : [])
  ]);

  return batches
    .flatMap((batch) => (batch.status === "fulfilled" ? batch.value : []))
    .map(normalizeProduct)
    .filter((product): product is Product => Boolean(product));
}

async function loadFeedUrl(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json,text/csv,text/tab-separated-values,*/*"
    },
    next: {
      revalidate: 60 * 60 * 3
    }
  });

  if (!response.ok) return [];

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  return parseFeedText(text, contentType);
}

async function loadFeedFile(filePath: string) {
  const text = await readFile(filePath, "utf8");
  return parseFeedText(text, filePath);
}

function parseFeedText(text: string, hint: string) {
  const trimmed = text.trim();

  if (hint.includes("json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return extractJsonRecords(JSON.parse(trimmed));
  }

  return parseDelimitedFeed(text);
}

function extractJsonRecords(value: unknown): FeedRecord[] {
  if (Array.isArray(value)) return value.map(flattenObject);

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    const nested = recordArrays
      .map((key) => objectValue[key])
      .find((item): item is unknown[] => Array.isArray(item));

    if (nested) return nested.map(flattenObject);
  }

  return [];
}

function flattenObject(value: unknown): FeedRecord {
  if (!value || typeof value !== "object") return {};

  const output: FeedRecord = {};
  const stack: Array<[string, unknown]> = Object.entries(
    value as Record<string, unknown>
  );

  while (stack.length > 0) {
    const [key, nestedValue] = stack.pop()!;
    const normalizedKey = key
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    if (nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)) {
      Object.entries(nestedValue as Record<string, unknown>).forEach(
        ([childKey, childValue]) => {
          stack.push([`${normalizedKey}_${childKey}`, childValue]);
        }
      );
    } else {
      output[normalizedKey] = Array.isArray(nestedValue)
        ? nestedValue.join(", ")
        : String(nestedValue ?? "");
    }
  }

  return output;
}

function normalizeProduct(record: FeedRecord): Product | null {
  const title = pick(record, "title", "name", "productname", "product_name");
  const url = pick(record, "url", "link", "linkurl", "link_url", "product_url", "tracking_url");
  const image = pick(record, "image", "imageurl", "image_url", "image_link", "picture", "photo");
  const price = parseMoney(
    pick(record, "saleprice", "sale_price", "current_price", "price", "final_price")
  );

  if (!title || !url || !image || !price) return null;

  const retailer =
    pick(record, "retailer", "merchant", "merchantname", "merchant_name", "store", "advertiser_name") ||
    "Retailer";
  const brand = pick(record, "brand", "brand_name", "manufacturer") || retailer;

  return {
    id:
      pick(record, "id", "sku", "product_id", "offer_id", "linkid", "item_group_id") ||
      `${retailer}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    retailer,
    brand,
    title,
    price,
    originalPrice: parseMoney(
      pick(record, "original_price", "retailprice", "retail_price", "mrp")
    ),
    currency:
      pick(record, "currency", "currencyid", "price_currency", "saleprice_currency") ||
      "INR",
    image,
    buyUrl: url,
    color: pick(record, "color", "colour") || "Neutral",
    sizes: parseList(pick(record, "sizes", "size", "available_sizes")) || ["S", "M", "L"],
    rating: Number(pick(record, "rating", "average_rating")) || 4.3,
    matchType: normalizeMatchType(pick(record, "match_type", "matchtype")),
    availability: pick(record, "availability", "stock_status"),
    scrapedAt: pick(record, "scraped_at", "last_updated_at"),
    sourceUrl: pick(record, "source_url", "source")
  };
}

function pick(record: FeedRecord, ...keys: string[]) {
  const normalized = keys.map((key) => key.toLowerCase());
  const found = Object.entries(record).find(([key, value]) => {
    if (!value) return false;
    return normalized.includes(key) || normalized.some((target) => key.endsWith(`_${target}`));
  });

  return found?.[1]?.trim() ?? "";
}

function parseMoney(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseList(value: string) {
  const items = value
    .split(/[,|/]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

function normalizeMatchType(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "exact") return "Exact";
  if (normalized === "close") return "Close";
  if (normalized === "substitute") return "Substitute";
  return undefined;
}
