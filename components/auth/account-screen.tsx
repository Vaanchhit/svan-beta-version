"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, LogIn, Sparkles, UserPlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { cn } from "@/lib/utils";

type Mode = "signup" | "login";

export function AccountScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, login, signup, logout } = useAuth();
  const [mode, setMode] = useState<Mode>("signup");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const nextPath = searchParams.get("next") || (user ? `/profile/${user.username}` : "/");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        await signup({ displayName, email, password });
      } else {
        await login({ email, password });
      }
      router.replace(nextPath);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (!isLoading && user) {
    return (
      <section className="px-4 pb-28 pt-5 mobile-safe-top">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[1.9rem] p-5"
        >
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} alt={user.displayName} size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-bronze-soft">
                Signed in
              </p>
              <h1 className="mt-1 truncate text-2xl font-semibold text-white">
                {user.displayName}
              </h1>
              <p className="mt-1 truncate text-sm text-white/50">@{user.username}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-white/70">{user.bio}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button onClick={() => router.push(`/profile/${user.username}`)}>
              Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                router.replace("/account");
              }}
            >
              Log out
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-28 pt-5 mobile-safe-top">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <div className="glass flex h-12 w-12 items-center justify-center rounded-[1.2rem]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase text-bronze-soft">
          SVAN account
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-white">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Likes and saves are stored with your account and stay there when you
          reopen the webapp.
        </p>
      </motion.div>

      <div className="surface mb-4 grid grid-cols-2 rounded-full p-1">
        {(["signup", "login"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "h-10 rounded-full text-sm font-semibold transition",
              mode === item
                ? "bg-gradient-to-r from-forest to-bronze text-white shadow-glow"
                : "text-white/50"
            )}
            onClick={() => {
              setMode(item);
              setError("");
            }}
          >
            {item === "signup" ? "Sign up" : "Log in"}
          </button>
        ))}
      </div>

      <motion.form
        onSubmit={submit}
        className="glass space-y-3 rounded-[1.9rem] p-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        {mode === "signup" ? (
          <TextField
            required
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Display name"
            autoComplete="name"
          />
        ) : null}
        <TextField
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        <TextField
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        {error ? (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        ) : null}
        <Button type="submit" variant="forest" size="lg" className="w-full" disabled={busy}>
          {mode === "signup" ? (
            <UserPlus className="h-4 w-4" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {busy ? "Working..." : mode === "signup" ? "Create account" : "Log in"}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-white/40">
          <Lock className="h-3.5 w-3.5" />
          Session stays signed in for 30 days on this browser.
        </p>
      </motion.form>
    </section>
  );
}
