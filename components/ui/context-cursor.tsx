"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function ContextCursor() {
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 520, damping: 42, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 520, damping: 42, mass: 0.4 });
  const [label, setLabel] = useState("");

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      rawX.set(event.clientX);
      rawY.set(event.clientY);

      const target = event.target as Element | null;
      const cursorTarget = target?.closest("[data-cursor]");
      setLabel(cursorTarget?.getAttribute("data-cursor") ?? "");
    };

    const leave = () => {
      rawX.set(-100);
      rawY.set(-100);
      setLabel("");
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, [rawX, rawY]);

  return (
    <motion.div
      aria-hidden="true"
      className="context-cursor pointer-events-none fixed left-0 top-0 z-[80] hidden h-11 min-w-11 place-items-center rounded-full border border-white/20 bg-black/45 px-3 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_38px_rgba(0,0,0,0.42)] backdrop-blur-xl"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{
        opacity: label ? 1 : 0,
        scale: label ? 1 : 0.72
      }}
      transition={{ duration: 0.16 }}
    >
      {label}
    </motion.div>
  );
}
