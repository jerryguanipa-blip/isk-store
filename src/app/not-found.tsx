import Link from "next/link";
import type { Metadata } from "next";
import { IskMark } from "@/components/brand/IskMark";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-[1800px] flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
      <IskMark className="h-24 w-24 sm:h-32 sm:w-32" />

      <p className="display mt-10 text-[22vw] leading-none sm:text-[14vw] lg:text-[10vw]">
        404
      </p>

      <h1 className="ui-label mt-4 text-xs text-white/60">
        ESTA PÁGINA NO EXISTE
      </h1>

      <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
        El enlace que seguiste está roto o la página se movió. Pero las Air Force 1 siguen
        en su sitio.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="ui-label bg-white px-10 py-4 text-xs text-black transition-opacity hover:opacity-80"
        >
          IR A LA TIENDA
        </Link>
        <Link
          href="/"
          className="ui-label border border-white/30 px-10 py-4 text-xs transition-colors hover:border-white"
        >
          VOLVER AL INICIO
        </Link>
      </div>

      <p className="eyebrow mt-16 text-white/55">{siteConfig.tagline}</p>
    </div>
  );
}
