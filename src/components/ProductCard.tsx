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
      className="isk-photo-hover group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-950">
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          className={`isk-photo object-cover transition-opacity duration-700 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src={secondary.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={`isk-photo object-cover transition-all duration-700 ${
            hovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
          }`}
        />

        <span className="ui-label absolute top-4 left-4 border border-white/30 bg-black/40 px-3 py-1.5 text-[10px] backdrop-blur-sm">
          {product.color}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 py-5">
        <div>
          <h3 className="ui-label text-[11px] leading-snug">{product.shortName}</h3>
          <p className="mt-1.5 text-xs text-white/45">{product.intro}</p>
        </div>
        <p className="shrink-0 text-sm tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
