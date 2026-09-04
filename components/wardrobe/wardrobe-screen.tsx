"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Archive,
  ExternalLink,
  Filter,
  Layers3,
  Plus,
  Shirt,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { GridLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { formatPrice } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";
import type { Occasion, Outfit, Product, SegmentKey } from "@/types";

type WardrobeFilter = "all" | "summer" | "date" | "black" | "shoes" | "recent";

interface WardrobeItem {
  id: string;
  category: "Tops" | "Bottoms" | "Shoes" | "Bags" | "Accessories";
  segmentKey: SegmentKey;
  product: Product;
  sourceOutfit: Outfit;
}

const filters: Array<{ value: WardrobeFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "summer", label: "Summer clothes" },
  { value: "date", label: "Date night" },
  { value: "black", label: "Everything black" },
  { value: "shoes", label: "Shoes" },
  { value: "recent", label: "Saved recently" }
];

export function WardrobeScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { saved, isLoading, error } = useProfile(user?.username ?? "me");
  const [opened, setOpened] = useState(false);
  const [filter, setFilter] = useState<WardrobeFilter>("all");
  const [activeItem, setActiveItem] = useState<WardrobeItem | null>(null);
  const [styleItem, setStyleItem] = useState<WardrobeItem | null>(null);

  const wardrobeItems = useMemo(() => createWardrobeItems(saved), [saved]);
  const visibleItems = useMemo(
    () => filterWardrobeItems(wardrobeItems, filter),
    [filter, wardrobeItems]
  );
  const groupedItems = useMemo(() => groupByCategory(visibleItems), [visibleItems]);
  const canvasItems = useMemo(() => {
    if (!styleItem) return [];
    const companions = wardrobeItems
      .filter((item) => item.id !== styleItem.id)
      .filter((item) => item.category !== styleItem.category)
      .slice(0, 3);
    return [styleItem, ...companions];
  }, [styleItem, wardrobeItems]);

  if (authLoading || isLoading) return <GridLoadingSkeleton />;

  if (!user) {
    return (
      <section className="flex min-h-dvh items-center justify-center px-5 py-24">
        <div className="glass max-w-md rounded-[1.15rem] p-6 text-center">
          <Archive className="mx-auto h-8 w-8 text-bronze-soft" />
          <h1 className="display-editorial mt-4 text-5xl leading-none text-white">
            My Wardrobe
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Log in to open your saved looks as a private digital wardrobe.
          </p>
          <Button className="mt-6" onClick={() => router.push("/account?next=/saved")}>
            Log in
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-dvh pb-28">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-carbon/72 px-4 pb-4 pt-5 backdrop-blur-2xl mobile-safe-top md:px-8">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Back"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="label-editorial text-white/38">Private to @{user.username}</p>
            <h1 className="display-editorial text-4xl leading-none text-white md:text-5xl">
              My Wardrobe
            </h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpened((value) => !value)}
        >
          <Archive className="h-4 w-4" />
          {opened ? "Close" : "Open"}
        </Button>
      </header>

      {error ? (
        <div className="px-5 py-16 text-center text-sm text-white/50">{error}</div>
      ) : null}

      <div className="px-4 pt-5 md:px-8">
        <div className="wardrobe-perspective relative mx-auto max-w-6xl">
          <motion.div
            className="relative min-h-[34rem] overflow-hidden rounded-[1.15rem] border border-white/12 bg-[#120c09] shadow-[0_36px_110px_rgba(0,0,0,0.6)] md:min-h-[44rem]"
            animate={{ scale: opened ? 1 : 0.985 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <WardrobeInterior
              groupedItems={groupedItems}
              itemCount={visibleItems.length}
              onInspect={setActiveItem}
              onStyle={(item) => {
                setStyleItem(item);
                setActiveItem(null);
              }}
            />

            <AnimatePresence>
              {!opened ? (
                <motion.button
                  type="button"
                  data-cursor="Open"
                  className="absolute inset-0 z-20 grid place-items-center overflow-hidden text-left"
                  onClick={() => setOpened(true)}
                  exit={{ opacity: 0 }}
                >
                  <motion.span
                    className="wardrobe-wood absolute inset-y-0 left-0 w-1/2 origin-left border-r border-black/50"
                    exit={{ rotateY: -24, x: "-78%" }}
                    transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.span
                    className="wardrobe-wood absolute inset-y-0 right-0 w-1/2 origin-right border-l border-white/10"
                    exit={{ rotateY: 24, x: "78%" }}
                    transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <span className="absolute left-1/2 top-1/2 z-10 h-24 w-1 -translate-x-4 -translate-y-1/2 rounded-full bg-gradient-to-b from-bronze-soft to-bronze shadow-bronze" />
                  <span className="absolute left-1/2 top-1/2 z-10 h-24 w-1 translate-x-4 -translate-y-1/2 rounded-full bg-gradient-to-b from-bronze-soft to-bronze shadow-bronze" />
                  <motion.span
                    className="relative z-10 flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Sparkles className="h-7 w-7 text-bronze-soft" />
                    <span className="display-editorial mt-4 text-6xl leading-none text-white md:text-8xl">
                      Open wardrobe
                    </span>
                    <span className="mt-3 max-w-xs text-center text-sm leading-6 text-white/58">
                      Saved looks become rails, shelves, and pieces you can inspect.
                    </span>
                  </motion.span>
                </motion.button>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          className="no-scrollbar mx-auto mt-5 flex max-w-6xl gap-2 overflow-x-auto pb-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: opened ? 1 : 0.35, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              data-cursor="Filter"
              className={`fashion-focus magnetic flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] transition ${
                filter === item.value
                  ? "border-bronze/70 bg-bronze/18 text-white"
                  : "border-white/10 bg-white/[0.05] text-white/58"
              }`}
              onClick={() => setFilter(item.value)}
            >
              <Filter className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </motion.div>

        {styleItem ? (
          <StyleCanvas
            items={canvasItems}
            onClose={() => setStyleItem(null)}
          />
        ) : null}
      </div>

      <AnimatePresence>
        {activeItem ? (
          <ItemInspector
            item={activeItem}
            onClose={() => setActiveItem(null)}
            onStyle={() => {
              setStyleItem(activeItem);
              setActiveItem(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function WardrobeInterior({
  groupedItems,
  itemCount,
  onInspect,
  onStyle
}: {
  groupedItems: Record<WardrobeItem["category"], WardrobeItem[]>;
  itemCount: number;
  onInspect: (item: WardrobeItem) => void;
  onStyle: (item: WardrobeItem) => void;
}) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(247,245,239,0.16),transparent_34%),linear-gradient(180deg,rgba(46,28,18,0.94),rgba(12,8,6,0.98))] p-4 md:p-7">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="label-editorial text-white/38">Inside</p>
          <h2 className="display-editorial text-5xl leading-none text-white md:text-7xl">
            {itemCount} saved pieces
          </h2>
        </div>
        <div className="hidden rounded-[0.85rem] border border-white/10 bg-black/22 p-3 text-xs leading-5 text-white/50 md:block">
          Pieces keep their source creator and look context.
        </div>
      </div>

      <div className="grid min-h-[25rem] gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <WardrobeRail
          title="Hanging rail"
          items={[...groupedItems.Tops, ...groupedItems.Bottoms].slice(0, 8)}
          onInspect={onInspect}
          onStyle={onStyle}
        />
        <div className="grid gap-4">
          <WardrobeShelf
            title="Shelves"
            items={[...groupedItems.Shoes, ...groupedItems.Bags].slice(0, 6)}
            onInspect={onInspect}
            onStyle={onStyle}
          />
          <WardrobeShelf
            title="Drawer"
            items={groupedItems.Accessories.slice(0, 6)}
            onInspect={onInspect}
            onStyle={onStyle}
          />
        </div>
      </div>
    </div>
  );
}

function WardrobeRail({
  title,
  items,
  onInspect,
  onStyle
}: {
  title: string;
  items: WardrobeItem[];
  onInspect: (item: WardrobeItem) => void;
  onStyle: (item: WardrobeItem) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-black/20 p-4">
      <div className="wardrobe-shelf absolute left-4 right-4 top-16 h-2 rounded-full" />
      <p className="label-editorial relative z-10 text-white/42">{title}</p>
      <div className="relative z-10 mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.length ? (
          items.map((item, index) => (
            <WardrobePiece
              key={item.id}
              item={item}
              index={index}
              mode="hanger"
              onInspect={onInspect}
              onStyle={onStyle}
            />
          ))
        ) : (
          <EmptyWardrobeSection label="Save looks to fill the rail." />
        )}
      </div>
    </div>
  );
}

function WardrobeShelf({
  title,
  items,
  onInspect,
  onStyle
}: {
  title: string;
  items: WardrobeItem[];
  onInspect: (item: WardrobeItem) => void;
  onStyle: (item: WardrobeItem) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-black/20 p-4">
      <p className="label-editorial text-white/42">{title}</p>
      <div className="wardrobe-shelf mt-3 h-2 rounded-full" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        {items.length ? (
          items.map((item, index) => (
            <WardrobePiece
              key={item.id}
              item={item}
              index={index}
              mode="shelf"
              onInspect={onInspect}
              onStyle={onStyle}
            />
          ))
        ) : (
          <EmptyWardrobeSection label="Nothing on this shelf yet." />
        )}
      </div>
    </div>
  );
}

function WardrobePiece({
  item,
  index,
  mode,
  onInspect,
  onStyle
}: {
  item: WardrobeItem;
  index: number;
  mode: "hanger" | "shelf";
  onInspect: (item: WardrobeItem) => void;
  onStyle: (item: WardrobeItem) => void;
}) {
  return (
    <motion.div
      className={mode === "hanger" ? "pt-5" : ""}
      layout
      initial={{ opacity: 0, y: 18, rotate: mode === "hanger" ? -2 : 0 }}
      animate={{ opacity: 1, y: 0, rotate: mode === "hanger" ? (index % 2 ? 1.5 : -1.5) : 0 }}
      transition={{ duration: 0.38, delay: Math.min(index * 0.035, 0.2) }}
    >
      {mode === "hanger" ? (
        <span className="mx-auto -mb-1 block h-4 w-px bg-white/24" />
      ) : null}
      <button
        type="button"
        data-cursor="Inspect"
        className="group fashion-focus relative block w-full rounded-[0.8rem] text-left"
        onClick={() => onInspect(item)}
      >
        <span className="soft-edge block aspect-[4/5] overflow-hidden rounded-[0.8rem] bg-white/10">
          <img
            src={item.product.image}
            alt={item.product.title}
            className="image-polish h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
            loading="lazy"
          />
        </span>
        <span className="absolute inset-x-1 bottom-1 translate-y-2 rounded-[0.65rem] border border-white/10 bg-black/55 p-2 opacity-0 shadow-glass backdrop-blur-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="block truncate text-[0.7rem] font-bold text-white">
            {item.product.brand}
          </span>
          <span className="block truncate text-[0.65rem] text-white/55">
            Saved from @{item.sourceOutfit.creator.username}
          </span>
        </span>
      </button>
      <button
        type="button"
        className="fashion-focus mt-2 flex w-full items-center justify-center gap-1 rounded-[0.65rem] border border-white/10 bg-white/[0.05] px-2 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/58 transition hover:text-white"
        onClick={() => onStyle(item)}
      >
        <Plus className="h-3 w-3" />
        Style it
      </button>
    </motion.div>
  );
}

function ItemInspector({
  item,
  onClose,
  onStyle
}: {
  item: WardrobeItem;
  onClose: () => void;
  onStyle: () => void;
}) {
  const router = useRouter();

  return (
    <>
      <motion.button
        aria-label="Close item inspector"
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-[430px] overflow-hidden rounded-[1.15rem] border border-white/12 bg-carbon/92 p-3 shadow-lift backdrop-blur-2xl md:inset-y-6 md:right-6 md:left-auto md:w-[25rem]"
        initial={{ opacity: 0, y: 80, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.96 }}
        transition={{ type: "spring", damping: 30, stiffness: 360 }}
      >
        <div className="grid grid-cols-[7rem_1fr] gap-3 md:block">
          <div className="soft-edge aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-white/10 md:aspect-[4/5]">
            <img
              src={item.product.image}
              alt={item.product.title}
              className="image-polish h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 md:mt-4">
            <p className="label-editorial text-bronze-soft">{item.product.retailer}</p>
            <h2 className="display-editorial mt-1 text-4xl leading-none text-white">
              {item.product.brand}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-5 text-white/62">
              {item.product.title}
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {formatPrice(item.product.price)}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/58">
          <Info label="Category" value={item.category} />
          <Info label="Saved from" value={`@${item.sourceOutfit.creator.username}`} />
          <Info label="Look" value={item.sourceOutfit.style} />
          <Info label="Occasion" value={item.sourceOutfit.occasion} />
        </div>
        <div className="mt-4 grid gap-2">
          <Button onClick={onStyle}>
            <Layers3 className="h-4 w-4" />
            Style it
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/outfit/${item.sourceOutfit.id}`)}
          >
            <Shirt className="h-4 w-4" />
            View source look
          </Button>
          <Button asChild variant="outline">
            <a href={item.product.buyUrl} target="_blank" rel="noreferrer">
              <ShoppingBag className="h-4 w-4" />
              Shop item
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </motion.aside>
    </>
  );
}

function StyleCanvas({
  items,
  onClose
}: {
  items: WardrobeItem[];
  onClose: () => void;
}) {
  return (
    <motion.div
      className="mx-auto mt-5 max-w-6xl overflow-hidden rounded-[1.15rem] border border-white/10 bg-[radial-gradient(circle_at_30%_0%,rgba(247,245,239,0.12),transparent_36%),rgba(255,255,255,0.045)] p-4 shadow-glass md:p-6"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-editorial text-white/40">Style It</p>
          <h2 className="display-editorial mt-1 text-5xl leading-none text-white md:text-7xl">
            Composition canvas
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <div className="mt-5 grid min-h-[18rem] gap-3 md:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative rounded-[1rem] border border-white/10 bg-black/20 p-3"
            initial={{ opacity: 0, y: 18, rotate: index % 2 ? 2 : -2 }}
            animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1 : -1 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="soft-edge aspect-[4/5] overflow-hidden rounded-[0.85rem] bg-white/10">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="image-polish h-full w-full object-cover"
              />
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-white">
              {item.product.brand}
            </p>
            <p className="text-xs text-white/45">{item.category}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.75rem] border border-white/10 bg-white/[0.055] p-2">
      <p className="label-editorial text-white/32">{label}</p>
      <p className="mt-1 truncate text-white/76">{value}</p>
    </div>
  );
}

function EmptyWardrobeSection({ label }: { label: string }) {
  return (
    <div className="col-span-full rounded-[0.85rem] border border-dashed border-white/14 bg-white/[0.035] p-4 text-center text-sm text-white/42">
      {label}
    </div>
  );
}

function createWardrobeItems(outfits: Outfit[]) {
  const seen = new Set<string>();
  const items: WardrobeItem[] = [];

  outfits.forEach((outfit) => {
    outfit.segments.forEach((segment) => {
      segment.products.forEach((product) => {
        if (seen.has(product.id)) return;
        seen.add(product.id);
        items.push({
          id: `${outfit.id}-${segment.key}-${product.id}`,
          category: categorizeProduct(product, segment.key),
          segmentKey: segment.key,
          product,
          sourceOutfit: outfit
        });
      });
    });
  });

  return items;
}

function categorizeProduct(product: Product, segmentKey: SegmentKey): WardrobeItem["category"] {
  const text = `${product.title} ${product.brand}`.toLowerCase();
  if (/(shoe|sneaker|heel|sandal|boot|loafer)/.test(text)) return "Shoes";
  if (/(bag|tote|purse|clutch)/.test(text)) return "Bags";
  if (/(watch|jewel|necklace|earring|sunglass|belt|scarf)/.test(text)) return "Accessories";
  if (segmentKey === "lower-wear") return "Bottoms";
  return "Tops";
}

function groupByCategory(items: WardrobeItem[]) {
  return items.reduce<Record<WardrobeItem["category"], WardrobeItem[]>>(
    (groups, item) => {
      groups[item.category].push(item);
      return groups;
    },
    { Tops: [], Bottoms: [], Shoes: [], Bags: [], Accessories: [] }
  );
}

function filterWardrobeItems(items: WardrobeItem[], filter: WardrobeFilter) {
  if (filter === "all") return items;
  if (filter === "recent") return items.slice(0, 12);
  if (filter === "summer") {
    return items.filter((item) => item.sourceOutfit.season === "Summer");
  }
  if (filter === "date") {
    return items.filter((item) => item.sourceOutfit.occasion === ("Date Night" as Occasion));
  }
  if (filter === "black") {
    return items.filter((item) =>
      `${item.product.color} ${item.product.title}`.toLowerCase().includes("black")
    );
  }
  if (filter === "shoes") {
    return items.filter((item) => item.category === "Shoes");
  }
  return items;
}
