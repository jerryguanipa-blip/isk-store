"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import { buildProductMessage, whatsappUrl } from "@/lib/checkout";
import { ProductGallery } from "@/components/ProductGallery";
import { SizeGuideModal } from "@/components/SizeGuideModal";

export function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const add = useCart((s) => s.add);

  const handleAdd = () => {
    if (size === null) {
      setError(true);
      return;
    }
    setError(false);
    add(product, size);
  };

  const whatsappHref = whatsappUrl(
    buildProductMessage(product.name, product.colorName, size, product.price),
  );

  return (
    <>
      <nav aria-label="Ruta de navegación" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-[11px] text-white/55">
          <li>
            <Link href="/" className="ui-label hover:text-white">
              INICIO
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="ui-label hover:text-white">
              TIENDA
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="ui-label text-white/70">{product.color}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} theme={product.theme} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-white/55">NIKE · AIR FORCE 1 &apos;07</p>
          <h1 className="display mt-4 text-3xl sm:text-4xl lg:text-5xl">
            {product.colorName}
          </h1>
          <p className="mt-5 text-2xl tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-white/55">
            Precio en soles (PEN). IGV incluido.
          </p>

          <p className="mt-8 max-w-prose text-sm leading-relaxed text-white/60">
            {product.description}
          </p>

          {/* Tallas */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="ui-label text-[11px]">
                TALLA EUR{" "}
                <span className="text-white/55">
                  {size ? `· ${size} seleccionada` : "· elige una"}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="ui-label flex items-center gap-2 text-[10px] text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                GUÍA DE TALLAS
              </button>
            </div>

            <div
              role="radiogroup"
              aria-label="Elige tu talla europea"
              aria-required="true"
              className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-9"
            >
              {product.sizes.map((option) => {
                const selected = size === option.eur;
                return (
                  <button
                    key={option.eur}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={!option.available}
                    onClick={() => {
                      setSize(option.eur);
                      setError(false);
                    }}
                    className={`border py-3 text-sm tabular-nums transition-colors ${
                      selected
                        ? "border-white bg-white text-black"
                        : "border-white/20 text-white hover:border-white"
                    } ${!option.available ? "cursor-not-allowed opacity-25 line-through" : ""}`}
                  >
                    {option.eur}
                  </button>
                );
              })}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="ui-label mt-3 text-[11px] text-white"
              >
                ⚠ ELIGE UNA TALLA PARA CONTINUAR
              </motion.p>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleAdd}
              data-cta
              className="ui-label w-full bg-white px-6 py-4 text-xs text-black transition-opacity hover:opacity-80"
            >
              AGREGAR AL CARRITO
            </button>

            <a
              href={whatsappHref}
              data-cta
              target="_blank"
              rel="noopener noreferrer"
              className="ui-label flex w-full items-center justify-center border border-white px-6 py-4 text-xs transition-colors hover:bg-white hover:text-black"
            >
              COMPRAR VÍA WHATSAPP
            </a>
          </div>

          {/* Detalles */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <h2 className="ui-label text-[11px]">DETALLES</h2>
            <ul className="mt-4 space-y-2.5">
              {product.details.map((detail) => (
                <li key={detail} className="flex gap-3 text-sm text-white/60">
                  <span aria-hidden="true" className="text-white/55">
                    —
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/envios"
                className="ui-label text-[10px] text-white/50 underline-offset-4 hover:text-white hover:underline"
              >
                VER POLÍTICA DE ENVÍOS
              </Link>
              <Link
                href="/cambios"
                className="ui-label text-[10px] text-white/50 underline-offset-4 hover:text-white hover:underline"
              >
                VER CAMBIOS Y DEVOLUCIONES
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
