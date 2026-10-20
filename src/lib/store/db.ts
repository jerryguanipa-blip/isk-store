import "server-only";

import { products } from "@/data/products";
import { siteConfig } from "@/config/site";
import { driverKind, isEphemeral, readRaw, writeRaw } from "@/lib/store/driver";
import type { Order, Sale, StoreData, StoreSettings } from "@/lib/store/types";

export { driverKind, isEphemeral };

const DEFAULT_SETTINGS: StoreSettings = {
  windowMinutes: 15,
  price: siteConfig.price,
  shalom: true,
  indriver: true,
  checkoutEnabled: true,
};

/**
 * Compra inicial: los pares que entraron a la tienda. Es la referencia fija
 * del control de caja (no cambia con las ventas).
 */
export const COMPRA_INICIAL: Record<string, Record<string, number>> = {
  "air-force-1-triple-white": { "36": 3, "37": 4, "38": 3, "39": 3, "40": 4, "41": 6, "42": 7, "43": 5, "44": 1 },
  "air-force-1-triple-black": { "36": 3, "37": 3, "38": 3, "39": 3, "40": 4, "41": 5, "42": 6, "43": 7, "44": 2 },
};

/**
 * Stock que manda la tienda (pares por talla). Al subir el número de versión,
 * la web lo vuelve a cargar aunque ya hubiera números guardados en el panel.
 */
const STOCK_VERSION = 3;

const STOCK_INICIAL: Record<string, Record<string, number>> = {
  "air-force-1-triple-white": {
    "36": 1,
    "37": 4,
    "38": 3,
    "39": 2,
    "40": 1,
    "41": 4,
    "42": 5,
    "43": 2,
    "44": 0,
  },
  "air-force-1-triple-black": {
    "36": 3,
    "37": 3,
    "38": 3,
    "39": 3,
    "40": 4,
    "41": 5,
    "42": 6,
    "43": 6,
    "44": 2,
  },
};

/**
 * Ventas que ya estaban hechas antes de tener el panel (las que llevabas en la
 * hoja de control): 14 blancas + 1 negra = 15 pares, S/ 3,000.
 */
const VENTAS_VERSION = 1;

const VENTAS_HISTORICAS: Array<{ slug: string; size: number; qty: number }> = [
  { slug: "air-force-1-triple-white", size: 36, qty: 2 },
  { slug: "air-force-1-triple-white", size: 39, qty: 1 },
  { slug: "air-force-1-triple-white", size: 40, qty: 3 },
  { slug: "air-force-1-triple-white", size: 41, qty: 2 },
  { slug: "air-force-1-triple-white", size: 42, qty: 2 },
  { slug: "air-force-1-triple-white", size: 43, qty: 3 },
  { slug: "air-force-1-triple-white", size: 44, qty: 1 },
  { slug: "air-force-1-triple-black", size: 43, qty: 1 },
];

function ventasHistoricas(): Sale[] {
  const fecha = "2026-10-19T12:00:00.000Z";
  return VENTAS_HISTORICAS.map((v, i) => {
    const producto = products.find((p) => p.slug === v.slug);
    return {
      id: `historico-${i + 1}`,
      at: fecha,
      slug: v.slug,
      colorName: producto?.colorName ?? v.slug,
      size: v.size,
      qty: v.qty,
      unit: siteConfig.price,
      total: siteConfig.price * v.qty,
      source: "historico" as const,
      note: "Ventas anteriores al panel",
    };
  });
}

function emptyInventory(): StoreData["inventory"] {
  const inventory: StoreData["inventory"] = {};
  for (const product of products) {
    const sizes: Record<string, number | null> = {};
    for (const size of product.sizes) {
      const inicial = STOCK_INICIAL[product.slug]?.[String(size.eur)];
      // null = sin control de stock; un número = pares disponibles
      sizes[String(size.eur)] = typeof inicial === "number" ? inicial : null;
    }
    inventory[product.slug] = sizes;
  }
  return inventory;
}

function defaults(): StoreData {
  return {
    version: 1,
    stockVersion: STOCK_VERSION,
    salesVersion: VENTAS_VERSION,
    settings: { ...DEFAULT_SETTINGS },
    inventory: emptyInventory(),
    orders: [],
    sales: ventasHistoricas(),
  };
}

