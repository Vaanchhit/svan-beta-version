export type SegmentKey = "upper-wear" | "lower-wear";

export type SortOption = "recommended" | "price-low" | "price-high";

export type Season = "Summer" | "Monsoon" | "Autumn" | "Winter" | "All Season";

export type Occasion =
  | "Coffee"
  | "Date Night"
  | "Work"
  | "Weekend"
  | "Travel"
  | "Evening";

export type Retailer = string;

export interface Creator {
  username: string;
  displayName: string;
  avatar: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  retailer: Retailer;
  brand: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  buyUrl: string;
  color: string;
  sizes: string[];
  rating: number;
  matchType?: "Exact" | "Close" | "Substitute";
  availability?: string;
  scrapedAt?: string;
  sourceUrl?: string;
}

export interface ScrapeTarget {
  url: string;
  retailer: string;
  brand?: string;
  matchType?: Product["matchType"];
  fallbackTitle?: string;
  fallbackImage?: string;
  fallbackColor?: string;
  fallbackSizes?: string[];
}

export interface OutfitSegment {
  key: SegmentKey;
  label: string;
  description: string;
  swatch: string;
  products: Product[];
  scrapeTargets?: ScrapeTarget[];
}

export interface Outfit {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  creator: Creator;
  location?: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  viewerLiked?: boolean;
  viewerSaved?: boolean;
  postedAt: string;
  occasion: Occasion;
  season: Season;
  style: string;
  aesthetics: string[];
  tags: string[];
  palette: string[];
  segments: OutfitSegment[];
}

export interface Profile {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  outfitIds: string[];
  savedIds: string[];
  likedIds: string[];
  isViewer?: boolean;
}

export interface FeedResponse {
  outfits: Outfit[];
}

export interface SearchResponse {
  query: string;
  genre?: string;
  results: Outfit[];
  nextCursor: string | null;
}

export interface OutfitResponse {
  outfit: Outfit;
}

export interface ProfileResponse {
  profile: Profile;
  outfits: Outfit[];
  saved: Outfit[];
  liked: Outfit[];
}

export interface ProductCatalogResponse {
  products: Product[];
  source: "scrape" | "feed" | "mock";
  provider: string;
  query: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
}

export interface AuthResponse {
  user: AuthUser | null;
}

export interface InteractionResponse {
  outfitId: string;
  liked: boolean;
  saved: boolean;
  likeCount: number;
  saveCount: number;
}

export interface UploadDraft {
  imageUrl?: string;
  caption: string;
  tags: string[];
  occasion: Occasion;
  season: Season;
  style: string;
  palette: string[];
}
