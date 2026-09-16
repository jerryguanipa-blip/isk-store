"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartItem = {
  /** slug + talla — identifica una línea del carrito */
  id: string;
  slug: string;
  name: string;
  colorName: string;
  size: number;
  price: number;
  image: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (product: Product, size: number, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const lineId = (slug: string, size: number) => `${slug}__${size}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      add: (product, size, qty = 1) =>
        set((state) => {
          const id = lineId(product.slug, size);
          const existing = state.items.find((i) => i.id === id);
          const items = existing
            ? state.items.map((i) =>
                i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i,
              )
            : [
                ...state.items,
                {
                  id,
                  slug: product.slug,
                  name: product.shortName,
                  colorName: product.colorName,
                  size,
                  price: product.price,
                  image: product.images[0]?.src ?? "",
                  qty,
                },
              ];
          return { items, isOpen: true };
        }),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id ? { ...i, qty: Math.min(qty, 99) } : i,
                ),
        })),

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "isk-cart",
      // el panel nunca debe quedar abierto al recargar
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.qty, 0);

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.qty * item.price, 0);
