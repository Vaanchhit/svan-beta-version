"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AccountScreen() {
  const router = useRouter();

  return (
    <section className="px-4 pb-28 pt-5 mobile-safe-top">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[1.9rem] p-5"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/[0.03]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/42">
          Placeholder
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Authentication is disabled</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          This prototype keeps the account surface as a placeholder while the app remains focused on browsing, discovery, and wardrobe exploration.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button onClick={() => router.push("/")}>
            Back to feed
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => router.push("/search")}>
            Explore looks
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
