import "server-only";

import { products } from "@/data/products";
import { siteConfig } from "@/config/site";
import { driverKind, isEphemeral, readRaw, writeRaw } from "@/lib/store/driver";
import type { Order, StoreData, StoreSettings } from "@/lib/store/types";

export { driverKind, isEphemeral };

const DEFAULT_SETTINGS: StoreSettings = {
  dale: "983501670",
  yape: "",
  plin: "",
  holder: "Jerimy G.",
  windowMinutes: 15,
  price: siteConfig.price,
  shalom: true,
  indriver: true,
  checkoutEnabled: true,
};

/**
 * Stock de arranque (pares por talla), el que nos pasó la tienda.
 * Si el panel ya guardó números, mandan los del panel.
 */
const STOCK_INICIAL: Record<string, Record<string, number>> = {
  "air-force-1-triple-white": {
    "36": 3,
    "37": 4,
    "38": 3,
    "39": 3,
    "40": 4,
    "41": 6,
    "42": 7,
    "43": 5,
    "44": 1,
  },
  "air-force-1-triple-black": {
    "36": 3,
    "37": 3,
    "38": 3,
    "39": 3,
    "40": 4,
    "41": 5,
    "42": 6,
    "43": 7,
    "44": 2,
  },
};

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
  return { version: 1, settings: { ...DEFAULT_SETTINGS }, inventory: emptyInventory(), orders: [] };
}

/** Rellena lo que falte: productos o tallas nuevas, ajustes nuevos. */
function normalize(data: StoreData): StoreData {
  const base = defaults();
  const inventory: StoreData["inventory"] = {};
  for (const [slug, sizes] of Object.entries(base.inventory)) {
    inventory[slug] = { ...sizes, ...(data.inventory?.[slug] ?? {}) };
  }
  return {
    version: 1,
    // el precio vive en el código (una sola fuente para la web y los pedidos)
    settings: { ...base.settings, ...(data.settings ?? {}), price: siteConfig.price },
    inventory,
    orders: Array.isArray(data.orders) ? data.orders : [],
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
