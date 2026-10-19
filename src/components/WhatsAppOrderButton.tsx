"use client";

import { useState } from "react";

import { cn } from "@/lib/format";

export type OrderItem = { slug: string; size: number; qty: number };

type Props = {
  /** Qué se va a pedir. Si devuelve null, se avisa que falta elegir talla. */
  getItems: () => OrderItem[] | null;
  label?: string;
  className?: string;
  onMissing?: () => void;
};

/**
 * Apunta el pedido en el panel (y reserva las tallas) y abre WhatsApp con
 * el detalle ya escrito. El pago se coordina en el chat.
 */
export function WhatsAppOrderButton({
  getItems,
  label = "ENVIAR PEDIDO POR WHATSAPP",
  className,
  onMissing,
}: Props) {
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
      const data = (await res.json()) as { whatsapp?: string; error?: string };
      if (!res.ok || !data.whatsapp) {
        setError(data.error ?? "No pudimos abrir WhatsApp. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }
      window.location.href = data.whatsapp;
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
        {loading ? "ABRIENDO WHATSAPP…" : label}
      </button>
      {error ? (
        <p role="alert" className="text-xs text-ink">
          {error}
        </p>
      ) : null}
    </>
  );
}