/** Rellena lo que falte: productos o tallas nuevas, ajustes nuevos. */
function normalize(data: StoreData): StoreData {
  const base = defaults();
  // Stock nuevo mandado desde el código: pisa lo guardado una sola vez.
  const stockFresco = (data.stockVersion ?? 0) < STOCK_VERSION;
  const inventory: StoreData["inventory"] = {};
  for (const [slug, sizes] of Object.entries(base.inventory)) {
    inventory[slug] = stockFresco ? { ...sizes } : { ...sizes, ...(data.inventory?.[slug] ?? {}) };
  }
  // El histórico de ventas se carga una sola vez, al subir su versión.
  const ventasFrescas = (data.salesVersion ?? 0) < VENTAS_VERSION;
  const sales = ventasFrescas ? ventasHistoricas() : Array.isArray(data.sales) ? data.sales : [];
  // Los pedidos que vencieron o se cancelaron no se guardan: el panel solo
  // muestra pedidos vivos y ventas concretadas.
  const orders = (Array.isArray(data.orders) ? data.orders : []).filter(
    (order) => order.status !== "expirado" && order.status !== "cancelado",
  );
  return {
    version: 1,
    stockVersion: STOCK_VERSION,
    salesVersion: VENTAS_VERSION,
    // el precio vive en el código (una sola fuente para la web y los pedidos)
    settings: { ...base.settings, ...(data.settings ?? {}), price: siteConfig.price },
    inventory,
    orders,
    sales,
  };
}

/** Cierra los pedidos a los que se les acabó el tiempo y devuelve el stock. */
function expireOverdue(data: StoreData): boolean {
  const now = Date.now();
  let changed = false;
  for (const order of data.orders) {
    if (order.status !== "pendiente_pago") continue;
    if (new Date(order.expiresAt).getTime() > now) continue;
    order.status = "expirado";
    order.history.push({ at: new Date().toISOString(), status: "expirado", note: "Se acabó el tiempo" });
    releaseStock(data, order);
    changed = true;
  }
  return changed;
}

/** Descuenta stock al crear el pedido (si hay inventario cargado). */
export function holdStock(data: StoreData, order: Order): boolean {
  for (const item of order.items) {
    const current = data.inventory[item.slug]?.[String(item.size)];
    if (current === null || current === undefined) continue;
    if (current < item.qty) return false;
  }
  for (const item of order.items) {
    const sizes = data.inventory[item.slug];
    const current = sizes?.[String(item.size)];
    if (sizes && typeof current === "number") sizes[String(item.size)] = current - item.qty;
  }
  return true;
}

/** Devuelve el stock cuando el pedido expira o se cancela. */
export function releaseStock(data: StoreData, order: Order): void {
  for (const item of order.items) {
    const sizes = data.inventory[item.slug];
    const current = sizes?.[String(item.size)];
    if (sizes && typeof current === "number") sizes[String(item.size)] = current + item.qty;
  }
}

let queue: Promise<unknown> = Promise.resolve();

/** Serializa las escrituras para que dos pedidos a la vez no se pisen. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function load(): Promise<StoreData> {
  const raw = await readRaw();
  if (!raw) return defaults();
  try {
    return normalize(JSON.parse(raw) as StoreData);
  } catch {
    return defaults();
  }
}

/**
 * Lectura (con expiración perezosa de los pedidos vencidos).
 * Siempre lee el origen: guardar el JSON en memoria haría que una página
 * mostrara un pedido que otra ruta acaba de crear como inexistente.
 */
export async function readStore(): Promise<StoreData> {
  return withLock(async () => {
    const data = await load();
    if (expireOverdue(data)) {
      await writeRaw(JSON.stringify(data));
    }
    return data;
  });
}

/** Lectura + escritura atómica. */
export async function updateStore<T>(fn: (data: StoreData) => T | Promise<T>): Promise<T> {
  return withLock(async () => {
    const data = await load();
    expireOverdue(data);
    const result = await fn(data);
    // Se guardan solo los últimos 500 pedidos para que el JSON no crezca sin control
    data.orders = data.orders.slice(-500);
    await writeRaw(JSON.stringify(data));
    return result;
  });
}
