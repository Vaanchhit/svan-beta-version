"use client";

import Link from "next/link";
import { Bookmark, Heart, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, formatCount } from "@/lib/utils";
import type { Profile } from "@/types";

interface ProfileHeaderProps {
  profile: Profile;
  outfitCount: number;
}

export function ProfileHeader({ profile, outfitCount }: ProfileHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <motion.header
      className="px-5 pt-5 mobile-safe-top"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="glass rounded-[1.8rem] p-4">
      <div className="flex items-start gap-5">
        <Avatar src={profile.avatar} alt={profile.displayName} size="lg" />
        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-white">
                {profile.username}
              </p>
              <p className="truncate text-sm text-white/50">
                {profile.displayName}
              </p>
            </div>
            <Button asChild variant="ghost" size="icon" aria-label="Settings">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat label="Outfits" value={formatCount(outfitCount)} />
            <Stat label="Followers" value={formatCount(profile.followerCount)} />
            <Stat label="Following" value={formatCount(profile.followingCount)} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/70">{profile.bio}</p>
      <div className={cn("mt-5 grid gap-2", profile.isViewer ? "grid-cols-2" : "grid-cols-3")}>
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
          <Link href="/saved">
            <Bookmark className="h-4 w-4" />
            Saved
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
    <div className="rounded-[1rem] border border-white/10 bg-white/[0.08] px-2 py-2">
      <p className="text-base font-semibold text-white">{value}</p>
      <p className="text-[0.7rem] text-white/40">{label}</p>
    </div>
  );
}
