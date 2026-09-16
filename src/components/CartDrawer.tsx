"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { getProduct } from "@/data/products";
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
            className="fixed inset-0 z-[110] bg-black/40"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed top-0 right-0 z-[120] flex h-dvh w-full max-w-md flex-col border-l border-line bg-paper text-ink"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="ui-label text-xs">TU CARRITO ({cartCount(items)})</h2>
              <button type="button" onClick={closeCart} aria-label="Cerrar carrito">
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <p className="display text-xl">TU CARRITO ESTÁ VACÍO</p>
                <p className="text-sm text-muted">
                  Dos colores. Nueve tallas. Un solo precio.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="btn btn-secondary"
                >
                  VER LA TIENDA
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 px-6 py-5">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className={`relative h-24 w-24 shrink-0 overflow-hidden bg-surface`}
                      >
                        <Image
                          src={getProduct(item.slug)?.images[0]?.src ?? item.image}
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
                            className="ui-label block text-xs leading-snug hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs text-muted">
                            {item.colorName} · Talla EUR {item.size}
                          </p>
                          <p className="mt-1 text-xs tabular-nums text-muted">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() => setQty(item.id, item.qty - 1)}
                              aria-label={`Quitar una unidad de ${item.name} talla ${item.size}`}
                              className="px-3 py-2 transition-colors hover:bg-ink hover:text-white"
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
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-line px-6 py-6">
                  <div className="flex items-center justify-between">
                    <span className="ui-label text-xs">SUBTOTAL</span>
                    <span className="text-lg tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    El costo de envío se confirma por WhatsApp según tu distrito.
                  </p>

                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-5 w-full"
                  >
                    {activeProvider.label}
                  </a>

                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="btn btn-secondary mt-3 w-full"
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
