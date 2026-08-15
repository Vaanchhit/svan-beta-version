import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden border-x border-white/10 bg-carbon shadow-[0_0_100px_rgba(0,0,0,0.65)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 mx-auto h-72 max-w-[430px] bg-[radial-gradient(circle_at_18%_0%,rgba(15,76,58,0.34),transparent_62%),radial-gradient(circle_at_88%_12%,rgba(185,134,79,0.2),transparent_52%)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto h-64 max-w-[430px] bg-[radial-gradient(circle_at_50%_100%,rgba(139,167,178,0.12),transparent_58%)]" />
      <div className="relative min-h-dvh">{children}</div>
      <BottomNav />
    </div>
  );
}
