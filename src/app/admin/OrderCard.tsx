import { orderStatusAction, trackingAction } from "@/app/admin/actions";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/store/types";
import { ORDER_STATUS_LABEL, SHIPPING_LABEL } from "@/lib/store/types";

function when(iso: string): string {
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Lima",
  });
}

function StatusButton({ id, status, label }: { id: string; status: OrderStatus; label: string }) {
  return (
    <form action={orderStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className="ui-label min-h-11 border border-ink px-4 text-[11px]">
        {label}
      </button>
    </form>
  );
}

export function OrderCard({ order }: { order: Order }) {
  const highlight = order.status === "en_validacion";
  const phone = order.customer?.phone ? order.customer.phone.replace(/\D/g, "") : "";
  const waNumber = phone.length === 9 ? `51${phone}` : phone;

  return (
    <article className={`border p-4 ${highlight ? "border-ink bg-surface" : "border-line"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="ui-label text-xs">
          {order.ref} · {ORDER_STATUS_LABEL[order.status]}
        </p>
        <p className="text-xs text-muted">{when(order.createdAt)}</p>
      </div>

      <p className="mt-3 text-sm">
        {order.items
          .map((item) => `${item.colorName} · EUR ${item.size} · x${item.qty}`)
          .join("  |  ")}
      </p>
      <p className="mt-1 text-sm tabular-nums">{formatPrice(order.total)}</p>

      {order.payment ? (
        <p className="mt-3 text-sm">
          <span className="text-muted">{order.payment.method === "plim" ? "Plim" : "Yape"} · código: </span>
          <strong className="tabular-nums">{order.payment.code}</strong>
          <span className="text-muted"> ({when(order.payment.submittedAt)})</span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Sin código todavía. Vence {when(order.expiresAt)}.
        </p>
      )}

      {order.customer ? (
        <p className="mt-2 text-sm text-muted">
          {order.customer.name} · {order.customer.phone}
          {order.customer.dni ? ` · DNI ${order.customer.dni}` : ""}
        </p>
      ) : null}

      {order.shipping ? (
        <p className="mt-1 text-sm text-muted">
          {SHIPPING_LABEL[order.shipping.method]} · {order.shipping.address} ({order.shipping.city})
          {order.shipping.notes ? ` · ${order.shipping.notes}` : ""}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {order.status === "en_validacion" ? (
          <StatusButton id={order.id} status="pagado" label="CONFIRMAR PAGO" />
        ) : null}
        {(order.status === "pagado" || order.status === "en_validacion") ? (
          <StatusButton id={order.id} status="enviado" label="MARCAR ENVIADO" />
        ) : null}
        {order.status !== "cancelado" && order.status !== "expirado" ? (
          <StatusButton id={order.id} status="cancelado" label="CANCELAR" />
        ) : null}
        {waNumber ? (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ui-label min-h-11 border border-line px-4 text-[11px] leading-[2.75rem]"
          >
            WHATSAPP DEL CLIENTE
          </a>
        ) : null}
      </div>

      {order.status === "pagado" || order.status === "enviado" ? (
        <form action={trackingAction} className="mt-3 flex flex-wrap gap-2">
          <input type="hidden" name="id" value={order.id} />
          <input
            name="tracking"
            defaultValue={order.tracking}
            placeholder="Código Shalom / InDriver"
            className="min-h-11 flex-1 border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
          />
          <button type="submit" className="ui-label min-h-11 border border-ink px-4 text-[11px]">
            GUARDAR
          </button>
        </form>
      ) : null}
    </article>
  );
}
