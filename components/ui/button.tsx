import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-ivory via-white to-bronze-soft text-black shadow-lift hover:shadow-bronze",
        forest:
          "bg-gradient-to-br from-forest-light via-forest to-forest text-white shadow-glow hover:shadow-bronze",
        ghost:
          "border border-white/10 bg-white/10 text-white shadow-glass backdrop-blur-xl hover:border-bronze/40 hover:bg-white/[0.16]",
        outline:
          "border border-white/[0.15] bg-white/[0.08] text-white shadow-glass backdrop-blur-xl hover:border-steel/50 hover:bg-white/[0.14]",
        bare: "bg-transparent text-white hover:bg-white/10"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-[3.25rem] px-6 text-base",
        icon: "h-11 w-11 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
