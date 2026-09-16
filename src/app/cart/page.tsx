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
    <div className="mx-auto max-w-[1800px] px-4 pt-10 pb-20 sm:px-6 lg:px-10 lg:pt-14">
      <header className="pb-8">
        <p className="eyebrow text-muted">CARRITO</p>
        <h1 className="display mt-3 text-3xl sm:text-4xl">TU PEDIDO</h1>
      </header>

      <CartView />
    </div>
  );
}
