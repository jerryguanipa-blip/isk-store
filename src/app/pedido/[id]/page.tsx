import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PaymentPanel } from "@/app/pedido/[id]/PaymentPanel";
import { siteConfig } from "@/config/site";
import { buildLandingMessage, whatsappUrl } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { buildPaymentMessage, getOrder } from "@/lib/orders";
import { readStore } from "@/lib/store/db";
import { ORDER_STATUS_LABEL, SHIPPING_LABEL } from "@/lib/store/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const { settings } = await readStore();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-10 pb-24 sm:px-6 lg:pt-16">
      <p className="eyebrow text-muted">PEDIDO {order.ref}</p>
      <h1 className="display mt-2 text-3xl sm:text-4xl">
        {order.status === "pendiente_pago" ? "PAGA TU PEDIDO" : ORDER_STATUS_LABEL[order.status].toUpperCase()}
      </h1>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={`${item.slug}-${item.size}`} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-sm text-muted">
                Talla EUR {item.size} · {item.qty} par{item.qty > 1 ? "es" : ""}
              </p>
            </div>
            <p className="tabular-nums text-sm">{formatPrice(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <p className="ui-label text-xs">TOTAL</p>
        <p className="tabular-nums text-lg">{formatPrice(order.total)}</p>
      </div>
      <p className="mt-1 text-xs text-muted">
        El envío por Shalom o InDriver se coordina aparte, al momento, por WhatsApp.
      </p>

      {order.status === "pendiente_pago" ? (
        <PaymentPanel
          orderId={order.id}
          expiresAt={order.expiresAt}
          yape={settings.yape}
          plin={settings.plin}
          holder={settings.holder}
          shalom={settings.shalom}
          indriver={settings.indriver}
          total={order.total}
        />
      ) : (
        <div className="mt-10 border border-line bg-surface p-6">
          <p className="text-sm">
            {order.status === "en_validacion" &&
              "Recibimos tu código. Estamos validando tu pago y te confirmamos por WhatsApp."}
            {order.status === "pagado" && "Tu pago está confirmado. Estamos preparando tu envío."}
            {order.status === "enviado" &&
              `Tu pedido ya salió${order.tracking ? ` (seguimiento: ${order.tracking})` : ""}.`}
            {order.status === "expirado" &&
              "Se acabó el tiempo para pagar este pedido. Puedes hacerlo de nuevo desde la tienda."}
            {order.status === "cancelado" && "Este pedido fue cancelado."}
          </p>
          {order.shipping ? (
            <p className="mt-3 text-sm text-muted">
              Envío: {SHIPPING_LABEL[order.shipping.method]} · {order.shipping.address} ({order.shipping.city})
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={order.payment ? whatsappUrl(buildPaymentMessage(order)) : whatsappUrl(buildLandingMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {order.payment ? "MANDAR MI PEDIDO POR WHATSAPP" : "ESCRIBIR POR WHATSAPP"}
            </a>
            <Link href="/shop" className="btn btn-secondary">
              VOLVER A LA TIENDA
            </Link>
          </div>
        </div>
      )}

      <p className="mt-10 text-xs text-muted">
        ¿Dudas? Escríbenos al WhatsApp de {siteConfig.name} con el código {order.ref}.
      </p>
    </div>
  );
}
