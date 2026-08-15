"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Grid3X3, Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { ProfileGrid } from "@/components/profile/profile-grid";
import { ProfileHeader } from "@/components/profile/profile-header";
import { GridLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";
import type { Outfit } from "@/types";

interface ProfileScreenProps {
  username: string;
  initialTab?: ProfileTab;
}

type ProfileTab = "posts" | "saved" | "liked";

const tabs: Array<{ value: ProfileTab; label: string; icon: typeof Grid3X3 }> = [
  { value: "posts", label: "Outfit Posts", icon: Grid3X3 },
  { value: "saved", label: "Saved", icon: Bookmark },
  { value: "liked", label: "Liked", icon: Heart }
];

export function ProfileScreen({
  username,
  initialTab = "posts"
}: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const { profile, outfits, saved, liked, isLoading, error } = useProfile(username);

  if (isLoading) return <GridLoadingSkeleton />;

  if (error || !profile) {
    return (
      <div className="px-5 py-24 text-center text-sm text-white/50">
        {error ?? "Profile not found."}
      </div>
    );
  }

  const grids: Record<ProfileTab, Outfit[]> = {
    posts: outfits,
    saved,
    liked
  };

  return (
    <section>
      <ProfileHeader profile={profile} outfitCount={outfits.length} />
      <div className="surface sticky top-0 z-10 mt-4 grid grid-cols-3 rounded-none border-x-0 bg-carbon/70 backdrop-blur-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              className={cn(
                "relative flex h-[3.25rem] items-center justify-center text-xs font-semibold",
                isActive ? "text-white" : "text-white/40"
              )}
              onClick={() => setActiveTab(tab.value)}
              aria-label={tab.label}
            >
              <Icon className="h-5 w-5" />
              {isActive ? (
                <motion.span
                  layoutId="profile-tab"
                  className="absolute inset-x-8 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-forest via-bronze to-steel"
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          <ProfileGrid
            outfits={grids[activeTab]}
            emptyLabel={`No ${activeTab} outfits yet.`}
          />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
