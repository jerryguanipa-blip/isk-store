import Link from "next/link";
import type { Metadata } from "next";
import { IskMark } from "@/components/brand/IskMark";
import { siteConfig } from "@/config/site";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-[1800px] flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
      <IskMark tone="dark" className="h-20 w-20 sm:h-24 sm:w-24" />

      <p className="display mt-8 text-6xl leading-none sm:text-7xl">
        404
      </p>

      <h1 className="ui-label mt-4 text-xs text-muted">
        ESTA PÁGINA NO EXISTE
      </h1>

      <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
        El enlace que seguiste está roto o la página se movió. Pero las Air Force 1 siguen
        en su sitio.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <WhatsAppButton tone="dark" />
        <Link
          href="/"
          className="btn btn-secondary"
        >
          VOLVER AL INICIO
        </Link>
      </div>

      <p className="eyebrow mt-16 text-muted">{siteConfig.tagline}</p>
    </div>
  );
}
