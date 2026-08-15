import type * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-24 w-24"
};

export function Avatar({ src, alt, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10",
        sizes[size],
        className
      )}
      {...props}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
