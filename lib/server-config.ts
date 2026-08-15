export const serverConfig = {
  productFeedUrls: (process.env.SVAN_PRODUCT_FEED_URLS ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  productFeedFile: process.env.SVAN_PRODUCT_FEED_FILE?.trim() ?? "",
  outfitFeedFile: process.env.SVAN_OUTFIT_FEED_FILE?.trim() ?? "",
  scrapeCacheFile:
    process.env.SVAN_SCRAPE_CACHE_FILE?.trim() ?? "data/scrape-cache.json",
  scrapeCacheTtlHours: Number(process.env.SVAN_SCRAPE_CACHE_TTL_HOURS ?? 12),
  scrapeTimeoutMs: Number(process.env.SVAN_SCRAPE_TIMEOUT_MS ?? 8000),
  enableBrowserScraper:
    (process.env.SVAN_ENABLE_BROWSER_SCRAPER ?? "true").toLowerCase() !== "false",
  cuelinksApiKey: process.env.CUELINKS_API_KEY?.trim() ?? "",
  cuelinksBaseUrl:
    process.env.CUELINKS_BASE_URL?.trim() ??
    "https://developers.cuelinks.com/pub_api/v3"
};

export function hasConfiguredProductFeed() {
  return Boolean(
    serverConfig.productFeedFile || serverConfig.productFeedUrls.length > 0
  );
}
