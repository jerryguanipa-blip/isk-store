"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Distancia de entrada en píxeles */
  y?: number;
};

/** Aparición suave (fade de 400 ms) al entrar en pantalla al hacer scroll. */
export function Reveal({ children, className, delay = 0, y = 0 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: Math.min(delay, 0.2), ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
