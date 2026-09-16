import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/store/cart";
import { cartSubtotal } from "@/store/cart";

/**
 * Estructura pensada para que mañana se pueda enchufar Mercado Pago o Culqi
 * sin tocar el carrito ni las páginas: basta con escribir otro provider
 * que cumpla esta interfaz.
 */
export type CheckoutPayload = {
  items: CartItem[];
  total: number;
};

export type PaymentProvider = {
  id: string;
  label: string;
  /** Devuelve la URL a la que hay que mandar al cliente para pagar / pedir. */
  createCheckoutUrl: (payload: CheckoutPayload) => string;
};

/** Arma el texto del pedido para WhatsApp. */
export function buildOrderMessage(items: CartItem[]): string {
  const total = cartSubtotal(items);
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name}\n   Color: ${item.colorName}\n   Talla EUR: ${item.size}\n   Cantidad: ${item.qty}\n   Precio: ${formatPrice(item.price * item.qty)}`,
  );

  return [
    `¡Hola ${siteConfig.name}! 👋`,
    "",
    "Quiero hacer este pedido:",
    "",
    ...lines,
    "",
    `TOTAL: ${formatPrice(total)}`,
    "",
    "Mis datos para el envío:",
    "• Nombre completo:",
    "• Dirección:",
    "• Distrito:",
    "",
    "¿Me confirmas disponibilidad y el tiempo de entrega? Gracias.",
  ].join("\n");
}

/** Mensaje corto para el botón "COMPRAR POR WHATSAPP" de la ficha de producto. */
export function buildProductMessage(
  productName: string,
  colorName: string,
  size: number | null,
  price: number,
): string {
  return [
    `¡Hola ${siteConfig.name}! 👋`,
    "",
    `Me interesa: ${productName}`,
    `Color: ${colorName}`,
    size ? `Talla EUR: ${size}` : "Talla EUR: (por confirmar)",
    `Precio: ${formatPrice(price)}`,
    "",
    "Mis datos para el envío:",
    "• Nombre completo:",
    "• Dirección:",
    "• Distrito:",
    "",
    "¿Está disponible?",
  ].join("\n");
}

/** Mensaje de los botones "COMPRAR VÍA WHATSAPP" de la landing. */
export function buildLandingMessage(colorName?: string): string {
  const lines = colorName
    ? [`Quiero comprar las Air Force 1 '07 ${colorName} (${formatPrice(siteConfig.price)}).`]
    : [
        `Quiero comprar unas Air Force 1 '07 (${formatPrice(siteConfig.price)}).`,
        "Color (White o Black):",
      ];
  return [
    `¡Hola ${siteConfig.name}! 👋`,
    "",
    ...lines,
    "Mi talla EUR es:",
    "",
    "¿Tienen disponible?",
  ].join("\n");
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const whatsappProvider: PaymentProvider = {
  id: "whatsapp",
  label: "FINALIZAR PEDIDO POR WHATSAPP",
  createCheckoutUrl: ({ items }) => whatsappUrl(buildOrderMessage(items)),
};

/**
 * Provider activo. Para migrar a Mercado Pago / Culqi:
 * 1. Crea `src/lib/providers/mercadopago.ts` que exporte un PaymentProvider.
 * 2. Impórtalo aquí y cámbialo en esta línea.
 */
export const activeProvider: PaymentProvider = whatsappProvider;
