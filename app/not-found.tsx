import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <p className="text-sm font-medium uppercase text-white/40">SVAN</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Look not found</h1>
      <p className="mt-3 text-sm leading-6 text-white/60">
        This page is not part of the current mock product surface.
      </p>
      <Button asChild className="mt-7">
        <Link href="/">Back to feed</Link>
      </Button>
    </main>
  );
}
