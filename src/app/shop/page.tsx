import type { Metadata } from "next";
import { products } from "@/data/products";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Tienda",
  description: `Nike Air Force 1 '07 clásicas en Perú: Triple White y Triple Black, tallas EUR 36 al 44, ${formatPrice(siteConfig.price)}.`,
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1800px] px-4 pt-10 pb-20 sm:px-6 lg:px-10 lg:pt-14">
      <header className="pb-8">
        <p className="eyebrow text-muted">TIENDA</p>
        <h1 className="display mt-3 text-3xl sm:text-4xl">AIR FORCE 1</h1>
        <p className="mt-3 max-w-md text-muted">
          Dos colores, nueve tallas, un solo precio. Todas las tallas disponibles hoy.
        </p>
      </header>

      <ShopGrid products={products} />
    </div>
  );
}
