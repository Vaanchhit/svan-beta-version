"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, Home, PlusSquare, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const baseTabs = [
  { label: "Home", href: "/", icon: Home, match: (path: string) => path === "/" },
  {
    label: "Explore",
    href: "/search",
    icon: Search,
    match: (path: string) => path.startsWith("/search")
  },
  {
    label: "Upload",
    href: "/upload",
    icon: PlusSquare,
    match: (path: string) => path.startsWith("/upload")
  },
  {
    label: "Wardrobe",
    href: "/saved",
    icon: Archive,
    match: (path: string) => path.startsWith("/saved")
  },
  {
    label: "Profile",
    href: "/account",
    icon: User,
    match: (path: string) => path.startsWith("/profile")
  }
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const tabs = baseTabs.map((tab) =>
    tab.label === "Profile"
      ? {
          ...tab,
          href: user ? `/profile/${user.username}` : "/account",
          match: (path: string) => path.startsWith("/profile") || path.startsWith("/account")
        }
      : tab
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] px-3 pb-3 md:hidden">
      <div className="glass mobile-safe-bottom grid grid-cols-5 rounded-[1.35rem] px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.match(pathname);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className="fashion-focus relative flex h-14 items-center justify-center rounded-[1rem]"
            >
              {isActive ? (
                <motion.span
                  layoutId="bottom-nav-active"
                  className="absolute inset-x-2 inset-y-1 rounded-[0.9rem] border border-white/15 bg-[linear-gradient(135deg,rgba(247,245,239,0.2),rgba(15,76,58,0.5),rgba(150,62,63,0.24))] shadow-glow"
                  transition={{ type: "spring", damping: 28, stiffness: 420 }}
                />
              ) : null}
              <Icon
                className={cn(
                  "relative h-6 w-6 transition duration-300",
                  isActive ? "text-white drop-shadow" : "text-white/40"
                )}
                strokeWidth={isActive ? 2.4 : 1.9}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
