import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join } from "node:path";
import { serverConfig } from "@/lib/server-config";
import type { Product, ScrapeTarget } from "@/types";

interface ScrapedPage {
  title?: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  image?: string;
  availability?: string;
}

interface ScrapeCache {
  products: Record<
    string,
    {
      fetchedAt: string;
      product: Product;
    }
  >;
}

export async function scrapeProductTargets(targets: ScrapeTarget[]) {
  const cache = await readScrapeCache();
  const freshProducts = targets
    .map((target) => getFreshCachedProduct(cache, target.url))
    .filter((product): product is Product => Boolean(product));
  const cachedUrls = new Set(freshProducts.map((product) => product.sourceUrl));
  const staleTargets = targets.filter((target) => !cachedUrls.has(target.url));
  const settled = await Promise.allSettled(staleTargets.map(scrapeProductTarget));
  const scrapedProducts = settled
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((product): product is Product => Boolean(product));

  if (scrapedProducts.length > 0) {
    scrapedProducts.forEach((product) => {
      if (!product.sourceUrl) return;
      cache.products[product.sourceUrl] = {
        fetchedAt: product.scrapedAt ?? new Date().toISOString(),
        product
      };
    });
    await writeScrapeCache(cache);
  }

  return [...freshProducts, ...scrapedProducts];
}

async function scrapeProductTarget(target: ScrapeTarget): Promise<Product | null> {
  const staticProduct = await scrapeProductTargetWithFetch(target);
  if (staticProduct) return staticProduct;

  if (!serverConfig.enableBrowserScraper) return null;

  return scrapeProductTargetWithBrowser(target);
}

async function scrapeProductTargetWithFetch(
  target: ScrapeTarget
): Promise<Product | null> {
  const signal = AbortSignal.timeout(Math.max(serverConfig.scrapeTimeoutMs, 1000));

  try {
    const response = await fetch(target.url, {
      headers: scraperHeaders(),
      cache: "no-store",
      signal
    });

    if (!response.ok) return null;

    const html = await response.text();
    return productFromScrapedPage(target, extractProductFromHtml(html));
  } catch {
    return null;
  }
}

async function scrapeProductTargetWithBrowser(
  target: ScrapeTarget
): Promise<Product | null> {
  let browser:
    | Awaited<ReturnType<typeof import("playwright").chromium.launch>>
    | null = null;

  try {
    const { chromium } = await import("playwright");

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      locale: "en-IN",
      userAgent: scraperHeaders()["User-Agent"],
      viewport: { width: 1280, height: 1600 }
    });

    await page.goto(target.url, {
      waitUntil: "domcontentloaded",
      timeout: Math.max(serverConfig.scrapeTimeoutMs, 5000)
    });
    await page.waitForTimeout(900);

    const pageData = await page.evaluate(() => ({
      html: document.documentElement.outerHTML,
      text: document.body.innerText
    }));

    return productFromScrapedPage(
      target,
      extractProductFromHtml(`${pageData.html}\n${pageData.text}`)
    );
  } catch {
    return null;
  } finally {
    await browser?.close().catch(() => undefined);
  }
}

function productFromScrapedPage(
  target: ScrapeTarget,
  scraped: ScrapedPage
): Product | null {
  const price = scraped.price;

  if (!price) return null;

  const title = cleanTitle(
    scraped.title ?? target.fallbackTitle ?? `${target.retailer} product`
  );

  return {
    id: stableProductId(target.url),
    retailer: target.retailer,
    brand: target.brand ?? scraped.brand ?? target.retailer,
    title,
    price,
    originalPrice: scraped.originalPrice,
    currency: scraped.currency ?? "INR",
    image: absolutizeUrl(scraped.image ?? target.fallbackImage ?? "", target.url),
    buyUrl: target.url,
    color: target.fallbackColor ?? inferColor(title),
    sizes: target.fallbackSizes ?? ["XS", "S", "M", "L"],
    rating: 4.4,
    matchType: target.matchType,
    availability: scraped.availability,
    scrapedAt: new Date().toISOString(),
    sourceUrl: target.url
  };
}

function scraperHeaders() {
  return {
    Accept: "text/html,application/xhtml+xml",
    "Accept-Language": "en-IN,en;q=0.9",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 SVANPriceBot/0.1"
  };
}

function extractProductFromHtml(html: string): ScrapedPage {
  const jsonLd = extractJsonLdProducts(html);
  const jsonProduct = jsonLd.find((item) => item.price);
  const metaTitle =
    getMeta(html, "og:title") ??
    getMeta(html, "twitter:title") ??
    extractTagText(html, "h1") ??
    extractTagText(html, "title");
  const metaImage = getMeta(html, "og:image") ?? getMeta(html, "twitter:image");
  const prices = extractRupeePrices(html);
  const price = jsonProduct?.price ?? prices[0];
  const originalPrice = jsonProduct?.originalPrice ?? prices.find((item) => item > (price ?? 0));

  return {
    title: jsonProduct?.title ?? metaTitle,
    brand: jsonProduct?.brand,
    price,
    originalPrice,
    currency: jsonProduct?.currency ?? "INR",
    image: jsonProduct?.image ?? metaImage,
    availability: inferAvailability(html)
  };
}

