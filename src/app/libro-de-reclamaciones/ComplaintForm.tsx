"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/checkout";

type ClaimType = "RECLAMO" | "QUEJA";
type GoodType = "PRODUCTO" | "SERVICIO";

type FormState = {
  nombre: string;
  documento: string;
  numeroDocumento: string;
  domicilio: string;
  distrito: string;
  telefono: string;
  email: string;
  esMenor: boolean;
  apoderado: string;
  tipoBien: GoodType;
  descripcionBien: string;
  monto: string;
  tipoReclamo: ClaimType;
  detalle: string;
  pedido: string;
  aceptaPolitica: boolean;
};

const EMPTY: FormState = {
  nombre: "",
  documento: "DNI",
  numeroDocumento: "",
  domicilio: "",
  distrito: "",
  telefono: "",
  email: "",
  esMenor: false,
  apoderado: "",
  tipoBien: "PRODUCTO",
  descripcionBien: "",
  monto: "",
  tipoReclamo: "RECLAMO",
  detalle: "",
  pedido: "",
  aceptaPolitica: false,
};

const inputClass =
  "w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white";
const labelClass = "ui-label block text-[10px] text-white/60";

function generarCodigo() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `ISK-${stamp}-${random}`;
}

export function ComplaintForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [codigo, setCodigo] = useState<string | null>(null);
  const [enlace, setEnlace] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validar = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (form.nombre.trim().length < 3) next.nombre = "Escribe tu nombre completo.";
    if (form.numeroDocumento.trim().length < 6)
      next.numeroDocumento = "Escribe el número de tu documento.";
    if (form.domicilio.trim().length < 5) next.domicilio = "Escribe tu dirección.";
    if (form.distrito.trim().length < 3) next.distrito = "Escribe tu distrito.";
    if (!/^[0-9+\s-]{6,15}$/.test(form.telefono.trim()))
      next.telefono = "Escribe un teléfono válido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Escribe un correo válido.";
    if (form.esMenor && form.apoderado.trim().length < 3)
      next.apoderado = "Indica el nombre del padre, madre o apoderado.";
    if (form.descripcionBien.trim().length < 5)
      next.descripcionBien = "Describe el producto o servicio.";
    if (form.detalle.trim().length < 20)
      next.detalle = "Cuéntanos qué pasó con al menos 20 caracteres.";
    if (form.pedido.trim().length < 10)
      next.pedido = "Indica qué esperas que hagamos (mínimo 10 caracteres).";
    if (!form.aceptaPolitica)
      next.aceptaPolitica = "Debes aceptar la política de privacidad.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validar()) {
      const first = document.querySelector<HTMLElement>("[data-error='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.focus?.();
      return;
    }

    const nuevoCodigo = generarCodigo();
    const fecha = new Date().toLocaleString("es-PE", {
      dateStyle: "long",
      timeStyle: "short",
    });

    const mensaje = [
      "📗 LIBRO DE RECLAMACIONES — " + siteConfig.name,
      `Código de reclamo: ${nuevoCodigo}`,
      `Fecha: ${fecha}`,
      "",
      "1) IDENTIFICACIÓN DEL CONSUMIDOR",
      `Nombre: ${form.nombre}`,
      `${form.documento}: ${form.numeroDocumento}`,
      `Domicilio: ${form.domicilio}, ${form.distrito}`,
      `Teléfono: ${form.telefono}`,
      `Correo: ${form.email}`,
      form.esMenor ? `Menor de edad. Apoderado: ${form.apoderado}` : "Mayor de edad: sí",
      "",
      "2) IDENTIFICACIÓN DEL BIEN CONTRATADO",
      `Tipo: ${form.tipoBien}`,
      `Descripción: ${form.descripcionBien}`,
      `Monto reclamado: ${form.monto ? `S/ ${form.monto}` : "No indica"}`,
      "",
      `3) DETALLE DE LA ${form.tipoReclamo}`,
      form.tipoReclamo === "RECLAMO"
        ? "(Reclamo: disconformidad con el producto o servicio)"
        : "(Queja: malestar con la atención recibida)",
      form.detalle,
      "",
      "4) PEDIDO DEL CONSUMIDOR",
      form.pedido,
      "",
      `Enviado desde ${siteConfig.domain}`,
    ].join("\n");

    const url = whatsappUrl(mensaje);
    setCodigo(nuevoCodigo);
    setEnlace(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (codigo && enlace) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-white/20 p-8 sm:p-10"
      >
        <p className="ui-label text-xs">RECLAMO REGISTRADO</p>
        <p className="display mt-5 text-3xl sm:text-4xl">{codigo}</p>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/60">
          Guarda este código. Se abrió WhatsApp con tu reclamo completo: solo tienes que
          enviarlo para que quede registrado. Tenemos un plazo máximo de 15 días hábiles
          para responderte.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="ui-label bg-white px-8 py-4 text-xs text-black transition-opacity hover:opacity-80"
          >
            ABRIR WHATSAPP DE NUEVO
          </a>
          <button
            type="button"
            onClick={() => {
              setForm(EMPTY);
              setCodigo(null);
              setEnlace(null);
            }}
            className="ui-label border border-white/30 px-8 py-4 text-xs transition-colors hover:border-white"
          >
            REGISTRAR OTRO
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-12">
      {/* 1. Consumidor */}
      <fieldset className="space-y-5">
        <legend className="ui-label pb-4 text-xs text-white">
          1. IDENTIFICACIÓN DEL CONSUMIDOR
        </legend>

        <Field
          id="nombre"
          label="NOMBRE COMPLETO *"
          value={form.nombre}
          error={errors.nombre}
          onChange={(v) => update("nombre", v)}
          autoComplete="name"
        />

        <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
          <div>
            <label className={labelClass} htmlFor="documento">
              DOCUMENTO *
            </label>
            <select
              id="documento"
              value={form.documento}
              onChange={(event) => update("documento", event.target.value)}
              className={`${inputClass} mt-2`}
            >
              <option value="DNI">DNI</option>
              <option value="CE">Carné de extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="RUC">RUC</option>
            </select>
          </div>
          <Field
            id="numeroDocumento"
            label="NÚMERO *"
            value={form.numeroDocumento}
            error={errors.numeroDocumento}
            onChange={(v) => update("numeroDocumento", v)}
            inputMode="numeric"
          />
        </div>

        <Field
          id="domicilio"
          label="DIRECCIÓN *"
          value={form.domicilio}
          error={errors.domicilio}
          onChange={(v) => update("domicilio", v)}
          autoComplete="street-address"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="distrito"
            label="DISTRITO *"
            value={form.distrito}
            error={errors.distrito}
            onChange={(v) => update("distrito", v)}
          />
          <Field
            id="telefono"
            label="TELÉFONO *"
            value={form.telefono}
            error={errors.telefono}
            onChange={(v) => update("telefono", v)}
            type="tel"
            autoComplete="tel"
          />
        </div>

        <Field
          id="email"
          label="CORREO ELECTRÓNICO *"
          value={form.email}
          error={errors.email}
          onChange={(v) => update("email", v)}
          type="email"
          autoComplete="email"
        />

        <label className="flex items-start gap-3 pt-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={form.esMenor}
            onChange={(event) => update("esMenor", event.target.checked)}
            className="mt-1 h-4 w-4 accent-white"
          />
          Soy menor de edad
        </label>

        {form.esMenor && (
          <Field
            id="apoderado"
            label="NOMBRE DEL PADRE, MADRE O APODERADO *"
            value={form.apoderado}
            error={errors.apoderado}
            onChange={(v) => update("apoderado", v)}
          />
        )}
      </fieldset>

      {/* 2. Bien contratado */}
      <fieldset className="space-y-5">
        <legend className="ui-label pb-4 text-xs text-white">
          2. IDENTIFICACIÓN DEL BIEN CONTRATADO
        </legend>

        <RadioRow
          name="tipoBien"
          legend="TIPO *"
          options={[
            { value: "PRODUCTO", label: "PRODUCTO" },
            { value: "SERVICIO", label: "SERVICIO" },
          ]}
          value={form.tipoBien}
          onChange={(v) => update("tipoBien", v as GoodType)}
        />

        <Field
          id="descripcionBien"
          label="DESCRIPCIÓN (producto, color y talla) *"
          value={form.descripcionBien}
          error={errors.descripcionBien}
          onChange={(v) => update("descripcionBien", v)}
        />

        <Field
          id="monto"
          label="MONTO RECLAMADO EN SOLES (opcional)"
          value={form.monto}
          onChange={(v) => update("monto", v)}
          inputMode="decimal"
          placeholder="209.90"
        />
      </fieldset>

      {/* 3. Detalle */}
      <fieldset className="space-y-5">
        <legend className="ui-label pb-4 text-xs text-white">
          3. DETALLE DE LA RECLAMACIÓN
        </legend>

        <RadioRow
          name="tipoReclamo"
          legend="TIPO *"
          options={[
            { value: "RECLAMO", label: "RECLAMO" },
            { value: "QUEJA", label: "QUEJA" },
          ]}
          value={form.tipoReclamo}
          onChange={(v) => update("tipoReclamo", v as ClaimType)}
        />
        <p className="text-xs leading-relaxed text-white/40">
          <strong className="text-white/70">Reclamo:</strong> no estás conforme con el
          producto o servicio.{" "}
          <strong className="text-white/70">Queja:</strong> tu malestar es por la atención
          recibida.
        </p>

        <TextArea
          id="detalle"
          label="CUÉNTANOS QUÉ PASÓ *"
          value={form.detalle}
          error={errors.detalle}
          onChange={(v) => update("detalle", v)}
        />

        <TextArea
          id="pedido"
          label="QUÉ ESPERAS QUE HAGAMOS *"
          value={form.pedido}
          error={errors.pedido}
          onChange={(v) => update("pedido", v)}
          rows={3}
        />
      </fieldset>

      <div>
        <label
          className="flex items-start gap-3 text-sm text-white/60"
          data-error={errors.aceptaPolitica ? "true" : undefined}
        >
          <input
            type="checkbox"
            checked={form.aceptaPolitica}
            onChange={(event) => update("aceptaPolitica", event.target.checked)}
            className="mt-1 h-4 w-4 accent-white"
            aria-invalid={Boolean(errors.aceptaPolitica)}
          />
          Acepto que mis datos se usen para atender este reclamo, según la política de
          privacidad. *
        </label>
        {errors.aceptaPolitica && (
          <p role="alert" className="ui-label mt-2 text-[10px] text-white">
            ⚠ {errors.aceptaPolitica}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="ui-label w-full bg-white px-8 py-5 text-xs text-black transition-opacity hover:opacity-80 sm:w-auto sm:px-16"
      >
        ENVIAR RECLAMO
      </button>

      <p className="text-xs leading-relaxed text-white/35">
        Conforme al Código de Protección y Defensa del Consumidor (Ley N.º 29571), el
        proveedor debe dar respuesta al reclamo en un plazo no mayor a 15 días hábiles.
        Formular un reclamo no impide acudir a otras vías de solución de controversias ni
        es requisito previo para denunciar ante Indecopi.
      </p>
    </form>
  );
}

/* ----------------------------- Campos reutilizables ----------------------------- */

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email";
  autoComplete?: string;
  placeholder?: string;
};

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        data-error={error ? "true" : undefined}
        className={`${inputClass} mt-2 ${error ? "border-white" : ""}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="ui-label mt-2 text-[10px] text-white">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  error,
  rows = 5,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        data-error={error ? "true" : undefined}
        className={`${inputClass} mt-2 resize-y ${error ? "border-white" : ""}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="ui-label mt-2 text-[10px] text-white">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function RadioRow({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={legend}>
      <p className={labelClass}>{legend}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={`ui-label border px-6 py-3 text-[11px] transition-colors ${
              value === option.value
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/70 hover:border-white hover:text-white"
            }`}
            name={name}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
