"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { sizeGuide } from "@/data/products";

type SizeGuideModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[130] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <button
            type="button"
            aria-label="Cerrar la guía de tallas"
            onClick={onClose}
            className="absolute inset-0"
            tabIndex={-1}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guia-tallas-titulo"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg border border-white/15 bg-black"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 id="guia-tallas-titulo" className="ui-label text-xs">
                GUÍA DE TALLAS
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Cerrar la guía de tallas"
              >
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </header>

            <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Equivalencias de tallas europeas, estadounidenses y largo del pie en
                  centímetros
                </caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className="ui-label py-3 text-left text-[10px]">
                      EUR
                    </th>
                    <th scope="col" className="ui-label py-3 text-left text-[10px]">
                      US
                    </th>
                    <th scope="col" className="ui-label py-3 text-left text-[10px]">
                      CM
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.map((size) => (
                    <tr key={size.eur} className="border-b border-white/10">
                      <td className="py-3 tabular-nums">{size.eur}</td>
                      <td className="py-3 tabular-nums text-white/70">{size.us}</td>
                      <td className="py-3 tabular-nums text-white/70">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 space-y-3 text-xs leading-relaxed text-white/55">
                <p className="ui-label text-[10px] text-white">CÓMO MEDIR TU PIE</p>
                <p>
                  1. Pon una hoja en el suelo pegada a la pared y párate encima con el
                  talón tocando la pared.
                </p>
                <p>2. Marca con un lápiz dónde termina tu dedo más largo.</p>
                <p>3. Mide con una regla desde el borde de la hoja hasta la marca.</p>
                <p>
                  4. Busca esa medida en la columna CM. Si estás entre dos tallas, elige
                  la mayor.
                </p>
                <p className="pt-2 text-white/55">
                  La Air Force 1 calza fiel a la talla. Si dudas, escríbenos por WhatsApp
                  antes de comprar.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
