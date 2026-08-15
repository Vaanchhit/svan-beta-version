import type { Outfit, Product, Profile, Retailer, SegmentKey } from "@/types";

const image = (id: string, height = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&h=${height}&q=82`;

const creators = {
  mira: {
    username: "mirakapoor",
    displayName: "Mira Kapoor",
    avatar: image("photo-1494790108377-be9c29b29330", 900),
    verified: true
  },
  naina: {
    username: "naina.styles",
    displayName: "Naina Iyer",
    avatar: image("photo-1534528741775-53994a69daeb", 900),
    verified: true
  },
  arjun: {
    username: "arjunwears",
    displayName: "Arjun Mehta",
    avatar: image("photo-1500648767791-00dcc994a43e", 900)
  },
  zoya: {
    username: "zoya.archive",
    displayName: "Zoya Rahman",
    avatar: image("photo-1524504388940-b1c1722653e1", 900)
  },
  rhea: {
    username: "rheainlayers",
    displayName: "Rhea Sen",
    avatar: image("photo-1520813792240-56fc4a3765a7", 900)
  }
};

const retailerUrl: Record<Retailer, string> = {
  Myntra: "https://www.myntra.com",
  "H&M": "https://www2.hm.com",
  Zara: "https://www.zara.com",
  Urbanic: "https://www.urbanic.com"
};

function product(
  id: string,
  retailer: Retailer,
  brand: string,
  title: string,
  price: number,
  photoId: string,
  color: string,
  originalPrice?: number
): Product {
  return {
    id,
    retailer,
    brand,
    title,
    price,
    originalPrice,
    currency: "INR",
    image: image(photoId, 1200),
    buyUrl: retailerUrl[retailer],
    color,
    sizes: ["XS", "S", "M", "L"],
    rating: 4.4 + (price % 4) / 10
  };
}

function segment(
  key: SegmentKey,
  label: string,
  description: string,
  swatch: string,
  products: Product[]
) {
  return { key, label, description, swatch, products };
}

export const outfits: Outfit[] = [
  {
    id: "brown-lace-city",
    title: "Brown lace top with tailored denim",
    image: image("photo-1529139574466-a303027c1d8b", 1500),
    imageAlt: "Model in a brown lace top and tailored jeans on a city street",
    creator: creators.mira,
    location: "Bandra, Mumbai",
    caption:
      "Soft lace, structured denim, barely-there gold. Saving this for late coffee plans.",
    likeCount: 18420,
    commentCount: 248,
    saveCount: 3910,
    postedAt: "2026-07-27T08:45:00.000Z",
    occasion: "Coffee",
    season: "Monsoon",
    style: "Romantic minimal",
    aesthetics: ["date", "minimalist", "clean-girl", "monsoon"],
    tags: ["brown lace top", "denim", "coffee look", "neutral outfit"],
    palette: ["#4A2D23", "#D9C7B7", "#1B2734", "#F7F5EF"],
    segments: [
      segment("upper-wear", "Upper Wear", "Brown lace cami and soft knit alternatives", "#4A2D23", [
        product("p-lace-myntra-1", "Myntra", "SASSAFRAS", "Chocolate lace camisole", 1299, "photo-1581044777550-4cfa60707c03", "Chocolate", 1999),
        product("p-lace-hm-1", "H&M", "H&M", "Lace-trim satin top", 1499, "photo-1521572163474-6864f9cf17ab", "Mocha"),
        product("p-lace-zara-1", "Zara", "Zara", "Semi-sheer lace blouse", 2890, "photo-1485462537746-965f33f7f6a7", "Walnut"),
        product("p-lace-urbanic-1", "Urbanic", "Urbanic", "Corset lace crop top", 1590, "photo-1594633312681-425c7b97ccd1", "Espresso", 2190)
      ]),
      segment("lower-wear", "Lower Wear", "Clean straight-leg denim with a sharp waist", "#1B2734", [
        product("p-denim-myntra-1", "Myntra", "Levis", "High-rise straight jeans", 3199, "photo-1541099649105-f69ad21f3246", "Indigo", 4599),
        product("p-denim-hm-1", "H&M", "H&M", "Vintage straight jeans", 2299, "photo-1475178626620-a4d074967452", "Deep Blue"),
        product("p-denim-zara-1", "Zara", "Zara", "Full length slim jeans", 2990, "photo-1515886657613-9f3515b0c78f", "Washed Navy"),
        product("p-denim-urbanic-1", "Urbanic", "Urbanic", "Panelled relaxed denim", 1990, "photo-1542272604-787c3835535d", "Blue", 2490)
      ])
    ]
  },
  {
    id: "monochrome-market",
    title: "Monochrome market run",
    image: image("photo-1515886657613-9f3515b0c78f", 1500),
    imageAlt: "Street style monochrome outfit with relaxed layers",
    creator: creators.naina,
    location: "Indiranagar, Bengaluru",
    caption:
      "The whole point was looking unbothered while secretly planning every proportion.",
    likeCount: 12110,
    commentCount: 173,
    saveCount: 2842,
    postedAt: "2026-07-26T17:20:00.000Z",
    occasion: "Weekend",
    season: "All Season",
    style: "Monochrome street",
    aesthetics: ["street", "minimalist", "y2k", "clean-girl"],
    tags: ["monochrome", "wide leg", "street style", "black outfit"],
    palette: ["#050505", "#E8E2D8", "#8C8C84", "#2D2A25"],
    segments: [
      segment("upper-wear", "Upper Wear", "Crisp tanks and sculpted black tops", "#050505", [
        product("p-black-myntra-1", "Myntra", "MANGO", "Ribbed square-neck top", 1890, "photo-1434389677669-e08b4cac3105", "Black"),
        product("p-black-hm-1", "H&M", "H&M", "Fitted cotton vest top", 799, "photo-1521572163474-6864f9cf17ab", "Black"),
        product("p-black-zara-1", "Zara", "Zara", "Asymmetric knit top", 2590, "photo-1558769132-cb1aea458c5e", "Black"),
        product("p-black-urbanic-1", "Urbanic", "Urbanic", "Minimal halter top", 1190, "photo-1594633312681-425c7b97ccd1", "Jet Black")
      ]),
      segment("lower-wear", "Lower Wear", "Relaxed cream trousers with movement", "#E8E2D8", [
        product("p-cream-myntra-1", "Myntra", "Marks & Spencer", "Pleated wide-leg trousers", 3499, "photo-1503342217505-b0a15ec3261c", "Ivory", 4999),
        product("p-cream-hm-1", "H&M", "H&M", "Linen-blend pull-on trousers", 2299, "photo-1483985988355-763728e1935b", "Natural White"),
        product("p-cream-zara-1", "Zara", "Zara", "Flowing palazzo pants", 3290, "photo-1529139574466-a303027c1d8b", "Ecru"),
        product("p-cream-urbanic-1", "Urbanic", "Urbanic", "Tailored foldover trousers", 2090, "photo-1541099649105-f69ad21f3246", "Cream")
      ])
    ]
  },
  {
    id: "linen-airport",
    title: "Quiet airport linen",
    image: image("photo-1496747611176-843222e1e57c", 1500),
    imageAlt: "Cream linen shirt with charcoal trousers",
    creator: creators.arjun,
    location: "Terminal 2, Delhi",
    caption:
      "Airport fit formula: breathable shirt, clean trousers, shoes you can actually walk in.",
    likeCount: 9340,
    commentCount: 96,
    saveCount: 2190,
    postedAt: "2026-07-26T06:10:00.000Z",
    occasion: "Travel",
    season: "Summer",
    style: "Quiet luxury",
    aesthetics: ["travel", "summer", "minimalist", "clean-girl"],
    tags: ["linen shirt", "travel outfit", "menswear", "neutral tailoring"],
    palette: ["#EEE6D8", "#252525", "#866F58", "#FFFFFF"],
    segments: [
      segment("upper-wear", "Upper Wear", "Open-weave shirts and travel layers", "#EEE6D8", [
        product("p-linen-myntra-1", "Myntra", "MANGO Man", "Regular fit linen shirt", 2990, "photo-1591047139829-d91aecb6caea", "Oat"),
        product("p-linen-hm-1", "H&M", "H&M", "Relaxed resort shirt", 1799, "photo-1521572163474-6864f9cf17ab", "Natural White"),
        product("p-linen-zara-1", "Zara", "Zara", "Textured linen overshirt", 3990, "photo-1516257984-b1b4d707412e", "Stone"),
        product("p-linen-urbanic-1", "Urbanic", "Urbanic", "Boxy linen-blend shirt", 1890, "photo-1434389677669-e08b4cac3105", "Cream")
      ]),
      segment("lower-wear", "Lower Wear", "Tapered charcoal trousers for long flights", "#252525", [
        product("p-charcoal-myntra-1", "Myntra", "Selected Homme", "Slim tapered trousers", 2799, "photo-1473966968600-fa801b869a1a", "Charcoal", 3999),
        product("p-charcoal-hm-1", "H&M", "H&M", "Relaxed twill trousers", 1999, "photo-1542272604-787c3835535d", "Dark Grey"),
        product("p-charcoal-zara-1", "Zara", "Zara", "Pleated technical trousers", 4290, "photo-1506629905607-d9d297d14c76", "Graphite"),
        product("p-charcoal-urbanic-1", "Urbanic", "Urbanic", "Clean ankle trousers", 1690, "photo-1515886657613-9f3515b0c78f", "Coal")
      ])
    ]
  },
  {
    id: "emerald-evening",
    title: "Emerald evening balance",
    image: image("photo-1509631179647-0177331693ae", 1500),
    imageAlt: "Emerald top with black evening skirt",
    creator: creators.zoya,
    location: "Kala Ghoda, Mumbai",
    caption:
      "A little gloss, a lot of restraint. Forest green might be the whole personality tonight.",
    likeCount: 20780,
    commentCount: 319,
    saveCount: 5520,
    postedAt: "2026-07-25T20:02:00.000Z",
    occasion: "Evening",
    season: "Monsoon",
    style: "Modern evening",
    aesthetics: ["evening", "date", "minimalist", "monsoon"],
    tags: ["green top", "evening outfit", "black skirt", "minimal glam"],
    palette: ["#0F4C3A", "#050505", "#D8D2C8", "#B59D69"],
    segments: [
      segment("upper-wear", "Upper Wear", "Satin and knit tops in deep green", "#0F4C3A", [
        product("p-emerald-myntra-1", "Myntra", "Forever New", "Satin cowl-neck top", 2799, "photo-1581044777550-4cfa60707c03", "Emerald", 3499),
        product("p-emerald-hm-1", "H&M", "H&M", "Fine-knit off-shoulder top", 1499, "photo-1521572163474-6864f9cf17ab", "Dark Green"),
        product("p-emerald-zara-1", "Zara", "Zara", "Draped satin blouse", 3590, "photo-1485462537746-965f33f7f6a7", "Bottle Green"),
        product("p-emerald-urbanic-1", "Urbanic", "Urbanic", "Glossy ruched crop", 1690, "photo-1594633312681-425c7b97ccd1", "Forest")
      ]),
      segment("lower-wear", "Lower Wear", "Black midi skirts with a clean fall", "#050505", [
        product("p-skirt-myntra-1", "Myntra", "MANGO", "Satin bias-cut midi skirt", 3490, "photo-1539109136881-3be0616acf4b", "Black"),
        product("p-skirt-hm-1", "H&M", "H&M", "A-line jersey skirt", 1299, "photo-1503342217505-b0a15ec3261c", "Black"),
        product("p-skirt-zara-1", "Zara", "Zara", "High-waist pencil skirt", 2990, "photo-1581044777550-4cfa60707c03", "Black"),
        product("p-skirt-urbanic-1", "Urbanic", "Urbanic", "Flowy slit midi skirt", 1790, "photo-1483985988355-763728e1935b", "Onyx")
      ])
    ]
  },
  {
    id: "rainy-day-cocoa",
    title: "Rainy day cocoa layers",
    image: image("photo-1524504388940-b1c1722653e1", 1500),
    imageAlt: "Layered cocoa knit with a black mini skirt",
    creator: creators.rhea,
    location: "Koregaon Park, Pune",
    caption:
      "A cropped knit and skirt when the weather wants drama but the plans are casual.",
    likeCount: 7820,
    commentCount: 88,
    saveCount: 1964,
    postedAt: "2026-07-25T12:35:00.000Z",
    occasion: "Date Night",
    season: "Monsoon",
    style: "Soft grunge",
    aesthetics: ["date", "y2k", "monsoon", "street"],
    tags: ["cocoa knit", "mini skirt", "monsoon outfit", "date night"],
    palette: ["#6B4735", "#111111", "#E3D5C7", "#6D7178"],
    segments: [
      segment("upper-wear", "Upper Wear", "Cropped knits and ribbed cocoa textures", "#6B4735", [
        product("p-cocoa-myntra-1", "Myntra", "ONLY", "Ribbed cropped cardigan", 1899, "photo-1558769132-cb1aea458c5e", "Cocoa", 2699),
        product("p-cocoa-hm-1", "H&M", "H&M", "Short fine-knit cardigan", 1499, "photo-1591047139829-d91aecb6caea", "Brown"),
        product("p-cocoa-zara-1", "Zara", "Zara", "Soft knit button top", 2890, "photo-1434389677669-e08b4cac3105", "Taupe Brown"),
        product("p-cocoa-urbanic-1", "Urbanic", "Urbanic", "Fitted knit wrap top", 1590, "photo-1521572163474-6864f9cf17ab", "Mocha")
      ]),
      segment("lower-wear", "Lower Wear", "Black mini and skort options", "#111111", [
        product("p-mini-myntra-1", "Myntra", "H&M", "Tailored mini skirt", 1499, "photo-1539109136881-3be0616acf4b", "Black"),
        product("p-mini-hm-1", "H&M", "H&M", "Twill wrap skort", 1299, "photo-1483985988355-763728e1935b", "Black"),
        product("p-mini-zara-1", "Zara", "Zara", "Pleated mini skirt", 2790, "photo-1503342217505-b0a15ec3261c", "Black"),
        product("p-mini-urbanic-1", "Urbanic", "Urbanic", "Low-rise cargo mini", 1690, "photo-1541099649105-f69ad21f3246", "Washed Black")
      ])
    ]
  },
  {
    id: "soft-workwear",
    title: "Soft workwear, no stiffness",
    image: image("photo-1483985988355-763728e1935b", 1500),
    imageAlt: "Oversized blazer with relaxed trousers",
    creator: creators.naina,
    location: "Cyber Hub, Gurugram",
    caption:
      "Boardroom lines, weekend softness. The bag does all the punctuation.",
    likeCount: 14550,
    commentCount: 202,
    saveCount: 4160,
    postedAt: "2026-07-24T09:00:00.000Z",
    occasion: "Work",
    season: "All Season",
    style: "Relaxed tailoring",
    aesthetics: ["workwear", "minimalist", "clean-girl"],
    tags: ["workwear", "blazer", "tailored trousers", "office outfit"],
    palette: ["#B9AA97", "#0F0F0F", "#EFE7DA", "#6A655D"],
    segments: [
      segment("upper-wear", "Upper Wear", "Unstructured blazers and clean vests", "#B9AA97", [
        product("p-blazer-myntra-1", "Myntra", "MANGO", "Oversized linen blazer", 5990, "photo-1548454782-15b189d129ab", "Sand", 7990),
        product("p-blazer-hm-1", "H&M", "H&M", "Single-breasted blazer", 3499, "photo-1516257984-b1b4d707412e", "Beige"),
        product("p-blazer-zara-1", "Zara", "Zara", "Flowy relaxed blazer", 5590, "photo-1591047139829-d91aecb6caea", "Stone"),
        product("p-blazer-urbanic-1", "Urbanic", "Urbanic", "Longline clean blazer", 2890, "photo-1434389677669-e08b4cac3105", "Mushroom")
      ]),
      segment("lower-wear", "Lower Wear", "Black relaxed trousers for repeat wear", "#0F0F0F", [
        product("p-work-pant-myntra-1", "Myntra", "MANGO", "Straight tailored trousers", 3590, "photo-1473966968600-fa801b869a1a", "Black"),
        product("p-work-pant-hm-1", "H&M", "H&M", "Wide suit trousers", 2699, "photo-1506629905607-d9d297d14c76", "Black"),
        product("p-work-pant-zara-1", "Zara", "Zara", "High-waist relaxed pants", 3990, "photo-1542272604-787c3835535d", "Black"),
        product("p-work-pant-urbanic-1", "Urbanic", "Urbanic", "Pleated long trousers", 2290, "photo-1515886657613-9f3515b0c78f", "Black")
      ])
    ]
  },
  {
    id: "gallery-denim",
    title: "Gallery denim and white cotton",
    image: image("photo-1539109136881-3be0616acf4b", 1500),
    imageAlt: "White cotton blouse styled with a dark denim skirt",
    creator: creators.zoya,
    location: "Fort, Mumbai",
    caption:
      "White cotton is never basic when the shapes are this clean.",
    likeCount: 11320,
    commentCount: 144,
    saveCount: 3074,
    postedAt: "2026-07-23T18:12:00.000Z",
    occasion: "Weekend",
    season: "Summer",
    style: "Gallery casual",
    aesthetics: ["summer", "clean-girl", "minimalist"],
    tags: ["white blouse", "denim skirt", "gallery outfit", "summer cotton"],
    palette: ["#F7F5EF", "#1B2734", "#AAB0B7", "#050505"],
    segments: [
      segment("upper-wear", "Upper Wear", "White cotton blouses with quiet detail", "#F7F5EF", [
        product("p-white-myntra-1", "Myntra", "MANGO", "Cotton broderie blouse", 2790, "photo-1485462537746-965f33f7f6a7", "White"),
        product("p-white-hm-1", "H&M", "H&M", "Balloon-sleeve cotton shirt", 1499, "photo-1521572163474-6864f9cf17ab", "White"),
        product("p-white-zara-1", "Zara", "Zara", "Poplin wrap blouse", 3290, "photo-1591047139829-d91aecb6caea", "Off White"),
        product("p-white-urbanic-1", "Urbanic", "Urbanic", "Tie-front cotton top", 1690, "photo-1434389677669-e08b4cac3105", "Cream")
      ]),
      segment("lower-wear", "Lower Wear", "Structured denim skirts and longline options", "#1B2734", [
        product("p-denim-skirt-myntra-1", "Myntra", "Levis", "A-line denim midi skirt", 2999, "photo-1541099649105-f69ad21f3246", "Indigo"),
        product("p-denim-skirt-hm-1", "H&M", "H&M", "Denim pencil skirt", 1899, "photo-1542272604-787c3835535d", "Dark Denim"),
        product("p-denim-skirt-zara-1", "Zara", "Zara", "Long denim skirt", 3590, "photo-1515886657613-9f3515b0c78f", "Blue"),
        product("p-denim-skirt-urbanic-1", "Urbanic", "Urbanic", "Slit denim midi", 2190, "photo-1475178626620-a4d074967452", "Navy")
      ])
    ]
  },
  {
    id: "weekend-cargo",
    title: "Weekend cargo polish",
    image: image("photo-1551232864-3f0890e580d9", 1500),
    imageAlt: "Fitted white top with olive cargo trousers",
    creator: creators.rhea,
    location: "Juhu, Mumbai",
    caption:
      "Cargo pants, but make the lines deliberate. Saved for errands that become dinner.",
    likeCount: 16720,
    commentCount: 231,
    saveCount: 4898,
    postedAt: "2026-07-22T16:50:00.000Z",
    occasion: "Weekend",
    season: "All Season",
    style: "Utility minimal",
    aesthetics: ["street", "y2k", "minimalist"],
    tags: ["cargo pants", "white tank", "utility outfit", "weekend style"],
    palette: ["#F7F5EF", "#546045", "#171717", "#C8B9A8"],
    segments: [
      segment("upper-wear", "Upper Wear", "Fitted white tanks and contour basics", "#F7F5EF", [
        product("p-tank-myntra-1", "Myntra", "MANGO", "Contour rib tank top", 1290, "photo-1521572163474-6864f9cf17ab", "White"),
        product("p-tank-hm-1", "H&M", "H&M", "Cotton vest top", 699, "photo-1434389677669-e08b4cac3105", "White"),
        product("p-tank-zara-1", "Zara", "Zara", "Wide-strap knit top", 1890, "photo-1558769132-cb1aea458c5e", "Ivory"),
        product("p-tank-urbanic-1", "Urbanic", "Urbanic", "Sculpted square tank", 990, "photo-1594633312681-425c7b97ccd1", "Pearl")
      ]),
      segment("lower-wear", "Lower Wear", "Olive cargos with a cleaner silhouette", "#546045", [
        product("p-cargo-myntra-1", "Myntra", "MANGO", "Straight cargo trousers", 3290, "photo-1506629905607-d9d297d14c76", "Olive"),
        product("p-cargo-hm-1", "H&M", "H&M", "Parachute cargo pants", 2299, "photo-1542272604-787c3835535d", "Khaki Green"),
        product("p-cargo-zara-1", "Zara", "Zara", "Utility pocket trousers", 3990, "photo-1473966968600-fa801b869a1a", "Army Green"),
        product("p-cargo-urbanic-1", "Urbanic", "Urbanic", "Relaxed low-rise cargos", 2090, "photo-1541099649105-f69ad21f3246", "Olive")
      ])
    ]
  }
];

export const profiles: Profile[] = [
  {
    username: "mirakapoor",
    displayName: "Mira Kapoor",
    avatar: creators.mira.avatar,
    bio: "Romantic minimal outfits, city walks, and pieces worth repeating.",
    followerCount: 128400,
    followingCount: 420,
    outfitIds: ["brown-lace-city"],
    savedIds: ["emerald-evening", "soft-workwear", "weekend-cargo"],
    likedIds: ["monochrome-market", "linen-airport", "gallery-denim"]
  },
  {
    username: "naina.styles",
    displayName: "Naina Iyer",
    avatar: creators.naina.avatar,
    bio: "Stylist notes from Bengaluru. Neutrals, volume, and quiet color.",
    followerCount: 94200,
    followingCount: 612,
    outfitIds: ["monochrome-market", "soft-workwear"],
    savedIds: ["brown-lace-city", "gallery-denim", "emerald-evening"],
    likedIds: ["rainy-day-cocoa", "weekend-cargo"]
  },
  {
    username: "arjunwears",
    displayName: "Arjun Mehta",
    avatar: creators.arjun.avatar,
    bio: "Menswear that works from airport lounges to 7 PM dinners.",
    followerCount: 58300,
    followingCount: 318,
    outfitIds: ["linen-airport"],
    savedIds: ["soft-workwear", "monochrome-market"],
    likedIds: ["brown-lace-city", "emerald-evening"]
  }
];
