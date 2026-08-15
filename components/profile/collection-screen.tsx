"use client";

import { ArrowLeft, Bookmark, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { ProfileGrid } from "@/components/profile/profile-grid";
import { Button } from "@/components/ui/button";
import { GridLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useProfile } from "@/hooks/use-profile";

interface CollectionScreenProps {
  type: "saved" | "liked";
}

export function CollectionScreen({ type }: CollectionScreenProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { saved, liked, isLoading, error } = useProfile(user?.username ?? "me");
  const Icon = type === "saved" ? Bookmark : Heart;
  const title = type === "saved" ? "Saved outfits" : "Liked outfits";
  const outfits = type === "saved" ? saved : liked;

  if (authLoading || isLoading) return <GridLoadingSkeleton />;

  if (!user) {
    return (
      <section className="px-5 py-24 text-center">
        <div className="glass rounded-[1.7rem] p-5">
          <Icon className="mx-auto h-7 w-7 text-bronze-soft" />
          <h1 className="mt-3 text-xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Log in to keep this collection saved across visits.
          </p>
          <Button className="mt-5" onClick={() => router.push(`/account?next=/${type}`)}>
            Log in
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-carbon/90 px-4 pb-4 pt-5 backdrop-blur-2xl mobile-safe-top">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="text-xs text-white/50">Private to @{user.username}</p>
        </div>
      </header>
      {error ? (
        <div className="px-5 py-16 text-center text-sm text-white/50">
          {error}
        </div>
      ) : (
        <ProfileGrid outfits={outfits} emptyLabel={`No ${type} outfits yet.`} />
      )}
    </section>
  );
}
