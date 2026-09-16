"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { cartSubtotal, useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { activeProvider } from "@/lib/checkout";
import { useHydrated } from "@/lib/client-hooks";
import { siteConfig } from "@/config/site";

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
      <p className="py-20 text-sm text-white/55" role="status">
        Cargando tu carrito…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border-y border-white/10 py-20">
        <p className="display text-3xl sm:text-4xl">TU CARRITO ESTÁ VACÍO</p>
        <p className="max-w-sm text-sm leading-relaxed text-white/50">
          Todavía no agregaste nada. Dos colores, nueve tallas, un solo precio.
        </p>
        <Link
          href="/shop"
          className="ui-label border border-white px-10 py-4 text-xs transition-colors hover:bg-white hover:text-black"
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
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {items.map((item) => (
            <li key={item.id} className="flex gap-5 py-6">
              <Link
                href={`/product/${item.slug}`}
                className="relative h-36 w-28 shrink-0 overflow-hidden bg-neutral-950 sm:h-44 sm:w-36"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="144px"
                  className="isk-photo object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="ui-label text-[11px] leading-snug hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-2 text-xs text-white/50">
                    {item.colorName} · Talla EUR {item.size}
                  </p>
                  <p className="mt-2 text-sm tabular-nums text-white/70">
                    {formatPrice(item.price)} c/u
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-white/20">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      aria-label={`Quitar una unidad de ${item.name} talla ${item.size}`}
                      className="px-3 py-2 transition-colors hover:bg-white hover:text-black"
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
                      className="px-3 py-2 transition-colors hover:bg-white hover:text-black"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="ui-label text-[10px] text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
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
            className="ui-label text-[11px] text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            ← SEGUIR COMPRANDO
          </Link>
          <button
            type="button"
            onClick={clear}
            className="ui-label text-[11px] text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            VACIAR CARRITO
          </button>
        </div>
      </div>

      {/* Resumen */}
      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="border border-white/15 p-6 sm:p-8">
          <h2 className="ui-label text-xs">RESUMEN DEL PEDIDO</h2>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-white/50">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-white/50">Envío</dt>
              <dd className="text-white/50">Se calcula por WhatsApp</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="ui-label text-xs">TOTAL</span>
            <span className="text-xl tabular-nums">{formatPrice(subtotal)}</span>
          </div>

          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ui-label mt-8 flex w-full items-center justify-center bg-white px-6 py-4 text-center text-xs text-black transition-opacity hover:opacity-80"
          >
            {activeProvider.label}
          </a>

          <p className="mt-4 text-xs leading-relaxed text-white/55">
            Al tocar el botón se abre WhatsApp con tu pedido ya escrito. Solo tienes que
            completar tu nombre, dirección y distrito, y enviarlo.
          </p>

          {!siteConfig.whatsappConfigured && (
            <p className="mt-4 border border-white/20 p-3 text-[11px] leading-relaxed text-white/60">
              Aviso para el administrador: falta configurar un número real en
              NEXT_PUBLIC_WHATSAPP.
            </p>
          )}
        </div>

        <ul className="mt-6 space-y-2 text-xs text-white/55">
          {siteConfig.benefits.map((benefit) => (
            <li key={benefit.title}>· {benefit.title}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
