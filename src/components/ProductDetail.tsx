"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Ruler, X } from "lucide-react";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useSizeStock } from "@/lib/client-hooks";
import { buildLandingMessage, buildSizePickMessage, whatsappUrl } from "@/lib/checkout";
import { BuyNowButton } from "@/components/BuyNowButton";
import { ProductGallery } from "@/components/ProductGallery";
import { SizeGuideModal } from "@/components/SizeGuideModal";

/** Tope de pares por talla cuando no hay stock cargado en el panel. */
const SIN_CONTROL = 10;

export function ProductDetail({ product }: { product: Product }) {
  /** Pares elegidos por talla: { 40: 2, 42: 1 } */
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [error, setError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const add = useCart((s) => s.add);
  const stock = useSizeStock(product.slug);

  /** Máximo que puede llevar de una talla (lo que diga el panel, o 10). */
  const maxFor = (eur: number) => {
    const available = stock[eur];
    return typeof available === "number" ? available : SIN_CONTROL;
  };
  const isSoldOut = (eur: number) => stock[eur] === 0;

  const changeQty = (eur: number, delta: number) => {
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
  const total = pairs * product.price;

  const handleAdd = () => {
    if (pairs === 0) {
      setError(true);
      return;
    }
    setError(false);
    for (const pick of picks) add(product, pick.size, pick.qty);
    setPicked({});
  };

  const whatsappHref = whatsappUrl(
    picks.length > 0
      ? buildSizePickMessage(product.name, picks, product.price)
      : buildLandingMessage(product.colorName),
  );

  return (
    <>
      <nav aria-label="Ruta de navegación" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <li>
            <Link href="/" className="ui-label hover:text-ink">
              INICIO
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="ui-label hover:text-ink">
              TIENDA
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="ui-label text-ink">{product.color}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-muted">NIKE · AIR FORCE 1 &apos;07</p>
          <h1 className="display mt-2 text-2xl sm:text-3xl">{product.colorName}</h1>
          <p className="mt-3 text-lg tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-muted">Precio en soles (PEN). IGV incluido.</p>

          <p className="mt-6 max-w-prose text-muted">{product.description}</p>

          {/* Tallas */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="ui-label text-xs">
                TALLA EUR{" "}
                <span className="text-muted">
                  {pairs > 0 ? `· ${pairs} par${pairs > 1 ? "es" : ""}` : "· toca la tuya"}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="ui-label flex min-h-11 items-center gap-2 text-xs underline underline-offset-4 hover:no-underline"
              >
                <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                GUÍA DE TALLAS
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((option) => {
                const qty = picked[option.eur] ?? 0;
                const agotada = !option.available || isSoldOut(option.eur);
                const quedan = stock[option.eur];
                return (
                  <button
                    key={option.eur}
                    type="button"
                    disabled={agotada || qty >= maxFor(option.eur)}
                    aria-label={
                      agotada
                        ? `Talla ${option.eur} agotada`
                        : `Agregar un par de la talla ${option.eur}${
                            typeof quedan === "number" ? `, quedan ${quedan}` : ""
                          }`
                    }
                    onClick={() => changeQty(option.eur, 1)}
                    className={cn(
                      "relative grid h-12 w-12 place-items-center border text-sm tabular-nums transition-colors",
                      qty > 0
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-paper text-ink hover:border-ink",
                      agotada && "cursor-not-allowed opacity-30 line-through",
                      !agotada && qty >= maxFor(option.eur) && "cursor-not-allowed",
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

            <p className="mt-3 text-xs text-muted">
              Toca una talla para sumar un par. Puedes llevar varias tallas en el mismo pedido.
            </p>

            {/* Tallas elegidas, con + y - */}
            {picks.length > 0 && (
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {picks.map((pick) => (
                  <li key={pick.size} className="flex items-center gap-3 py-3">
                    <span className="ui-label w-20 text-xs">EUR {pick.size}</span>

                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        onClick={() => changeQty(pick.size, -1)}
                        aria-label={`Quitar un par de la talla ${pick.size}`}
                        className="grid h-11 w-11 place-items-center transition-colors hover:bg-ink hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <span className="min-w-10 text-center text-sm tabular-nums" aria-live="polite">
                        {pick.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQty(pick.size, 1)}
                        disabled={pick.qty >= maxFor(pick.size)}
                        aria-label={`Agregar un par de la talla ${pick.size}`}
                        className="grid h-11 w-11 place-items-center transition-colors hover:bg-ink hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <span className="ml-auto text-sm tabular-nums">
                      {formatPrice(product.price * pick.qty)}
                    </span>

                    <button
                      type="button"
                      onClick={() => changeQty(pick.size, -pick.qty)}
                      aria-label={`Quitar la talla ${pick.size} del pedido`}
                      className="grid h-11 w-11 place-items-center text-muted transition-colors hover:text-ink"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {pairs > 0 && (
              <div className="mt-3 flex items-center justify-between">
                <span className="ui-label text-xs">
                  TOTAL · {pairs} PAR{pairs > 1 ? "ES" : ""}
                </span>
                <span className="text-lg tabular-nums">{formatPrice(total)}</span>
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                role="alert"
                className="ui-label mt-3 text-xs text-ink"
              >
                ⚠ TOCA TU TALLA PARA CONTINUAR
              </motion.p>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-6 flex flex-col gap-2">
            <BuyNowButton
              getItems={() =>
                picks.length === 0
                  ? null
                  : picks.map((pick) => ({ slug: product.slug, size: pick.size, qty: pick.qty }))
              }
              onMissing={() => setError(true)}
            />

            <button
              type="button"
              onClick={handleAdd}
              data-cta
              className="btn btn-secondary w-full"
            >
              AGREGAR AL CARRITO
            </button>

            <a
              href={whatsappHref}
              data-cta
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary w-full"
            >
              COMPRAR VÍA WHATSAPP
            </a>
          </div>

          {/* Acordeones */}
          <div className="mt-8 border-b border-line">
            <details className="isk-accordion border-t border-line" open>
              <summary className="ui-label flex min-h-12 items-center justify-between text-xs">
                DETALLES
              </summary>
              <ul className="space-y-2 pb-5">
                {product.details.map((detail) => (
                  <li key={detail} className="flex gap-3 text-sm text-muted">
                    <span aria-hidden="true">—</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </details>

            <details className="isk-accordion border-t border-line">
              <summary className="ui-label flex min-h-12 items-center justify-between text-xs">
                ENVÍOS
              </summary>
              <div className="flex flex-col gap-3 pb-5">
                <Link
                  href="/envios"
                  className="ui-label text-xs text-ink underline underline-offset-4 hover:no-underline"
                >
                  VER POLÍTICA DE ENVÍOS
                </Link>
                <Link
                  href="/cambios"
                  className="ui-label text-xs text-ink underline underline-offset-4 hover:no-underline"
                >
                  VER CAMBIOS Y DEVOLUCIONES
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
