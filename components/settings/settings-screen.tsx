"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Lock,
  Moon,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const settings = [
  { icon: Bell, label: "Notifications", value: "Curated" },
  { icon: Lock, label: "Privacy", value: "Friends" },
  { icon: SlidersHorizontal, label: "Discovery", value: "Balanced" },
  { icon: ShieldCheck, label: "Retailer safety", value: "Verified" },
  { icon: Moon, label: "Dark mode", value: "Always on" }
];

export function SettingsScreen() {
  const router = useRouter();

  return (
    <section className="px-4 pb-28 pt-5 mobile-safe-top">
      <header className="mb-5 flex items-center gap-3">
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
          <p className="text-xs font-medium uppercase text-bronze-soft">Account</p>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
        </div>
      </header>

      <div className="space-y-3">
        {settings.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              type="button"
              className="surface flex w-full items-center gap-3 rounded-[1.45rem] p-4 text-left transition duration-300 hover:border-bronze/40 hover:bg-white/[0.12]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-white/[0.15] to-white/5 shadow-glass">
                <Icon className="h-5 w-5 text-bronze-soft" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">
                  {item.label}
                </span>
                <span className="text-xs text-white/50">{item.value}</span>
              </span>
              <ChevronRight className="h-5 w-5 text-white/40" />
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
