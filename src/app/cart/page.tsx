import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa tu pedido y finalízalo por WhatsApp.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1800px] px-4 pt-28 pb-24 sm:px-6 lg:px-10 lg:pt-36">
      <header className="pb-10">
        <p className="eyebrow text-white/55">CARRITO</p>
        <h1 className="display mt-5 text-5xl sm:text-6xl">TU PEDIDO</h1>
      </header>

      <CartView />
    </div>
  );
}
