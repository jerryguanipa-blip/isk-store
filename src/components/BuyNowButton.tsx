"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/format";

export type BuyNowItem = { slug: string; size: number; qty: number };

type Props = {
  /** Qué se va a comprar. Si devuelve null, se muestra el aviso (ej. falta talla). */
  getItems: () => BuyNowItem[] | null;
  label?: string;
  className?: string;
  onMissing?: () => void;
};

/**
 * Crea el pedido en el servidor (abre la ventana de 15 minutos) y lleva al
 * cliente a la página de pago con Yape/Plim.
 */
export function BuyNowButton({ getItems, label = "PAGAR AHORA · YAPE O PLIM", className, onMissing }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (loading) return;
    const items = getItems();
    if (!items || items.length === 0) {
      onMissing?.();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setError(data.error ?? "No pudimos crear tu pedido.");
        setLoading(false);
        return;
      }
      router.push(`/pedido/${data.id}`);
    } catch {
      setError("No pudimos conectar. Revisa tu internet e inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        data-cta
        className={cn("btn btn-primary w-full disabled:opacity-60", className)}
      >
        {loading ? "ABRIENDO PAGO…" : label}
      </button>
      {error ? (
        <p role="alert" className="text-xs text-ink">
          {error}
        </p>
      ) : null}
    </>
  );
}
