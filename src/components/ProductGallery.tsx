"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProductImage } from "@/data/products";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
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
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-6">
      {/* Imagen principal */}
      <div
        ref={frameRef}
        className="relative aspect-[4/5] w-full flex-1 overflow-hidden bg-neutral-950"
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
          className={`isk-photo object-cover transition-transform duration-500 ${
            zoomed ? "scale-[1.9]" : "scale-100"
          }`}
        />
        <span className="ui-label pointer-events-none absolute right-4 bottom-4 hidden border border-white/25 bg-black/50 px-3 py-1.5 text-[10px] text-white/70 backdrop-blur-sm lg:block">
          PASA EL MOUSE PARA AMPLIAR
        </span>
      </div>

      {/* Miniaturas */}
      <div
        className="flex gap-3 overflow-x-auto lg:w-24 lg:flex-col lg:overflow-visible"
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
            className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden border bg-neutral-950 transition-colors lg:w-full ${
              index === active ? "border-white" : "border-transparent hover:border-white/40"
            }`}
          >
            <Image
              src={image.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="96px"
              className="isk-photo object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
