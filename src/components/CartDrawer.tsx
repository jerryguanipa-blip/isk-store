"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { activeProvider } from "@/lib/checkout";
import { useHydrated } from "@/lib/client-hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const hydrated = useHydrated();
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const subtotal = cartSubtotal(items);
  const checkoutUrl = activeProvider.createCheckoutUrl({ items, total: subtotal });

  if (!hydrated) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar carrito"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed top-0 right-0 z-[120] flex h-dvh w-full max-w-md flex-col border-l border-white/10 bg-black"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="ui-label text-xs">TU CARRITO ({cartCount(items)})</h2>
              <button type="button" onClick={closeCart} aria-label="Cerrar carrito">
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <p className="display text-2xl">TU CARRITO ESTÁ VACÍO</p>
                <p className="text-sm text-white/50">
                  Dos colores. Nueve tallas. Un solo precio.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="ui-label border border-white px-8 py-4 text-xs transition-colors hover:bg-white hover:text-black"
                >
                  VER LA TIENDA
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-white/10 overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 px-6 py-5">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-24 shrink-0 overflow-hidden bg-white"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="isk-product object-contain"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="ui-label block text-[11px] leading-snug hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs text-white/50">
                            {item.colorName} · Talla EUR {item.size}
                          </p>
                          <p className="mt-1 text-xs tabular-nums text-white/70">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-white/20">
                            <button
                              type="button"
                              onClick={() => setQty(item.id, item.qty - 1)}
                              aria-label={`Quitar una unidad de ${item.name} talla ${item.size}`}
                              className="px-3 py-2 transition-colors hover:bg-white hover:text-black"
                            >
                              <Minus className="h-3 w-3" aria-hidden="true" />
                            </button>
                            <span className="min-w-8 text-center text-xs tabular-nums">
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
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-white/10 px-6 py-6">
                  <div className="flex items-center justify-between">
                    <span className="ui-label text-xs">SUBTOTAL</span>
                    <span className="text-lg tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-2 text-xs text-white/55">
                    El costo de envío se confirma por WhatsApp según tu distrito.
                  </p>

                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-label mt-5 flex w-full items-center justify-center bg-white px-6 py-4 text-xs text-black transition-opacity hover:opacity-80"
                  >
                    {activeProvider.label}
                  </a>

                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="ui-label mt-3 flex w-full items-center justify-center border border-white/25 px-6 py-4 text-xs transition-colors hover:border-white"
                  >
                    VER EL CARRITO COMPLETO
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
