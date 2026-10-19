"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { WhatsAppOrderButton } from "@/components/WhatsAppOrderButton";
import type { Product } from "@/data/products";
import { useSizeStock } from "@/lib/client-hooks";
import { cn, formatPrice } from "@/lib/format";

/** Tope por talla cuando el panel todavía no controla el stock. */
const SIN_CONTROL = 10;

/**
 * Tarjeta de la portada: el par, sus tallas y el botón que manda el pedido
 * por WhatsApp. Sin formularios ni datos personales.
 */
export function QuickOrder({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [error, setError] = useState(false);
  const stock = useSizeStock(product.slug);

  const maxFor = (eur: number) => {
    const quedan = stock[eur];
    return typeof quedan === "number" ? quedan : SIN_CONTROL;
  };

  const change = (eur: number, delta: number) => {
    setError(false);
    setPicked((current) => {
      const next = Math.min(Math.max((current[eur] ?? 0) + delta, 0), maxFor(eur));
      const copy = { ...current };
      if (next === 0) delete copy[eur];
      else copy[eur] = next;
      return copy;
    });
  };

  const picks = product.sizes
    .filter((option) => (picked[option.eur] ?? 0) > 0)
    .map((option) => ({ size: option.eur, qty: picked[option.eur] }));
  const pairs = picks.reduce((sum, pick) => sum + pick.qty, 0);

  return (
    <div className="flex flex-col">
      <Link href={`/product/${product.slug}`} className="group relative block aspect-square bg-surface">
        <Image
          src={product.images[0]?.src ?? product.ogImage}
          alt={product.images[0]?.alt ?? product.name}
          fill
          priority={priority}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="isk-product object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="display text-xl">{product.colorName.toUpperCase()}</h3>
        <p className="tabular-nums text-lg">{formatPrice(product.price)}</p>
      </div>

      <p className="ui-label mt-4 text-[11px] text-muted">
        1 · ELIGE TU TALLA {pairs > 0 ? `· ${pairs} par${pairs > 1 ? "es" : ""}` : ""}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {product.sizes.map((option) => {
          const qty = picked[option.eur] ?? 0;
          const agotada = !option.available || stock[option.eur] === 0;
          return (
            <button
              key={option.eur}
              type="button"
              disabled={agotada || qty >= maxFor(option.eur)}
              onClick={() => change(option.eur, 1)}
              aria-label={
                agotada
                  ? `Talla ${option.eur} agotada`
                  : `Agregar un par de la talla ${option.eur} de la ${product.colorName}`
              }
              className={cn(
                "relative grid h-12 w-12 place-items-center border text-sm tabular-nums transition-colors",
                qty > 0 ? "border-ink bg-ink text-white" : "border-line bg-paper hover:border-ink",
                agotada && "cursor-not-allowed opacity-30 line-through",
              )}
            >
              {option.eur}
              {qty > 0 && (
                <span className="absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center border border-ink bg-paper px-1 text-[11px] text-ink">
                  {qty}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {picks.length > 0 && (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {picks.map((pick) => (
            <li key={pick.size} className="flex items-center gap-3 py-2">
              <span className="ui-label w-20 text-xs">EUR {pick.size}</span>
              <div className="ml-auto flex items-center border border-line">
                <button
                  type="button"
                  onClick={() => change(pick.size, -1)}
                  aria-label={`Quitar un par de la talla ${pick.size}`}
                  className="grid h-10 w-10 place-items-center transition-colors hover:bg-ink hover:text-white"
                >
                  <Minus className="h-3 w-3" aria-hidden="true" />
                </button>
                <span className="min-w-10 text-center text-sm tabular-nums">{pick.qty}</span>
                <button
                  type="button"
                  onClick={() => change(pick.size, 1)}
                  disabled={pick.qty >= maxFor(pick.size)}
                  aria-label={`Agregar un par de la talla ${pick.size}`}
                  className="grid h-10 w-10 place-items-center transition-colors hover:bg-ink hover:text-white disabled:opacity-30"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
              <span className="w-24 text-right text-sm tabular-nums">
                {formatPrice(product.price * pick.qty)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="ui-label mt-5 text-[11px] text-muted">2 · MÁNDANOS EL PEDIDO</p>
      <div className="mt-2 flex flex-col gap-2">
        <WhatsAppOrderButton
          getItems={() =>
            picks.length === 0
              ? null
              : picks.map((pick) => ({ slug: product.slug, size: pick.size, qty: pick.qty }))
          }
          onMissing={() => setError(true)}
        />
        {error && (
          <p role="alert" className="ui-label text-xs">
            ⚠ TOCA TU TALLA PARA CONTINUAR
          </p>
        )}
        <p className="text-xs text-muted">
          Se abre WhatsApp con tu pedido escrito. Ahí te pasamos los datos para pagar y coordinamos
          el envío.
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="ui-label text-xs underline underline-offset-4 hover:no-underline"
        >
          VER MÁS FOTOS Y DETALLES
        </Link>
      </div>
    </div>
  );
}
