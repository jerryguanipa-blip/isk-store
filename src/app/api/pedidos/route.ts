import { NextResponse } from "next/server";

import { whatsappUrl } from "@/lib/checkout";
import { buildOrderWhatsAppMessage, createOrder, OrderError, type NewOrderItem } from "@/lib/orders";

export const dynamic = "force-dynamic";

/**
 * Guarda el pedido (reserva las tallas unos minutos) y devuelve el enlace de
 * WhatsApp con el pedido ya escrito. El pago se coordina en el chat: la web
 * nunca muestra un número de pago.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: NewOrderItem[] };
    const items = Array.isArray(body.items) ? body.items.slice(0, 10) : [];
    const order = await createOrder(items);
    return NextResponse.json({
      ref: order.ref,
      whatsapp: whatsappUrl(buildOrderWhatsAppMessage(order)),
    });
  } catch (error) {
    const message = error instanceof OrderError ? error.message : "No pudimos crear el pedido.";
    return NextResponse.json({ error: message }, { status: error instanceof OrderError ? 400 : 500 });
  }
}
