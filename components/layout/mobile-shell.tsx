import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ContextCursor } from "@/components/ui/context-cursor";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="editorial-shell relative mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden border-x border-white/10 bg-carbon shadow-[0_0_100px_rgba(0,0,0,0.65)] md:max-w-5xl md:border-none lg:max-w-7xl">
      <div className="pointer-events-none fixed inset-x-0 top-0 mx-auto h-80 max-w-[430px] bg-[radial-gradient(circle_at_18%_0%,rgba(39,34,52,0.44),transparent_62%),radial-gradient(circle_at_88%_12%,rgba(150,62,63,0.2),transparent_52%)] md:max-w-5xl lg:max-w-7xl" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto h-72 max-w-[430px] bg-[radial-gradient(circle_at_50%_100%,rgba(15,76,58,0.18),transparent_58%)] md:max-w-5xl lg:max-w-7xl" />
      <div className="relative min-h-dvh">{children}</div>
      <BottomNav />
      <ContextCursor />
    </div>
  );
}
