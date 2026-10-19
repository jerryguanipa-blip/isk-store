"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  slug: string;
  colorName: string;
  sizes: number[];
  /** Lo guardado en el panel: número de pares o null = sin control. */
  initial: Record<string, number | null>;
};

/**
 * Inventario de un color: cada talla con − y +, más atajos para llenar
 * todas de una vez. Los valores viajan en inputs ocultos, así que el
 * formulario sigue siendo el mismo del servidor.
 */
export function InventoryGrid({ slug, colorName, sizes, initial }: Props) {
  const [values, setValues] = useState<Record<number, string>>(() => {
    const start: Record<number, string> = {};
    for (const size of sizes) {
      const saved = initial[String(size)];
      start[size] = saved === null || saved === undefined ? "" : String(saved);
    }
    return start;
  });

  const setOne = (size: number, raw: string) => {
    const clean = raw.replace(/\D/g, "").slice(0, 3);
    setValues((current) => ({ ...current, [size]: clean }));
  };

  const step = (size: number, delta: number) => {
    setValues((current) => {
      const now = Number(current[size] || 0);
      const next = Math.max(0, Math.min(now + delta, 999));
      return { ...current, [size]: String(next) };
    });
  };

  const fillAll = (value: string) => {
    setValues(() => Object.fromEntries(sizes.map((size) => [size, value])));
  };

  const totalPairs = sizes.reduce((sum, size) => sum + Number(values[size] || 0), 0);
  const conControl = sizes.filter((size) => values[size] !== "").length;

  return (
    <div className="border border-line p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="ui-label text-xs">{colorName}</p>
        <p className="text-xs text-muted">
          {conControl === 0
            ? "sin control de stock"
            : `${totalPairs} par${totalPairs === 1 ? "" : "es"} en ${conControl} talla${conControl === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { label: "TODAS EN 1", value: "1" },
          { label: "TODAS EN 2", value: "2" },
          { label: "TODAS EN 0", value: "0" },
          { label: "SIN CONTROL", value: "" },
        ].map((quick) => (
          <button
            key={quick.label}
            type="button"
            onClick={() => fillAll(quick.value)}
            className="ui-label min-h-10 border border-line px-3 text-[11px] transition-colors hover:border-ink"
          >
            {quick.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sizes.map((size) => (
          <li key={size} className="flex items-center gap-2 border border-line px-3 py-2">
            <span className="ui-label w-16 text-[11px]">EUR {size}</span>

            <div className="ml-auto flex items-center border border-line">
              <button
                type="button"
                onClick={() => step(size, -1)}
                aria-label={`Un par menos en la talla ${size}`}
                className="grid h-10 w-10 place-items-center transition-colors hover:bg-ink hover:text-white"
              >
                <Minus className="h-3 w-3" aria-hidden="true" />
              </button>

              <input
                name={`stock:${slug}:${size}`}
                value={values[size] ?? ""}
                onChange={(event) => setOne(size, event.target.value)}
                inputMode="numeric"
                placeholder="—"
                aria-label={`Pares disponibles en la talla ${size}`}
                className="h-10 w-12 border-x border-line bg-paper text-center text-sm tabular-nums outline-none focus:bg-surface"
              />

              <button
                type="button"
                onClick={() => step(size, 1)}
                aria-label={`Un par más en la talla ${size}`}
                className="grid h-10 w-10 place-items-center transition-colors hover:bg-ink hover:text-white"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
