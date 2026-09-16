"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  /** Tamaños para next/image según la grilla donde se usa */
  sizes?: string;
  /** Nivel del título, para respetar el orden de encabezados de cada página */
  headingLevel?: "h2" | "h3";
};

/** Tarjeta de catálogo: foto sobre #F5F5F3 y nombre, color y precio debajo. */
export function ProductCard({
  product,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  headingLevel: Heading = "h2",
}: ProductCardProps) {
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
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "isk-product scale-110 object-contain",
            primary.src.endsWith(".jpg") && "isk-blend",
            hovered ? "opacity-0" : "opacity-100",
          )}
        />
        <Image
          src={secondary.src}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className={cn(
            "isk-product scale-110 object-contain",
            secondary.src.endsWith(".jpg") && "isk-blend",
            hovered ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      <div className="flex items-start justify-between gap-4 pt-3 text-sm">
        <div className="min-w-0">
          <Heading className="font-medium text-ink group-hover:underline group-hover:underline-offset-4">
            {product.shortName}
          </Heading>
          <p className="text-muted">{product.color}</p>
        </div>
        <p className="shrink-0 tabular-nums text-ink">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
