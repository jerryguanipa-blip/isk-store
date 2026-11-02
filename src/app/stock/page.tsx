import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { readStore } from "@/lib/store/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stock en vivo — tallas disponibles",
  description:
    "Mira qué tallas de Air Force 1 blancas y negras quedan hoy en ISK. Se actualiza solo con cada pedido.",
  alternates: { canonical: "/stock" },
};

/** Lo que ve el cliente en cada casilla. */
function Celda({ pares }: { pares: number | null }) {
  if (pares === null) {
    return <span className="text-sm">Disponible</span>;
  }
  if (pares <= 0) {
    return <span className="text-sm text-muted line-through">Agotada</span>;
  }
  if (pares === 1) {
    return <span className="text-sm">Último par</span>;
  }
  return (
    <span className="text-sm tabular-nums">
      {pares} <span className="text-muted">pares</span>
    </span>
  );
}

export default async function StockPage() {
  const { inventory } = await readStore();
  const [white, black] = products;

  const hora = new Date().toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Lima",
  });

  const quedan = (slug: string, eur: number) => inventory[slug]?.[String(eur)] ?? null;
  const hayAlgo = (slug: string) =>
    Object.values(inventory[slug] ?? {}).some((v) => v === null || (v ?? 0) > 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-10 pb-20 sm:px-6 lg:pt-16">
      <p className="eyebrow text-muted">ACTUALIZADO AL {hora}</p>
      <h1 className="display mt-2 text-3xl sm:text-4xl">TALLAS DISPONIBLES HOY</h1>
      <p className="mt-3 max-w-prose text-sm text-muted">
        Esto es lo que queda en tienda ahora mismo. Se descuenta solo con cada pedido, así que lo
        que ves acá es real. Precio único: {formatPrice(siteConfig.price)} el par.
      </p>

      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="ui-label px-4 py-4 text-[11px] font-normal text-muted">TALLA EUR</th>
              <th className="ui-label px-4 py-4 text-[11px] font-normal text-muted">
                {white?.colorName.toUpperCase()}
              </th>
              <th className="ui-label px-4 py-4 text-[11px] font-normal text-muted">
                {black?.colorName.toUpperCase()}
              </th>
            </tr>
          </thead>
          <tbody>
            {siteConfig.sizes.map((eur, i) => (
              <tr
                key={eur}
                className={`border-b border-line last:border-0 ${i % 2 === 1 ? "bg-surface" : ""}`}
              >
                <td className="px-4 py-4 text-sm tabular-nums font-medium">{eur}</td>
                <td className="px-4 py-4">
                  <Celda pares={quedan(white!.slug, eur)} />
                </td>
                <td className="px-4 py-4">
                  <Celda pares={quedan(black!.slug, eur)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hayAlgo(white!.slug) || !hayAlgo(black!.slug) ? (
        <p className="mt-4 text-sm text-muted">
          ¿No está tu talla? Escríbenos igual: traemos mercadería seguido y te avisamos apenas
          llegue.
        </p>
      ) : null}

      <div className="mt-10 border border-line p-6">
        <p className="display text-xl">¿YA VISTE LA TUYA?</p>
        <p className="mt-2 text-sm text-muted">
          Tócala en la tienda y te abrimos WhatsApp con el pedido escrito. Envíos por Shalom a todo
          el Perú o InDriver en Lima.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/#pedido" data-cta className="btn btn-primary sm:px-10">
            ELEGIR TALLA Y PEDIR
          </Link>
          <Link href="/shop" className="btn btn-secondary sm:px-10">
            VER LA TIENDA
          </Link>
        </div>
      </div>
    </div>
  );
}
