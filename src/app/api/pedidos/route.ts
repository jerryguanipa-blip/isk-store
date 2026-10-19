import { NextResponse } from "next/server";

import { createOrder, OrderError, type NewOrderItem } from "@/lib/orders";

export const dynamic = "force-dynamic";

/** Crea un pedido y abre la ventana de pago. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: NewOrderItem[] };
    const items = Array.isArray(body.items) ? body.items.slice(0, 10) : [];
    const order = await createOrder(items);
    return NextResponse.json({ id: order.id, ref: order.ref, expiresAt: order.expiresAt });
  } catch (error) {
    const message = error instanceof OrderError ? error.message : "No pudimos crear el pedido.";
    return NextResponse.json({ error: message }, { status: error instanceof OrderError ? 400 : 500 });
  }
}
