import type * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-white/10 via-white/20 to-white/10",
        className
      )}
      {...props}
    />
  );
}
