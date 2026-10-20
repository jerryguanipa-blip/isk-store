import "server-only";

import { randomUUID } from "node:crypto";

import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { holdStock, readStore, releaseStock, updateStore } from "@/lib/store/db";
import type { Order, OrderItem, OrderStatus, StoreData } from "@/lib/store/types";

export type NewOrderItem = { slug: string; size: number; qty: number };

export class OrderError extends Error {}

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeRef(): string {
  let out = "";
  for (let i = 0; i < 4; i += 1) {
    out += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
  }
  return `ISK-${out}`;
}

function resolveItems(data: StoreData, input: NewOrderItem[]): OrderItem[] {
  if (!input.length) throw new OrderError("El pedido está vacío.");
  const items: OrderItem[] = [];
  for (const raw of input) {
    const product = products.find((p) => p.slug === raw.slug);
    if (!product) throw new OrderError("Ese modelo no existe.");
    const size = product.sizes.find((s) => s.eur === Number(raw.size));
    if (!size || !size.available) throw new OrderError("Esa talla no está disponible.");
    const qty = Math.min(Math.max(Math.trunc(Number(raw.qty) || 1), 1), 5);
    items.push({
      slug: product.slug,
      name: product.shortName,
      colorName: product.colorName,
      size: size.eur,
      qty,
      price: data.settings.price,
    });
  }
  return items;
}

export function orderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/** Crea el pedido y abre la ventana de pago. */
export async function createOrder(input: NewOrderItem[]): Promise<Order> {
  return updateStore((data) => {
    if (!data.settings.checkoutEnabled) {
      throw new OrderError("El pago por la web está desactivado. Escríbenos por WhatsApp.");
    }
    const items = resolveItems(data, input);
    const now = new Date();
    const minutes = Math.min(Math.max(data.settings.windowMinutes || 15, 5), 60);
    const order: Order = {
      id: randomUUID(),
      ref: makeRef(),
      status: "pendiente_pago",
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + minutes * 60_000).toISOString(),
      items,
      total: orderTotal(items),
      customer: null,
      shipping: null,
      payment: null,
      tracking: "",
      history: [{ at: now.toISOString(), status: "pendiente_pago", note: "Pedido creado" }],
    };
    if (!holdStock(data, order)) throw new OrderError("Se acaba de agotar esa talla.");
    data.orders.push(order);
    return order;
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  const data = await readStore();
  return data.orders.find((order) => order.id === id) ?? null;
}

export function minutesLeft(order: Order): number {
  return Math.max(0, new Date(order.expiresAt).getTime() - Date.now());
}

/** Cambia el estado desde el panel. */
export async function setOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
  return updateStore((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) throw new OrderError("No encontramos ese pedido.");
    const wasOpen = order.status === "pendiente_pago" || order.status === "en_validacion" || order.status === "pagado";
    if ((status === "cancelado" || status === "expirado") && wasOpen) releaseStock(data, order);
    if (status === "pagado" || status === "enviado") anotarEnCaja(data, order);
    if (status === "cancelado" || status === "expirado") borrarDeCaja(data, order);
    order.status = status;
    order.history.push({ at: new Date().toISOString(), status, note });
    return order;
  });
}

/** Al confirmar la venta, el pedido entra a caja (una sola vez). */
function anotarEnCaja(data: StoreData, order: Order): void {
  data.sales = data.sales ?? [];
  if (data.sales.some((v) => v.orderRef === order.ref)) return;
  const ahora = new Date().toISOString();
  for (const item of order.items) {
    data.sales.push({
      id: `${order.id}-${item.slug}-${item.size}`,
      at: ahora,
      slug: item.slug,
      colorName: item.colorName,
      size: item.size,
      qty: item.qty,
      unit: item.price,
      total: item.price * item.qty,
      source: "web",
      orderRef: order.ref,
    });
  }
}

/** Si se cancela un pedido ya confirmado, su venta sale de caja. */
function borrarDeCaja(data: StoreData, order: Order): void {
  if (!data.sales) return;
  data.sales = data.sales.filter((v) => v.orderRef !== order.ref);
}

/** Venta cargada a mano desde el panel (la que no pasó por la web). */
export async function registrarVenta(
  slug: string,
  size: number,
  qty: number,
  note: string,
): Promise<void> {
  await updateStore((data) => {
    const producto = products.find((p) => p.slug === slug);
    if (!producto) throw new OrderError("Ese modelo no existe.");
    if (!producto.sizes.some((s) => s.eur === size)) throw new OrderError("Esa talla no existe.");
    const pares = Math.max(1, Math.min(Math.trunc(qty) || 1, 50));

    const stock = data.inventory[slug]?.[String(size)];
    if (typeof stock === "number") {
      if (stock < pares) throw new OrderError(`Solo quedan ${stock} pares de esa talla.`);
      data.inventory[slug][String(size)] = stock - pares;
    }

    data.sales = data.sales ?? [];
    data.sales.push({
      id: `manual-${Date.now().toString(36)}`,
      at: new Date().toISOString(),
      slug,
      colorName: producto.colorName,
      size,
      qty: pares,
      unit: siteConfig.price,
      total: siteConfig.price * pares,
      source: "manual",
      note: note.trim().slice(0, 120) || undefined,
    });
  });
}

/** Deshace una venta: la saca de caja y devuelve los pares al stock. */
export async function anularVenta(id: string): Promise<void> {
  await updateStore((data) => {
    const venta = (data.sales ?? []).find((v) => v.id === id);
    if (!venta) throw new OrderError("No encontramos esa venta.");
    const stock = data.inventory[venta.slug]?.[String(venta.size)];
    if (typeof stock === "number") {
      data.inventory[venta.slug][String(venta.size)] = stock + venta.qty;
    }
    data.sales = (data.sales ?? []).filter((v) => v.id !== id);
  });
}

export async function setTracking(id: string, tracking: string): Promise<Order> {
  return updateStore((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) throw new OrderError("No encontramos ese pedido.");
    order.tracking = tracking.trim().slice(0, 80);
    return order;
  });
}

/**
 * Texto que el cliente manda a la tienda por WhatsApp. No pide datos
 * personales ni muestra ningún número de pago: eso se coordina en el chat.
 */
export function buildOrderWhatsAppMessage(order: Order): string {
  const lines = order.items.map(
    (item) => `• ${item.name} · Talla EUR ${item.size} · ${item.qty} par${item.qty > 1 ? "es" : ""}`,
  );
  const pares = order.items.reduce((sum, item) => sum + item.qty, 0);
  return [
    `¡Hola ${siteConfig.name}! 👋 Quiero este pedido:`,
    "",
    ...lines,
    "",
    `TOTAL: ${pares} par${pares > 1 ? "es" : ""} · ${formatPrice(order.total)}`,
    `Código del pedido: ${order.ref}`,
    "",
    "¿Me pasan los datos para pagar y coordinamos el envío?",
  ].join("\n");
}
