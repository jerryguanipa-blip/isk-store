"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const primary = product.images[0];
  const secondary = product.images[1] ?? primary;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div
        className={`relative aspect-square overflow-hidden ${
          product.theme === "light" ? "bg-white" : "isk-spot"
        }`}
      >
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          className={`isk-product object-contain transition-opacity duration-700 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src={secondary.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={`isk-product object-contain transition-all duration-700 ${
            hovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
          }`}
        />

        <span className={`ui-label absolute top-4 left-4 px-3 py-1.5 text-[10px] ${
            product.theme === "light" ? "bg-black text-white" : "bg-white text-black"
          }`}>
          {product.color}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 py-5">
        <div>
          <h2 className="ui-label text-[11px] leading-snug">{product.shortName}</h2>
          <p className="mt-1.5 text-xs text-white/55">{product.intro}</p>
        </div>
        <p className="shrink-0 text-sm tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
