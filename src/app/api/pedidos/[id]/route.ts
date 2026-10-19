import { NextResponse } from "next/server";

import { whatsappUrl } from "@/lib/checkout";
import {
  buildPaymentMessage,
  confirmOrder,
  getOrder,
  OrderError,
  type ConfirmInput,
} from "@/lib/orders";

export const dynamic = "force-dynamic";

/** Estado del pedido (lo consulta el contador de 15 minutos). */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "No encontramos ese pedido." }, { status: 404 });
  return NextResponse.json({ status: order.status, expiresAt: order.expiresAt, ref: order.ref });
}

/** El cliente manda sus datos y el código de operación de Yape/Plim. */
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const body = (await request.json()) as ConfirmInput;
    const order = await confirmOrder(id, body);
    return NextResponse.json({
      ok: true,
      ref: order.ref,
      whatsapp: whatsappUrl(buildPaymentMessage(order)),
    });
  } catch (error) {
    const message = error instanceof OrderError ? error.message : "No pudimos registrar tu pago.";
    return NextResponse.json({ error: message }, { status: error instanceof OrderError ? 400 : 500 });
  }
}
