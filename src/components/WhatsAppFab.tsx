"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/checkout";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const MESSAGE = `¡Hola ${siteConfig.name}! 👋 Quiero consultar por las Air Force 1 '07 (White / Black). ¿Qué tallas tienen disponibles?`;

export function WhatsAppFab() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const fabRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const INTERACTIVE = 'a, button, input, select, textarea, label, [role="radio"], [data-cta]';

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const pastHero = pathname !== "/" || window.scrollY > vh * 0.6;
      const fab = fabRef.current;
      let covering = false;
      if (fab) {
        // Se mira qué hay DEBAJO del botón: grilla de 4×4 puntos con 8px de margen.
        const r = fab.getBoundingClientRect();
        const pad = 8;
        const points: Array<[number, number]> = [];
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            points.push([
              r.left - pad + ((r.width + pad * 2 - 1) * i) / 3,
              r.top - pad + ((r.height + pad * 2 - 1) * j) / 3,
            ]);
          }
        }
        covering = points.some(([x, y]) =>
          document
            .elementsFromPoint(Math.max(0, x), Math.min(vh - 1, y))
            .some((el) => el !== fab && !fab.contains(el) && !!el.closest(INTERACTIVE) && !el.closest("header")),
        );
      }
      setVisible(pastHero && !covering);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const initial = window.setTimeout(update, 900);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.clearTimeout(initial);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return (
    <a
      ref={fabRef}
      href={whatsappUrl(MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[85] flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black text-white shadow-[0_10px_30px_rgb(0_0_0/0.45)] transition-[opacity,transform] duration-300 sm:right-6 sm:bottom-6 ${
        visible ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
