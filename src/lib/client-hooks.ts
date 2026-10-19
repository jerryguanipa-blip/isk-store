"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * `false` mientras se renderiza en el servidor y durante la hidratación,
 * `true` una vez que el componente ya vive en el navegador.
 *
 * Sirve para no pintar datos que solo existen en el navegador (como el
 * carrito guardado en localStorage) antes de tiempo, sin provocar errores
 * de hidratación y sin llamar a setState dentro de un efecto.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Lee una media query de forma reactiva. En el servidor siempre devuelve
 * `false`, así que el primer render coincide con el HTML enviado.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export type StockResponse = {
  inventory: Record<string, Record<string, number | null>>;
  checkoutEnabled: boolean;
};

/**
 * Tallas agotadas según el inventario del panel. Mientras carga (o si el
 * servidor no responde) no bloquea nada: se asume que hay stock.
 */
export function useSoldOutSizes(slug: string): number[] {
  const [soldOut, setSoldOut] = useState<number[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/stock", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<StockResponse>) : null))
      .then((data) => {
        if (!active || !data) return;
        const sizes = data.inventory?.[slug] ?? {};
        setSoldOut(
          Object.entries(sizes)
            .filter(([, stock]) => typeof stock === "number" && stock <= 0)
            .map(([size]) => Number(size)),
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [slug]);

  return soldOut;
}
