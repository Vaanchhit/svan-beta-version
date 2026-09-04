"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Bell,
  Compass,
  Home,
  Plus,
  Search,
  Sparkles,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Discover", href: "/search", icon: Compass },
  { label: "Wardrobe", href: "/saved", icon: Archive }
];

const createOptions = [
  "Post a look",
  "Style an outfit",
  "Ask the community",
  "Create a poll",
  "Moodboard"
];

const activityItems = [
  { label: "Maya saved your linen set", sub: "2m ago" },
  { label: "Ari commented on your profile", sub: "Today" },
  { label: "New looks in Minimalist", sub: "This morning" }
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
    setSearchOpen(false);
    setSearchQuery("");
  };

  const profileHref = user ? `/profile/${user.username}` : "/account";

  return (
    <header className="mobile-safe-top sticky top-0 z-40 px-3 pt-3 md:px-6 md:pt-5">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-visible rounded-[1.35rem] border border-white/10 bg-black/18 px-3 py-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                aria-label="SVAN home"
                data-cursor="Home"
                className="magnetic fashion-focus flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white transition hover:border-white/22 hover:bg-white/[0.08]"
              >
                <Sparkles className="h-4 w-4" />
              </Link>

              <div className="hidden min-[420px]:block">
                <Link href="/" className="display-editorial text-2xl leading-none text-white/90">
                  SVAN
                </Link>
              </div>
            </div>

            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    data-cursor={label}
                    className={cn(
                      "magnetic fashion-focus relative rounded-full px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition duration-300",
                      isActive
                        ? "text-white"
                        : "text-white/52 hover:text-white/82"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{label}</span>
                    </span>
                    {isActive ? (
                      <motion.span
                        layoutId="header-active-indicator"
                        className="absolute inset-x-1 -bottom-1 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
                        transition={{ type: "spring", damping: 30, stiffness: 420 }}
                      />
                    ) : null}
                  </Link>
                );
              })}

              <div className="relative">
                <button
                  type="button"
                  data-cursor="Create"
                  aria-label="Create"
                  onClick={() => {
                    setCreateOpen((open) => !open);
                    setActivityOpen(false);
                  }}
                  className="magnetic fashion-focus flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-[linear-gradient(135deg,rgba(247,245,239,0.15),rgba(15,76,58,0.26),rgba(150,62,63,0.18))] text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition hover:scale-[1.03]"
                >
                  <Plus className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {createOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-[calc(100%+0.75rem)] w-48 -translate-x-1/2 rounded-[1rem] border border-white/10 bg-[#111111]/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
                    >
                      {createOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className="fashion-focus block w-full rounded-[0.7rem] px-3 py-2 text-left text-sm text-white/72 transition hover:bg-white/[0.04] hover:text-white"
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <button
                  type="button"
                  aria-label="Search"
                  data-cursor="Search"
                  onClick={() => {
                    setSearchOpen((open) => !open);
                    setActivityOpen(false);
                    setCreateOpen(false);
                  }}
                  className="fashion-focus flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition hover:border-white/18 hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  data-cursor="Activity"
                  onClick={() => {
                    setActivityOpen((open) => !open);
                    setCreateOpen(false);
                    setSearchOpen(false);
                  }}
                  className="fashion-focus flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition hover:border-white/18 hover:text-white"
                >
                  <Bell className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {activityOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-[1rem] border border-white/10 bg-[#111111]/90 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
                    >
                      <p className="label-editorial text-white/36">Activity</p>
                      <div className="mt-2 space-y-2">
                        {activityItems.map((item) => (
                          <div key={item.label} className="rounded-[0.7rem] border border-white/8 bg-white/[0.02] px-3 py-2">
                            <p className="text-sm text-white/76">{item.label}</p>
                            <p className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/40">
                              {item.sub}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <Link
                href={profileHref}
                aria-label="Profile"
                data-cursor="Profile"
                className="fashion-focus flex items-center justify-center"
              >
                <Avatar
                  src={user?.avatar ?? "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80"}
                  alt={user?.displayName ?? "Profile"}
                  size="sm"
                  className="ring-1 ring-white/15 transition hover:ring-white/30"
                />
              </Link>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleSearchSubmit}
                className="mt-3"
              >
                <div className="flex items-center gap-2 rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <Search className="h-4 w-4 text-white/55" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search looks, people, and items"
                    className="h-10 flex-1 border-0 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/75 transition hover:text-white"
                  >
                    Go
                  </button>
                </div>
              </motion.form>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
