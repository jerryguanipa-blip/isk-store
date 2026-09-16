"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { cartSubtotal, useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { getProduct } from "@/data/products";
import { activeProvider } from "@/lib/checkout";
import { useHydrated } from "@/lib/client-hooks";

export function CartView() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const subtotal = cartSubtotal(items);
  const checkoutUrl = activeProvider.createCheckoutUrl({ items, total: subtotal });

  if (!hydrated) {
    return (
      <p className="py-20 text-sm text-muted" role="status">
        Cargando tu carrito…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border-y border-line py-20">
        <p className="display text-2xl sm:text-3xl">TU CARRITO ESTÁ VACÍO</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          Todavía no agregaste nada. Dos colores, nueve tallas, un solo precio.
        </p>
        <Link
          href="/shop"
          className="btn btn-secondary"
        >
          VER LA TIENDA
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
      {/* Líneas del carrito */}
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-5 py-6">
              <Link
                href={`/product/${item.slug}`}
                className={`relative h-28 w-28 shrink-0 overflow-hidden sm:h-36 sm:w-36 bg-surface`}
              >
                <Image
                  src={getProduct(item.slug)?.images[0]?.src ?? item.image}
                  alt={item.name}
                  fill
                  sizes="144px"
                  className="isk-product object-contain"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="ui-label text-xs leading-snug hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-2 text-xs text-muted">
                    {item.colorName} · Talla EUR {item.size}
                  </p>
                  <p className="mt-2 text-sm tabular-nums text-muted">
                    {formatPrice(item.price)} c/u
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      aria-label={`Quitar una unidad de ${item.name} talla ${item.size}`}
                      className="px-3 py-2 transition-colors hover:bg-ink hover:text-white"
                    >
                      <Minus className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <span className="min-w-10 text-center text-sm tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      aria-label={`Agregar una unidad de ${item.name} talla ${item.size}`}
                      className="px-3 py-2 transition-colors hover:bg-ink hover:text-white"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="ui-label text-xs text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    QUITAR
                  </button>

                  <span className="ml-auto text-sm tabular-nums">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-6">
          <Link
            href="/shop"
            className="ui-label text-xs text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            ← SEGUIR COMPRANDO
          </Link>
          <button
            type="button"
            onClick={clear}
            className="ui-label text-xs text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            VACIAR CARRITO
          </button>
        </div>
      </div>

      {/* Resumen */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-line p-6 sm:p-8">
          <h2 className="ui-label text-xs">RESUMEN DEL PEDIDO</h2>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Envío</dt>
              <dd className="text-muted">Se calcula por WhatsApp</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
            <span className="ui-label text-xs">TOTAL</span>
            <span className="text-xl tabular-nums">{formatPrice(subtotal)}</span>
          </div>

          <a
            href={checkoutUrl}
            data-cta
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-8 w-full"
          >
            {activeProvider.label}
          </a>

          <p className="mt-4 text-xs leading-relaxed text-muted">
            Al tocar el botón se abre WhatsApp con tu pedido ya escrito. Solo tienes que
            completar tu nombre, dirección y distrito, y enviarlo.
          </p>
        </div>
      </aside>
    </div>
  );
}
