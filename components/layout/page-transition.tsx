"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.main
      className={cn("min-h-dvh pb-24", className)}
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
