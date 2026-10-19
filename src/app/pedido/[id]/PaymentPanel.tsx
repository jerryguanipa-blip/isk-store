"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatPrice } from "@/lib/format";

type Props = {
  orderId: string;
  expiresAt: string;
  yape: string;
  plin: string;
  holder: string;
  shalom: boolean;
  indriver: boolean;
  total: number;
};

function twoDigits(value: number) {
  return value < 10 ? `0${value}` : String(value);
}

/** Contador de la ventana de pago. */
function Countdown({ expiresAt, onExpire }: { expiresAt: string; onExpire: () => void }) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(expiresAt).getTime() - Date.now()));
  const expired = useRef(false);

  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      setLeft(ms);
      if (ms === 0 && !expired.current) {
        expired.current = true;
        onExpire();
      }
    };
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(left / 60000);
  const seconds = Math.floor((left % 60000) / 1000);
  const urgent = left < 3 * 60000;

  return (
    <div
      className={`flex items-baseline gap-3 border px-4 py-3 ${urgent ? "border-ink bg-ink text-white" : "border-line bg-surface"}`}
      role="timer"
      aria-live="off"
    >
      <span className="ui-label text-xs">TIEMPO PARA PAGAR</span>
      <span className="ml-auto text-2xl tabular-nums">
        {twoDigits(minutes)}:{twoDigits(seconds)}
      </span>
    </div>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 border border-line bg-paper px-4 py-3">
      <div className="min-w-0">
        <p className="ui-label text-[11px] text-muted">{label}</p>
        <p className="truncate text-lg tabular-nums">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value).then(
            () => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            },
            () => undefined,
          );
        }}
        className="ui-label inline-flex min-h-10 shrink-0 items-center gap-2 border border-ink px-3 text-[11px]"
        aria-label={`Copiar ${label}`}
      >
        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {copied ? "COPIADO" : "COPIAR"}
      </button>
    </div>
  );
}

const inputClass =
  "min-h-12 w-full border border-line bg-paper px-3 text-sm outline-none focus:border-ink";

