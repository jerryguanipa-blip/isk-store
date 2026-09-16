"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/format";
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
      <nav aria-label="Ruta de navegación" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <li>
            <Link href="/" className="ui-label hover:text-ink">
              INICIO
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="ui-label hover:text-ink">
              TIENDA
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="ui-label text-ink">{product.color}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-muted">NIKE · AIR FORCE 1 &apos;07</p>
          <h1 className="display mt-2 text-2xl sm:text-3xl">{product.colorName}</h1>
          <p className="mt-3 text-lg tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-muted">Precio en soles (PEN). IGV incluido.</p>

          <p className="mt-6 max-w-prose text-muted">{product.description}</p>

          {/* Tallas */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="ui-label text-xs">
                TALLA EUR{" "}
                <span className="text-muted">
                  {size ? `· ${size} seleccionada` : "· elige una"}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="ui-label flex min-h-11 items-center gap-2 text-xs underline underline-offset-4 hover:no-underline"
              >
                <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                GUÍA DE TALLAS
              </button>
            </div>

            <div
              role="radiogroup"
              aria-label="Elige tu talla europea"
              aria-required="true"
              className="mt-3 flex flex-wrap gap-2"
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
                    className={cn(
                      "grid h-12 w-12 place-items-center border text-sm tabular-nums transition-colors",
                      selected
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-paper text-ink hover:border-ink",
                      !option.available && "cursor-not-allowed opacity-30 line-through",
                    )}
                  >
                    {option.eur}
                  </button>
                );
              })}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                role="alert"
                className="ui-label mt-3 text-xs text-ink"
              >
                ⚠ ELIGE UNA TALLA PARA CONTINUAR
              </motion.p>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAdd}
              data-cta
              className="btn btn-primary w-full"
            >
              AGREGAR AL CARRITO
            </button>

            <a
              href={whatsappHref}
              data-cta
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary w-full"
            >
              COMPRAR VÍA WHATSAPP
            </a>
          </div>

          {/* Acordeones */}
          <div className="mt-8 border-b border-line">
            <details className="isk-accordion border-t border-line" open>
              <summary className="ui-label flex min-h-12 items-center justify-between text-xs">
                DETALLES
              </summary>
              <ul className="space-y-2 pb-5">
                {product.details.map((detail) => (
                  <li key={detail} className="flex gap-3 text-sm text-muted">
                    <span aria-hidden="true">—</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </details>

            <details className="isk-accordion border-t border-line">
              <summary className="ui-label flex min-h-12 items-center justify-between text-xs">
                ENVÍOS
              </summary>
              <div className="flex flex-col gap-3 pb-5">
                <Link
                  href="/envios"
                  className="ui-label text-xs text-ink underline underline-offset-4 hover:no-underline"
                >
                  VER POLÍTICA DE ENVÍOS
                </Link>
                <Link
                  href="/cambios"
                  className="ui-label text-xs text-ink underline underline-offset-4 hover:no-underline"
                >
                  VER CAMBIOS Y DEVOLUCIONES
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
