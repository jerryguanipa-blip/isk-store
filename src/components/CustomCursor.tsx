"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/lib/client-hooks";

const INTERACTIVE =
  'a, button, input, textarea, select, summary, [role="button"], [data-cursor="hover"]';

/**
 * Cursor propio, solo en escritorio con mouse real.
 * En móvil, tablet o con "reducir movimiento" no se monta y el cursor
 * del sistema queda intacto.
 */
export function CustomCursor() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reduceMotion;

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("isk-custom-cursor");

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target as Element | null;
      setHovering(Boolean(target?.closest?.(INTERACTIVE)));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.classList.remove("isk-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300]">
      <motion.div
        style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
        className="absolute top-0 left-0"
      >
        <motion.div
          animate={{
            width: hovering ? 54 : 26,
            height: hovering ? 54 : 26,
            backgroundColor: hovering ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0)",
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white mix-blend-difference"
        />
      </motion.div>

      <motion.div
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="absolute top-0 left-0"
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-white mix-blend-difference" />
      </motion.div>
    </div>
  );
}
