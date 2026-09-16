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
        className="flex flex-wrap items-center gap-2 border-y border-line py-4"
      >
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`ui-label inline-flex h-10 items-center border px-4 text-xs transition-colors ${
              filter === option
                ? "border-ink bg-ink text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            {option}
          </button>
        ))}
        <p className="ui-label ml-auto text-xs text-muted">
          {visible.length} {visible.length === 1 ? "MODELO" : "MODELOS"}
        </p>
      </div>

      <motion.div
        layout
        className="mt-8 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((product, index) => (
          <motion.div
            key={product.slug}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
          >
            <ProductCard
              product={product}
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
