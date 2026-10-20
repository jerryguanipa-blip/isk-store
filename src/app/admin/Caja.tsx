import { anularVentaAction, registrarVentaAction } from "@/app/admin/actions";
import { products } from "@/data/products";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import type { Sale, SizeStock } from "@/lib/store/types";

function cuando(iso: string): string {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Lima",
  });
}

const ORIGEN: Record<Sale["source"], string> = {
  web: "Pedido web",
  manual: "Cargada a mano",
  historico: "Cierre anterior",
};

type Props = {
  sales: Sale[];
  compraInicial: Record<string, Record<string, number>>;
  inventory: Record<string, SizeStock>;
};

const campo =
  "mt-1 min-h-12 w-full border border-line bg-paper px-3 text-sm outline-none focus:border-ink";

/**
 * Control de caja. Las vendidas por color se calculan contra el inventario
 * real (compradas − las que quedan), así que el cuadre no depende de cómo se
 * anotó cada venta y nunca cuenta un par dos veces.
 */
export function Caja({ sales, compraInicial, inventory }: Props) {
  const suma = (o: Record<string, number | null> | undefined) =>
    Object.values(o ?? {}).reduce((total: number, v) => total + (v ?? 0), 0);

  const porColor = products.map((product) => {
    const compradas = suma(compraInicial[product.slug]);
    const disponibles = suma(inventory[product.slug]);
    const vendidas = compradas - disponibles;
    return {
      slug: product.slug,
      nombre: product.colorName,
      compradas,
      vendidas,
      disponibles,
      dinero: vendidas * siteConfig.price,
    };
  });

  const totalCompradas = porColor.reduce((t, c) => t + c.compradas, 0);
  const totalVendidas = porColor.reduce((t, c) => t + c.vendidas, 0);
  const totalDisponibles = porColor.reduce((t, c) => t + c.disponibles, 0);
  const esperado = totalVendidas * siteConfig.price;

  const caja = sales.reduce((t, v) => t + v.total, 0);
  const paresAnotados = sales.reduce((t, v) => t + v.qty, 0);
  const descuadre = paresAnotados - totalVendidas;

  const recientes = [...sales].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 40);

  return (
    <section className="mt-12">
      <h2 className="ui-label text-xs">CAJA</h2>
      <p className="mt-2 text-sm text-muted">
        Cada venta confirmada descuenta el stock y suma a caja. Si te equivocas, la anulas y los
        pares vuelven solos.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "COMPRA INICIAL", value: `${totalCompradas} pares` },
          { label: "VENDIDOS", value: `${totalVendidas} pares` },
          { label: "DISPONIBLES", value: `${totalDisponibles} pares` },
          { label: "DINERO EN CAJA", value: formatPrice(caja) },
        ].map((item) => (
          <div key={item.label} className="border border-line p-4">
            <p className="ui-label text-[11px] text-muted">{item.label}</p>
            <p className="mt-2 text-xl tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>

      {descuadre !== 0 ? (
        <p className="mt-4 border border-ink bg-surface p-4 text-sm">
          <strong>Ojo:</strong>{" "}
          {descuadre > 0
            ? `hay ${descuadre} par${descuadre > 1 ? "es" : ""} anotado${descuadre > 1 ? "s" : ""} en caja de más frente al inventario. Revisa si alguna venta quedó anotada dos veces.`
            : `faltan ${-descuadre} par${-descuadre > 1 ? "es" : ""} por anotar en caja: el inventario bajó más de lo que dicen las ventas. Deberían ser ${formatPrice(esperado)}.`}
        </p>
      ) : (
        <p className="mt-4 text-xs text-muted">
          Cuadrado: {totalVendidas} pares vendidos según el inventario y {paresAnotados} anotados en
          caja, {formatPrice(caja)}.
        </p>
      )}

      <div className="mt-4 overflow-x-auto border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {["COLOR", "COMPRADAS", "VENDIDAS", "QUEDAN", "DINERO"].map((titulo) => (
                <th key={titulo} className="ui-label px-3 py-3 text-[11px] font-normal text-muted">
                  {titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {porColor.map((color) => (
              <tr key={color.slug} className="border-b border-line last:border-0">
                <td className="px-3 py-3">{color.nombre}</td>
                <td className="px-3 py-3 tabular-nums">{color.compradas}</td>
                <td className="px-3 py-3 tabular-nums">{color.vendidas}</td>
                <td className="px-3 py-3 tabular-nums">{color.disponibles}</td>
                <td className="px-3 py-3 tabular-nums">{formatPrice(color.dinero)}</td>
              </tr>
            ))}
            <tr className="bg-surface">
              <td className="ui-label px-3 py-3 text-xs">TOTAL</td>
              <td className="px-3 py-3 tabular-nums">{totalCompradas}</td>
              <td className="px-3 py-3 tabular-nums">{totalVendidas}</td>
              <td className="px-3 py-3 tabular-nums">{totalDisponibles}</td>
              <td className="px-3 py-3 tabular-nums">{formatPrice(esperado)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <form action={registrarVentaAction} className="mt-6 border border-line p-4">
        <p className="ui-label text-xs">ANOTAR UNA VENTA</p>
        <p className="mt-2 text-xs text-muted">
          Para las que no pasaron por la web: en persona, por WhatsApp directo, etc.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <label className="block">
            <span className="text-xs text-muted">Modelo</span>
            <select name="slug" className={campo}>
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>
                  {product.colorName}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-muted">Talla</span>
            <select name="size" defaultValue="41" className={`${campo} tabular-nums`}>
              {(products[0]?.sizes ?? []).map((size) => (
                <option key={size.eur} value={size.eur}>
                  {size.eur}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-muted">Pares</span>
            <input name="qty" defaultValue="1" inputMode="numeric" className={`${campo} tabular-nums`} />
          </label>
          <label className="block">
            <span className="text-xs text-muted">Cliente</span>
            <input name="note" placeholder="Ej. Alex – Trujillo" className={campo} />
          </label>
        </div>
        <button type="submit" className="btn btn-primary mt-4 px-8">
          ANOTAR VENTA
        </button>
      </form>

      <div className="mt-6">
        <p className="ui-label text-xs">VENTAS REGISTRADAS</p>
        {recientes.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Todavía no hay ventas anotadas.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {recientes.map((venta) => (
              <li key={venta.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <span className="text-xs text-muted">{cuando(venta.at)}</span>
                <span className="text-sm">
                  {venta.client ?? venta.note ?? "Sin identificar"}
                  {venta.colorName ? ` · ${venta.colorName}` : ""}
                  {venta.size ? ` · EUR ${venta.size}` : ""}
                  {" · "}
                  {venta.qty} par{venta.qty > 1 ? "es" : ""}
                </span>
                <span className="text-xs text-muted">
                  {ORIGEN[venta.source]}
                  {venta.orderRef ? ` · ${venta.orderRef}` : ""}
                </span>
                <span className="ml-auto text-sm tabular-nums">{formatPrice(venta.total)}</span>
                <form action={anularVentaAction}>
                  <input type="hidden" name="id" value={venta.id} />
                  <button
                    type="submit"
                    className="ui-label min-h-10 border border-line px-3 text-[11px] text-muted hover:border-ink hover:text-ink"
                  >
                    ANULAR
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
