import type { Metadata } from "next";

import { inventoryAction, logoutAction, settingsAction } from "@/app/admin/actions";
import { InventoryGrid } from "@/app/admin/InventoryGrid";
import { LoginForm } from "@/app/admin/LoginForm";
import { OrderCard } from "@/app/admin/OrderCard";
import { products } from "@/data/products";
import { siteConfig } from "@/config/site";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";
import { isEphemeral, readStore } from "@/lib/store/db";
import type { OrderStatus } from "@/lib/store/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel · ISK",
  robots: { index: false, follow: false, nocache: true },
};

const ORDER_PRIORITY: OrderStatus[] = [
  "en_validacion",
  "pendiente_pago",
  "pagado",
  "enviado",
  "expirado",
  "cancelado",
];

function priority(status: OrderStatus): number {
  const index = ORDER_PRIORITY.indexOf(status);
  return index === -1 ? ORDER_PRIORITY.length : index;
}

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-xl place-items-center px-4">
        <div className="border border-line p-6">
          <h1 className="display text-xl">FALTA LA CONTRASEÑA DEL PANEL</h1>
          <p className="mt-3 text-sm text-muted">
            Para abrir el panel hay que crear la variable <code>ADMIN_PASSWORD</code> (mínimo 6
            caracteres) en Vercel y en el archivo <code>.env.local</code> de la PC. Está explicado
            paso a paso en PENDIENTES.md.
          </p>
        </div>
      </div>
    );
  }

  if (!(await isAdmin())) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-xl place-items-center px-4">
        <LoginForm />
      </div>
    );
  }

  const { orders, inventory, settings } = await readStore();
  const sorted = [...orders].sort((a, b) => {
    const byStatus = priority(a.status) - priority(b.status);
    if (byStatus !== 0) return byStatus;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const porValidar = orders.filter(
    (o) => o.status === "pendiente_pago" || o.status === "en_validacion",
  ).length;
  const paresEnStock = Object.values(inventory).reduce(
    (total, tallas) =>
      total + Object.values(tallas).reduce((suma: number, v) => suma + (v ?? 0), 0),
    0,
  );
  const pagados = orders.filter((o) => o.status === "pagado" || o.status === "enviado");
  const vendido = pagados.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-24 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">PANEL</p>
          <h1 className="display mt-1 text-2xl">{siteConfig.name} · TIENDA</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="ui-label min-h-11 border border-ink px-4 text-xs">
            SALIR
          </button>
        </form>
      </header>

      {isEphemeral() ? (
        <p className="mt-6 border border-ink bg-surface p-4 text-sm">
          <strong>Atención:</strong> los pedidos se están guardando en memoria temporal del
          servidor y se borran cuando Vercel reinicia. Para que queden guardados hay que crear el
          almacén de datos (Vercel Blob). Está explicado en PENDIENTES.md.
        </p>
      ) : null}

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "PEDIDOS ABIERTOS", value: String(porValidar) },
          { label: "PARES EN STOCK", value: String(paresEnStock) },
          { label: "PAGADOS", value: String(pagados.length) },
          { label: "VENDIDO", value: formatPrice(vendido) },
        ].map((item) => (
          <div key={item.label} className="border border-line p-4">
            <p className="ui-label text-[11px] text-muted">{item.label}</p>
            <p className="mt-2 text-xl tabular-nums">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="ui-label text-xs">PEDIDOS</h2>
        {sorted.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Todavía no hay pedidos.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {sorted.map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="ui-label text-xs">INVENTARIO</h2>
        <p className="mt-2 text-sm text-muted">
          Pares disponibles por talla. Déjalo vacío si todavía no quieres controlar el stock de esa
          talla: se podrá vender igual. En 0, la talla sale agotada en la web.
        </p>
        <form action={inventoryAction} className="mt-4 flex flex-col gap-6">
          {products.map((product) => (
            <InventoryGrid
              key={product.slug}
              slug={product.slug}
              colorName={product.colorName}
              sizes={product.sizes.map((size) => size.eur)}
              initial={inventory[product.slug] ?? {}}
            />
          ))}
          <button type="submit" className="btn btn-primary self-start px-8">
            GUARDAR INVENTARIO
          </button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="ui-label text-xs">AJUSTES</h2>
        <form action={settingsAction} className="mt-4 border border-line p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs text-muted">Minutos que se reserva la talla</span>
              <input
                name="windowMinutes"
                defaultValue={String(settings.windowMinutes)}
                inputMode="numeric"
                className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-sm tabular-nums outline-none focus:border-ink"
              />
            </label>
            <div className="flex flex-col justify-end gap-2 text-sm">
              <label className="flex items-center gap-3">
                <input type="checkbox" name="shalom" defaultChecked={settings.shalom} className="h-4 w-4" />
                Envíos por Shalom
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" name="indriver" defaultChecked={settings.indriver} className="h-4 w-4" />
                Envíos por InDriver
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="checkoutEnabled"
                  defaultChecked={settings.checkoutEnabled}
                  className="h-4 w-4"
                />
                Pedidos por la web activos
              </label>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted">
            Precio único: {formatPrice(settings.price)} (se cambia en el código, para que la web y
            los pedidos siempre digan lo mismo). El número al que paga el cliente no vive en la
            web: se lo pasas tú por WhatsApp, así nadie puede cambiarlo tocando la página.
          </p>
          <button type="submit" className="btn btn-primary mt-6 px-8">
            GUARDAR AJUSTES
          </button>
        </form>
      </section>
    </div>
  );
}
