"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/data/products";
import { cn } from "@/lib/format";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

/** Foto con zoom al pasar el mouse, sobre superficie #F5F5F3. */
function ZoomTile({
  image,
  priority,
  sizes,
}: {
  image: ProductImage;
  priority?: boolean;
  sizes: string;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  return (
    <div
      className="relative aspect-square w-full overflow-hidden bg-surface"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => {
        setZoomed(false);
        setOrigin("50% 50%");
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x}% ${y}%`);
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ transformOrigin: origin }}
        className={cn(
          "isk-product object-contain",
          image.src.endsWith(".jpg") && "isk-blend",
          zoomed ? "scale-[1.8]" : "scale-100",
        )}
      />
    </div>
  );
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="min-w-0">
      {/* Móvil y tablet: foto principal + miniaturas */}
      <div className="flex flex-col gap-2 lg:hidden">
        <ZoomTile key={current.src} image={current} priority sizes="100vw" />
        <div
          className="-m-1 flex gap-2 overflow-x-auto p-1"
          role="group"
          aria-label={`Fotos de ${productName}`}
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1} de ${images.length}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden border bg-surface transition-colors sm:w-20",
                index === active ? "border-ink" : "border-transparent hover:border-line",
              )}
            >
              <Image
                src={image.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="80px"
                className={cn("object-contain", image.src.endsWith(".jpg") && "isk-blend")}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Escritorio: grilla de 2 columnas */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-2" role="group" aria-label={`Fotos de ${productName}`}>
          {images.map((image, index) => (
            <ZoomTile key={image.src} image={image} priority={index < 2} sizes="30vw" />
          ))}
        </div>
        <p className="ui-label mt-3 text-xs text-muted">PASA EL MOUSE PARA AMPLIAR</p>
      </div>
    </div>
  );
}
