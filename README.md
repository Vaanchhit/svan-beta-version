# SVAN

SVAN is a mobile-first social fashion webapp prototype built with Next.js. It includes a glossy black UI, outfit feed, aesthetic search rails, outfit detail pages, upper/lower-wear product aggregation, account signup/login, and persistent likes/saves.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Account Flow

- Go to `/account` or tap the profile icon.
- Create an account with name, email, and password.
- Like or save outfits from the feed or outfit detail page.
- Likes and saves persist in `data/account-db.json` and show up in `/liked`, `/saved`, and your profile.

## Product Data

The project includes curated local product/outfit files in `data/`. Runtime product-page scraping is optional and controlled by `.env.local`.

If Playwright browser scraping is needed on a fresh machine, run:

```bash
npx playwright install chromium
```

The app still runs without that command; it falls back to the saved local product catalog.
# svan-beta-version
