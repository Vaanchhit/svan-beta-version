"use client";

import Link from "next/link";
import { Archive, Bookmark, Heart, MapPin, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, formatCount } from "@/lib/utils";
import type { Outfit, Profile } from "@/types";

interface ProfileHeaderProps {
  profile: Profile;
  outfits: Outfit[];
  outfitCount: number;
}

export function ProfileHeader({ profile, outfits, outfitCount }: ProfileHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const styleDna = getStyleDna(outfits);

  return (
    <motion.header
      className="px-5 pt-6 mobile-safe-top md:px-8 md:pt-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="glass overflow-hidden rounded-[1.15rem] p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-[1fr_18rem] md:items-start">
          <div>
            <div className="flex items-start gap-5">
              <Avatar src={profile.avatar} alt={profile.displayName} size="lg" />
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="label-editorial flex items-center gap-2 text-white/42">
                      <Sparkles className="h-3.5 w-3.5" />
                      creator universe
                    </p>
                    <h1 className="display-editorial mt-2 truncate text-5xl leading-none text-white md:text-7xl">
                      {profile.username}
                    </h1>
                    <p className="mt-1 truncate text-sm text-white/55">
                      {profile.displayName}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="icon" aria-label="Settings">
                    <Link href="/settings" data-cursor="Settings">
                      <Settings className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <p className="caption-balance mt-5 max-w-2xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
              {profile.bio}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/38">
              <MapPin className="h-3.5 w-3.5" />
              SVAN studio
            </div>
          </div>

          <div className="surface rounded-[1rem] p-3">
            <p className="label-editorial mb-3 text-white/42">Style DNA</p>
            <div className="space-y-3">
              {styleDna.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="truncate text-xs font-semibold text-white/74">
                      {item.label}
                    </span>
                    <span className="text-xs text-white/38">{item.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className="block h-full rounded-full bg-gradient-to-r from-bronze via-ivory to-forest"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <Stat label="Outfits" value={formatCount(outfitCount)} />
          <Stat label="Followers" value={formatCount(profile.followerCount)} />
          <Stat label="Following" value={formatCount(profile.followingCount)} />
        </div>

        <div className={cn("mt-5 grid gap-2", profile.isViewer ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3")}>
          {profile.isViewer ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/account")}
            >
              Account
            </Button>
          ) : (
            <Button variant="default" size="sm">Follow</Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/saved" data-cursor="Wardrobe">
              <Archive className="h-4 w-4" />
              Wardrobe
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/liked">
              <Heart className="h-4 w-4" />
              Liked
            </Link>
          </Button>
          {profile.isViewer ? (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
                router.replace("/account");
              }}
            >
              Log out
            </Button>
          ) : null}
        </div>
      </div>
    </motion.header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.85rem] border border-white/10 bg-white/[0.08] px-2 py-2">
      <p className="display-editorial text-3xl leading-none text-white">{value}</p>
      <p className="label-editorial mt-1 text-white/36">{label}</p>
    </div>
  );
}

function getStyleDna(outfits: Outfit[]) {
  const counts = new Map<string, number>();
  outfits.forEach((outfit) => {
    counts.set(outfit.style, (counts.get(outfit.style) ?? 0) + 1);
  });

  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const total = Math.max(1, outfits.length);
  const fallback = [
    { label: "Personal", value: 76 },
    { label: "Editorial", value: 62 },
    { label: "Saved", value: 48 }
  ];

  if (entries.length === 0) return fallback;

  return entries.map(([label, count], index) => ({
    label,
    value: Math.max(34, Math.round((count / total) * 82) + 12 - index * 4)
  }));
}
