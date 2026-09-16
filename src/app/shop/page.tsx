import type { Metadata } from "next";
import { products } from "@/data/products";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Tienda",
  description: `Nike Air Force 1 '07 originales en Perú: Triple White y Triple Black, tallas EUR 36 al 44, ${formatPrice(siteConfig.price)}.`,
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1800px] px-4 pt-28 pb-24 sm:px-6 lg:px-10 lg:pt-36">
      <header className="pb-10">
        <p className="eyebrow text-white/55">TIENDA</p>
        <h1 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">AIR FORCE 1</h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55">
          Dos colores, nueve tallas, un solo precio. Todas las tallas disponibles hoy.
        </p>
      </header>

      <ShopGrid products={products} />
    </div>
  );
}
