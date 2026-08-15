# SVAN Real Data Setup

## Current MVP Path

Use creator/curated outfit posts for the feed, and app-native product-page scraping for the shop layer.

For the uploaded brown halter outfit, each upper/lower segment contains `scrapeTargets`. When a user opens the shop sheet, `/api/products` fetches those product pages, extracts title/price/image/availability on the server, caches the result, then returns normalized SVAN product cards.

The manual CSV stays as fallback if a retailer page blocks scraping or removes useful page metadata.

## What Was Added

- `/api/products?outfitId=...&segment=upper-wear`
- App-native product-page scraping through `scrapeTargets`
- Local scrape cache with `SVAN_SCRAPE_CACHE_FILE`
- CSV/TSV/JSON product feed ingestion
- Optional creator/curated outfit JSON ingestion
- Product normalization into SVAN's `Product` shape
- Segment-aware product ranking
- Optional Cuelinks link conversion for monetized buy links later
- Mock fallback when no real feed/API key is configured

## How To Connect Real Products

1. Add real outfit photos to `public/outfits` or upload them to a CDN.
2. Add outfit records to `data/manual-outfits.json`.
3. For each segment, add `scrapeTargets` with direct product page URLs.
4. Keep `SVAN_SCRAPE_CACHE_FILE=data/scrape-cache.json`.
5. Restart Next.js.

```powershell
cd "C:\Users\Ajayy\Documents\Codex\2026-07-27\files-mentioned-by-the-user-you"
Copy-Item .env.example .env.local
npm.cmd run dev -- -p 3000
```

## Scrape Target Shape

```json
{
  "key": "upper-wear",
  "label": "Upper Wear",
  "description": "Brown sleeveless halter neck top",
  "swatch": "#8A6539",
  "products": [],
  "scrapeTargets": [
    {
      "url": "https://www2.hm.com/en_in/productpage.1293336003.html",
      "retailer": "H&M",
      "brand": "H&M",
      "matchType": "Exact",
      "fallbackTitle": "Halterneck vest top - dark brown",
      "fallbackColor": "Dark brown",
      "fallbackSizes": ["XS", "S", "M", "L"]
    }
  ]
}
```

## Runtime Flow

```text
User opens Shop Outfit
SVAN calls /api/products
API checks scrape cache
Fresh cache -> return instantly
Stale/missing cache -> fetch product pages
Scraper extracts JSON-LD/meta/visible rupee prices
If direct fetch fails -> optional Playwright browser scrape
If scraping works -> source: scrape
If scraping fails -> CSV fallback -> source: feed
```

## Feed Fields SVAN Understands

The importer accepts common product-feed field names:

- `title`, `name`, `productname`, `product_name`
- `brand`, `brand_name`
- `retailer`, `merchant`, `merchantname`, `store`, `advertiser_name`
- `price`, `sale_price`, `saleprice`, `current_price`, `final_price`
- `original_price`, `retail_price`, `retailprice`, `mrp`
- `image`, `image_url`, `imageurl`, `image_link`, `picture`, `photo`
- `url`, `link`, `linkurl`, `product_url`, `tracking_url`
- `color`, `colour`
- `sizes`, `size`, `available_sizes`

## Outfit JSON Shape

`SVAN_OUTFIT_FEED_FILE` can point to either an array of outfits or an object with an `outfits` array. Each outfit can include full SVAN fields, but only these are required:

```json
[
  {
    "id": "creator-look-001",
    "title": "Clean girl white shirt and denim",
    "image": "https://your-cdn.com/outfits/look-001.jpg",
    "caption": "Crisp cotton, straight denim, soft gold.",
    "style": "Clean girl",
    "aesthetics": ["clean-girl", "minimalist"],
    "tags": ["white shirt", "straight jeans", "minimal outfit"],
    "creator": {
      "username": "realcreator",
      "displayName": "Real Creator",
      "avatar": "https://your-cdn.com/creators/realcreator.jpg"
    }
  }
]
```

## Important

Do not bypass captchas, login walls, private APIs, or anti-bot systems. For production, move the cache from a local JSON file to Postgres/Redis and refresh scrape jobs in the background instead of during a user request. Browser scraping is controlled by `SVAN_ENABLE_BROWSER_SCRAPER`.
