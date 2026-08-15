"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ShopButtonProps {
  outfitId: string;
  compact?: boolean;
}

export function ShopButton({ outfitId, compact = false }: ShopButtonProps) {
  return (
    <motion.div whileTap={{ scale: 0.96 }}>
      <Button asChild variant="forest" size={compact ? "sm" : "default"}>
        <Link href={`/outfit/${outfitId}`}>
          <ShoppingBag className="h-4 w-4" />
          Shop Outfit
        </Link>
      </Button>
    </motion.div>
  );
}
