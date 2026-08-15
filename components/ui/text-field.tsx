import type * as React from "react";
import { cn } from "@/lib/utils";

export function TextField({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-forest focus:bg-white/10",
        className
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-none rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-forest focus:bg-white/10",
        className
      )}
      {...props}
    />
  );
}
