import "server-only";

import { randomUUID } from "node:crypto";

import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { holdStock, readStore, releaseStock, updateStore } from "@/lib/store/db";
import type {
  Order,
  OrderCustomer,
  OrderItem,
  OrderShipping,
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
  StoreData,
} from "@/lib/store/types";
import { SHIPPING_LABEL } from "@/lib/store/types";

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

/** Un código de Yape/Plin: números (a veces con letras), de 4 a 20 caracteres. */
export function isValidPaymentCode(code: string): boolean {
  const clean = code.trim().toUpperCase();
  if (!/^[A-Z0-9-]{4,20}$/.test(clean)) return false;
  return (clean.match(/\d/g)?.length ?? 0) >= 4;
}

export type ConfirmInput = {
  customer: OrderCustomer;
  shipping: OrderShipping;
  method: PaymentMethod;
  code: string;
};

/** El cliente manda su código: el pedido pasa a "por validar". */
export async function confirmOrder(id: string, input: ConfirmInput): Promise<Order> {
  return updateStore((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) throw new OrderError("No encontramos ese pedido.");
    if (order.status === "expirado") throw new OrderError("Se acabó el tiempo para pagar este pedido.");
    if (order.status !== "pendiente_pago" && order.status !== "en_validacion") {
      throw new OrderError("Este pedido ya fue procesado.");
    }

    const name = input.customer.name.trim();
    const phone = input.customer.phone.replace(/\D/g, "");
    if (name.length < 3) throw new OrderError("Escribe tu nombre completo.");
    if (phone.length < 9) throw new OrderError("Escribe un celular válido (9 dígitos).");
    if (!isValidPaymentCode(input.code)) {
      throw new OrderError("El código de operación no parece válido. Revísalo en tu Yape o Plin.");
    }
    const method: ShippingMethod = input.shipping.method === "indriver" ? "indriver" : "shalom";
    if (method === "shalom" && !data.settings.shalom) throw new OrderError("Shalom no está disponible ahora.");
    if (method === "indriver" && !data.settings.indriver) throw new OrderError("InDriver no está disponible ahora.");
    if (input.shipping.city.trim().length < 3) {
      throw new OrderError(method === "shalom" ? "Escribe la ciudad de destino." : "Escribe tu distrito.");
    }
    if (input.shipping.address.trim().length < 3) {
      throw new OrderError(method === "shalom" ? "Escribe la agencia Shalom." : "Escribe tu dirección.");
    }

    order.customer = { name, phone, dni: input.customer.dni.replace(/\D/g, "").slice(0, 12) };
    order.shipping = {
      method,
      city: input.shipping.city.trim().slice(0, 80),
      address: input.shipping.address.trim().slice(0, 160),
      notes: input.shipping.notes.trim().slice(0, 200),
    };
    order.payment = {
      method: input.method === "plin" ? "plin" : "yape",
      code: input.code.trim().toUpperCase(),
      submittedAt: new Date().toISOString(),
    };
    order.status = "en_validacion";
    order.history.push({ at: new Date().toISOString(), status: "en_validacion", note: "El cliente mandó su código" });
    return order;
  });
}

/** Cambia el estado desde el panel. */
export async function setOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
  return updateStore((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) throw new OrderError("No encontramos ese pedido.");
    const wasOpen = order.status === "pendiente_pago" || order.status === "en_validacion" || order.status === "pagado";
    if ((status === "cancelado" || status === "expirado") && wasOpen) releaseStock(data, order);
    order.status = status;
    order.history.push({ at: new Date().toISOString(), status, note });
    return order;
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

/** Texto que se manda al WhatsApp de la tienda cuando el cliente paga. */
export function buildPaymentMessage(order: Order): string {
  const lines = order.items.map(
    (item) => `• ${item.name} · Talla ${item.size} · x${item.qty} · ${formatPrice(item.price * item.qty)}`,
  );
  const shipping = order.shipping;
  return [
    `¡Hola ${siteConfig.name}! 👋 Ya pagué mi pedido.`,
    "",
    `Pedido: ${order.ref}`,
    ...lines,
    `TOTAL: ${formatPrice(order.total)}`,
    "",
    `Pagué con: ${order.payment?.method === "plin" ? "Plin" : "Yape"}`,
    `Código de operación: ${order.payment?.code ?? ""}`,
    "",
    `Nombre: ${order.customer?.name ?? ""}`,
    `Celular: ${order.customer?.phone ?? ""}`,
    order.customer?.dni ? `DNI: ${order.customer.dni}` : null,
    "",
    `Envío: ${shipping ? SHIPPING_LABEL[shipping.method] : ""}`,
    shipping?.method === "shalom"
      ? `Agencia Shalom: ${shipping.address} (${shipping.city})`
      : `Dirección: ${shipping?.address ?? ""} (${shipping?.city ?? ""})`,
    shipping?.notes ? `Referencia: ${shipping.notes}` : null,
    "",
    "Les mando la captura del pago por aquí. ¿Me confirman?",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
