"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  title,
  description,
  onClose,
  children,
  className
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close sheet"
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[86dvh] w-full max-w-[430px] overflow-hidden rounded-t-[2rem] border border-white/[0.12] bg-carbon/90 shadow-lift backdrop-blur-2xl",
              className
            )}
            initial={{ y: "100%", opacity: 0.85 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.9 }}
            transition={{ type: "spring", damping: 32, stiffness: 360 }}
          >
            <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-forest via-bronze to-steel" />
            <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
              <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {description ? (
                  <p className="mt-1 text-sm text-white/50">{description}</p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="max-h-[68dvh] overflow-y-auto px-5 pb-7 no-scrollbar">
              {children}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
