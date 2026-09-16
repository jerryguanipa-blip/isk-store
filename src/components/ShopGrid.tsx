"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ColorKey, Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

type Filter = "TODO" | ColorKey;

const FILTERS: Filter[] = ["TODO", "WHITE", "BLACK"];

export function ShopGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("TODO");

  const visible =
    filter === "TODO" ? products : products.filter((p) => p.color === filter);

  return (
    <>
      <div
        role="group"
        aria-label="Filtrar por color"
        className="flex flex-wrap items-center gap-2 border-y border-white/10 py-5"
      >
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`ui-label border px-5 py-2.5 text-[11px] transition-colors ${
              filter === option
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/70 hover:border-white hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
        <p className="ui-label ml-auto text-[10px] text-white/40">
          {visible.length} {visible.length === 1 ? "MODELO" : "MODELOS"}
        </p>
      </div>

      <motion.div
        layout
        className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((product, index) => (
          <motion.div
            key={product.slug}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductCard product={product} priority={index === 0} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
