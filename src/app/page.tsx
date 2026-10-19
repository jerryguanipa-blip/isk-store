import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import { QuickOrder } from "@/components/QuickOrder";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const [white, black] = products;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: siteConfig.fullName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/isk-logo-on-black.svg`,
      slogan: siteConfig.tagline,
      areaServed: "PE",
      sameAs: [
        siteConfig.social.instagram,
        siteConfig.social.tiktok,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      inLanguage: "es-PE",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "Store",
      name: siteConfig.name,
      image: `${siteConfig.url}${white.ogImage}`,
      url: siteConfig.url,
      priceRange: formatPrice(siteConfig.price),
      currenciesAccepted: "PEN",
      address: { "@type": "PostalAddress", addressCountry: "PE", addressLocality: "Lima" },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ---------------------------------- HERO ---------------------------------- */}
      <section className="relative isolate flex h-[calc(100svh-5.5rem)] min-h-[520px] max-h-[920px] items-end overflow-hidden bg-surface">
        {/* Portada HD (4320×5400). Móvil: encuadre 1.3× anclado abajo para que las
            zapatillas queden enteras sobre el texto; escritorio: cover a ancho completo. */}
        <Image
          src="/images/portada-hd-af1.jpg"
          alt="Zapatillas Nike Air Force 1 blancas clásicas"
          fill
          priority
          quality={90}
          sizes="(min-width: 1024px) 100vw, 130vw"
          className="isk-hero-image origin-[35%_100%] scale-[1.3] object-cover object-[35%_100%] lg:origin-center lg:scale-100 lg:object-[50%_88%]"
        />
        <div aria-hidden="true" className="isk-hero-shade absolute inset-0" />

        <div className="isk-hero-text relative z-10 mx-auto flex w-full max-w-[1800px] flex-col items-center px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-center text-white sm:px-6 sm:pb-16 lg:px-10">
          <h1 className="isk-script-title isk-write whitespace-nowrap">Air Force 1</h1>

          <p className="isk-hero-price isk-rise mt-2 tabular-nums">
            {formatPrice(siteConfig.price)}
          </p>

          <div className="isk-rise isk-rise-late mt-6 flex w-full flex-col items-center gap-3 sm:w-auto">
            <a
              href="#pedido"
              data-cta
              className="btn btn-primary w-full max-w-xs border-white bg-white text-ink hover:bg-transparent hover:text-white sm:w-auto sm:px-12"
            >
              ELEGIR TALLA
            </a>
            <p className="text-xs text-white/80">
              Eliges tu talla y nos mandas el pedido por WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------- ELIGE Y PIDE ---------------------------------- */}
      <section
        id="pedido"
        aria-labelledby="pedido-titulo"
        className="mx-auto max-w-[1800px] scroll-mt-20 px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div className="text-center">
          <p className="eyebrow text-muted">PÍDELAS EN 30 SEGUNDOS</p>
          <h2 id="pedido-titulo" className="display mt-2 text-3xl sm:text-4xl">
            ELIGE TU PAR Y TU TALLA
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Toca tu talla y mándanos el pedido por WhatsApp. Ahí te pasamos los datos para pagar y
            coordinamos el envío: Shalom a todo el Perú o InDriver en Lima.
          </p>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {[white, black].map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.05}>
              <QuickOrder product={product} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------- DOS COLORES / PRECIO ---------------------------------- */}
      <section
        aria-labelledby="precio-titulo"
        className="border-t border-line px-4 py-16 text-center sm:px-6 lg:px-10 lg:py-24"
      >
        <Reveal>
          <h2 id="precio-titulo" className="display isk-statement">
            DOS COLORES.
            <br />
            NUEVE TALLAS.
            <br />
            UN SOLO PRECIO.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <ul
            aria-label="Tallas disponibles (EUR)"
            className="mx-auto mt-10 flex max-w-[34rem] flex-wrap justify-center gap-2"
          >
            {siteConfig.sizes.map((size) => (
              <li
                key={size}
                className="grid h-12 w-12 place-items-center border border-line text-sm tabular-nums"
              >
                {size}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 text-3xl font-medium tabular-nums sm:text-4xl">
            {formatPrice(siteConfig.price)}
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
            Sin catálogos infinitos. Solo el par que todos quieren.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center gap-5">
            <a href="#pedido" data-cta className="btn btn-primary w-full max-w-xs sm:w-auto sm:px-12">
              ELEGIR TALLA
            </a>
            <Link
              href="/shop"
              data-cta
              className="ui-label text-xs underline underline-offset-4 hover:no-underline"
            >
              VER LA TIENDA COMPLETA
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