export function PaymentPanel({ orderId, expiresAt, yape, plin, holder, shalom, indriver, total }: Props) {
  const [expired, setExpired] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [method, setMethod] = useState<"yape" | "plin">(!yape && plin ? "plin" : "yape");
  const [shippingMethod, setShippingMethod] = useState<"shalom" | "indriver">(shalom ? "shalom" : "indriver");

  const handleExpire = useCallback(() => setExpired(true), []);

  const numbers = [
    yape ? { key: "yape" as const, label: "YAPE", value: yape } : null,
    plin ? { key: "plin" as const, label: "PLIN", value: plin } : null,
  ].filter(Boolean) as Array<{ key: "yape" | "plin"; label: string; value: string }>;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch(`/api/pedidos/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: String(form.get("name") ?? ""),
            phone: String(form.get("phone") ?? ""),
            dni: String(form.get("dni") ?? ""),
          },
          shipping: {
            method: shippingMethod,
            city: String(form.get("city") ?? ""),
            address: String(form.get("address") ?? ""),
            notes: String(form.get("notes") ?? ""),
          },
          method,
          code: String(form.get("code") ?? ""),
        }),
      });
      const data = (await res.json()) as { error?: string; whatsapp?: string };
      if (!res.ok || !data.whatsapp) {
        setError(data.error ?? "No pudimos registrar tu pago.");
        setSending(false);
        return;
      }
      setDone(data.whatsapp);
      window.open(data.whatsapp, "_blank", "noopener,noreferrer");
    } catch {
      setError("No pudimos conectar. Revisa tu internet e inténtalo de nuevo.");
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="mt-8 border border-ink bg-surface p-6">
        <p className="display text-xl">¡LISTO! YA REGISTRAMOS TU CÓDIGO</p>
        <p className="mt-3 text-sm text-muted">
          Te abrimos WhatsApp con el detalle de tu pedido. Mándanos también la captura del pago y te
          confirmamos en minutos.
        </p>
        <a href={done} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
          ABRIR WHATSAPP
        </a>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="mt-8 border border-line bg-surface p-6">
        <p className="display text-xl">SE ACABÓ EL TIEMPO</p>
        <p className="mt-3 text-sm text-muted">
          Liberamos tu talla para otros clientes. Puedes volver a la tienda y pedirla de nuevo.
        </p>
        <a href="/shop" className="btn btn-primary mt-6">
          VOLVER A LA TIENDA
        </a>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Countdown expiresAt={expiresAt} onExpire={handleExpire} />

      <div className="mt-6 border border-line p-5">
        <p className="ui-label text-xs">1 · PAGA {formatPrice(total)}</p>
        {numbers.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3">
            {numbers.map((item) => (
              <CopyField key={item.key} label={item.label} value={item.value} />
            ))}
            {holder ? <p className="text-xs text-muted">Titular: {holder}</p> : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Todavía no publicamos el número de Yape/Plin. Escríbenos por WhatsApp y te lo pasamos al
            instante para completar este pedido.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 border border-line p-5">
        <p className="ui-label text-xs">2 · CONFIRMA TU PAGO</p>

        <fieldset className="mt-4">
          <legend className="text-xs text-muted">¿Con qué pagaste?</legend>
          <div className="mt-2 flex gap-2">
            {(["yape", "plin"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMethod(option)}
                aria-pressed={method === option}
                className={`ui-label min-h-12 flex-1 border px-3 text-xs ${
                  method === option ? "border-ink bg-ink text-white" : "border-line"
                }`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block">
          <span className="text-xs text-muted">Código de operación de {method === "yape" ? "Yape" : "Plin"}</span>
          <input
            name="code"
            required
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej. 12345678"
            className={`${inputClass} mt-1`}
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-muted">Nombre completo</span>
            <input name="name" required autoComplete="name" className={`${inputClass} mt-1`} />
          </label>
          <label className="block">
            <span className="text-xs text-muted">Celular (WhatsApp)</span>
            <input
              name="phone"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="9XXXXXXXX"
              className={`${inputClass} mt-1`}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs text-muted">DNI (opcional, para la agencia)</span>
            <input name="dni" inputMode="numeric" className={`${inputClass} mt-1`} />
          </label>
        </div>

        <fieldset className="mt-6">
          <legend className="ui-label text-xs">3 · ENVÍO</legend>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            {shalom ? (
              <button
                type="button"
                onClick={() => setShippingMethod("shalom")}
                aria-pressed={shippingMethod === "shalom"}
                className={`ui-label min-h-12 flex-1 border px-3 text-xs ${
                  shippingMethod === "shalom" ? "border-ink bg-ink text-white" : "border-line"
                }`}
              >
                SHALOM (AGENCIA)
              </button>
            ) : null}
            {indriver ? (
              <button
                type="button"
                onClick={() => setShippingMethod("indriver")}
                aria-pressed={shippingMethod === "indriver"}
                className={`ui-label min-h-12 flex-1 border px-3 text-xs ${
                  shippingMethod === "indriver" ? "border-ink bg-ink text-white" : "border-line"
                }`}
              >
                INDRIVER (AL TOQUE)
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs text-muted">
                {shippingMethod === "shalom" ? "Ciudad de destino" : "Distrito"}
              </span>
              <input name="city" required className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-muted">
                {shippingMethod === "shalom" ? "Agencia Shalom" : "Dirección exacta"}
              </span>
              <input name="address" required className={`${inputClass} mt-1`} />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs text-muted">Referencia (opcional)</span>
              <input name="notes" className={`${inputClass} mt-1`} />
            </label>
          </div>
          <p className="mt-3 text-xs text-muted">
            {shippingMethod === "shalom"
              ? "Enviamos a cualquier agencia Shalom del Perú. El flete se paga al recoger."
              : "InDriver solo dentro de Lima: coordinamos el motorizado en el momento por WhatsApp."}
          </p>
        </fieldset>

        {error ? (
          <p role="alert" className="mt-5 border border-ink bg-surface px-3 py-2 text-sm">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={sending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
          {sending ? "ENVIANDO…" : "YA PAGUÉ, ENVIAR CÓDIGO"}
        </button>
        <p className="mt-3 text-xs text-muted">
          Al enviar, tu pedido queda reservado y se abre WhatsApp con el detalle para confirmarlo.
        </p>
      </form>
    </div>
  );
}
