"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProductImage, ProductTheme } from "@/data/products";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
  theme: ProductTheme;
};

export function ProductGallery({ images, productName, theme }: ProductGalleryProps) {
  const frame = theme === "light" ? "bg-white" : "isk-spot";
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement | null>(null);

  const current = images[active] ?? images[0];

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/* Imagen principal */}
      <div
        ref={frameRef}
        className={`relative aspect-square w-full flex-1 overflow-hidden ${frame}`}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => {
          setZoomed(false);
          setOrigin("50% 50%");
        }}
        onMouseMove={handleMove}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          style={{ transformOrigin: origin }}
          className={`isk-product object-contain transition-transform duration-500 ${
            zoomed ? "scale-[1.9]" : "scale-100"
          }`}
        />
        <span className="ui-label pointer-events-none absolute right-4 bottom-4 hidden bg-black/80 px-3 py-1.5 text-[10px] text-white lg:block">
          PASA EL MOUSE PARA AMPLIAR
        </span>
      </div>

      {/* Miniaturas */}
      <div
        className="-m-1 flex gap-2 overflow-x-auto p-1 sm:gap-3"
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
            className={`relative aspect-square w-16 shrink-0 overflow-hidden ${frame} transition-opacity sm:w-20 lg:w-24 ${
              index === active
                ? "opacity-100 ring-2 ring-white/80 ring-offset-2 ring-offset-black"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            <Image
              src={image.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="96px"
              className="isk-product object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