function extractJsonLdProducts(html: string): ScrapedPage[] {
  const blocks = Array.from(
    html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  );

  return blocks.flatMap((block) => {
    try {
      const parsed = JSON.parse(decodeHtml(block[1]));
      return findProductObjects(parsed).map(normalizeJsonLdProduct);
    } catch {
      return [];
    }
  });
}

function findProductObjects(value: unknown): Array<Record<string, unknown>> {
  if (!value || typeof value !== "object") return [];

  if (Array.isArray(value)) return value.flatMap(findProductObjects);

  const record = value as Record<string, unknown>;
  const type = record["@type"];
  const isProduct =
    type === "Product" ||
    (Array.isArray(type) && type.some((item) => String(item).toLowerCase() === "product"));

  const nested = Object.values(record).flatMap(findProductObjects);

  return isProduct ? [record, ...nested] : nested;
}

function normalizeJsonLdProduct(record: Record<string, unknown>): ScrapedPage {
  const offers = Array.isArray(record.offers)
    ? (record.offers[0] as Record<string, unknown> | undefined)
    : (record.offers as Record<string, unknown> | undefined);
  const brand =
    typeof record.brand === "string"
      ? record.brand
      : typeof (record.brand as Record<string, unknown> | undefined)?.name === "string"
        ? String((record.brand as Record<string, unknown>).name)
        : undefined;
  const image = Array.isArray(record.image) ? record.image[0] : record.image;

  return {
    title: stringValue(record.name),
    brand,
    price: moneyValue(offers?.price ?? offers?.lowPrice),
    originalPrice: moneyValue(offers?.highPrice),
    currency: stringValue(offers?.priceCurrency),
    image: stringValue(image),
    availability: normalizeAvailability(stringValue(offers?.availability))
  };
}

function extractRupeePrices(html: string) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const matches = Array.from(
    withoutScripts.matchAll(/(?:\u20B9|Rs\.?|INR)\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/gi)
  );

  return Array.from(
    new Set(
      matches
        .map((match) => Number(match[1].replace(/,/g, "")))
        .filter((value) => Number.isFinite(value) && value > 0)
    )
  ).sort((a, b) => a - b);
}

function getMeta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const propertyPattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const contentPattern = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`,
    "i"
  );

  return decodeHtml(propertyPattern.exec(html)?.[1] ?? contentPattern.exec(html)?.[1] ?? "");
}

function extractTagText(html: string, tag: string) {
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(html);
  return match ? stripTags(decodeHtml(match[1])) : undefined;
}

function inferAvailability(html: string) {
  const text = stripTags(html).toLowerCase();
  if (text.includes("out of stock") || text.includes("sold out")) return "Out of stock";
  if (text.includes("few items left")) return "Few items left";
  if (text.includes("backordered")) return "Backordered";
  if (text.includes("ready to ship")) return "Ready to ship";
  if (text.includes("add to bag") || text.includes("add to cart")) return "Available";
  if (text.includes("notify me")) return "Coming soon";
  return undefined;
}

function normalizeAvailability(value?: string) {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (lower.includes("outofstock")) return "Out of stock";
  if (lower.includes("instock")) return "Available";
  if (lower.includes("preorder")) return "Preorder";
  return value;
}

function stableProductId(url: string) {
  return `scraped-${createHash("sha1").update(url).digest("hex").slice(0, 12)}`;
}

function cleanTitle(title: string) {
  return stripTags(title)
    .replace(/\s+\|\s+.*$/g, "")
    .replace(/\s+-\s+(H&M|ZARA|Myntra).*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferColor(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("dark brown")) return "Dark brown";
  if (lower.includes("brown")) return "Brown";
  if (lower.includes("black")) return "Black";
  return "Neutral";
}

function moneyValue(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return undefined;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeHtml(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function absolutizeUrl(url: string, baseUrl: string) {
  if (!url) return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&h=1200&q=82";

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

async function readScrapeCache(): Promise<ScrapeCache> {
  try {
    const text = await readFile(resolveCachePath(), "utf8");
    const parsed = JSON.parse(text) as Partial<ScrapeCache>;

    return {
      products: parsed.products ?? {}
    };
  } catch {
    return { products: {} };
  }
}

async function writeScrapeCache(cache: ScrapeCache) {
  const path = resolveCachePath();

  try {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    // In read-only deployments this fails harmlessly; scraping still works.
  }
}

function getFreshCachedProduct(cache: ScrapeCache, url: string) {
  const entry = cache.products[url];
  if (!entry) return null;

  const ttlMs = Math.max(serverConfig.scrapeCacheTtlHours, 1) * 60 * 60 * 1000;
  const ageMs = Date.now() - new Date(entry.fetchedAt).getTime();

  return ageMs <= ttlMs ? entry.product : null;
}

function resolveCachePath() {
  return isAbsolute(serverConfig.scrapeCacheFile)
    ? serverConfig.scrapeCacheFile
    : join(process.cwd(), serverConfig.scrapeCacheFile);
}
