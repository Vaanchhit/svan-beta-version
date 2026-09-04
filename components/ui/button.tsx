import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1.1rem] text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-white/10 bg-gradient-to-r from-[#f5efe6] via-white to-[#d2b48d] text-black shadow-[0_20px_40px_rgba(185,134,79,0.28)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(185,134,79,0.36)]",
        forest:
          "bg-gradient-to-br from-forest-light via-forest to-[#102b23] text-white shadow-[0_16px_30px_rgba(15,76,58,0.34)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(15,76,58,0.42)]",
        ghost:
          "border border-white/10 bg-white/8 text-white/90 shadow-[0_14px_36px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:border-bronze/40 hover:bg-white/[0.16]",
        outline:
          "border border-white/[0.15] bg-black/20 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:border-steel/60 hover:bg-white/[0.08]",
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
