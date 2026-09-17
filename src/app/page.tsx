import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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
          <h1 className="isk-script-title isk-write whitespace-nowrap">AIR FORCE 1</h1>

          <p className="isk-hero-price isk-rise mt-2 tabular-nums">
            {formatPrice(siteConfig.price)}
          </p>

          <div className="isk-rise isk-rise-late mt-6 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <WhatsAppButton
              tone="light"
              className="w-full max-w-xs border-white bg-transparent text-white hover:bg-white hover:text-ink sm:w-auto"
            />
            <a
              href="#modelos"
              data-cta
              className="ui-label inline-flex min-h-12 items-center px-2 text-xs text-white underline underline-offset-4 hover:no-underline"
            >
              VER WHITE / BLACK
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------- WHITE / BLACK ---------------------------------- */}
      <section
        id="modelos"
        aria-labelledby="modelos-titulo"
        className="mx-auto max-w-[1800px] scroll-mt-20 px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <h2 id="modelos-titulo" className="sr-only">
          Air Force 1 White y Black
        </h2>

        <div className="grid gap-x-4 gap-y-12 md:grid-cols-2">
          {[white, black].map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.05}>
              <ProductCard product={product} priority={index === 0} headingLevel="h3" />
              <p className="mt-1 text-sm text-muted">{product.intro}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <WhatsAppButton colorName={product.colorName} tone="light" />
                <Link
                  href={`/product/${product.slug}`}
                  data-cta
                  className="ui-label text-xs underline underline-offset-4 hover:no-underline"
                >
                  VER TALLAS Y FOTOS
                </Link>
              </div>
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
            <WhatsAppButton tone="dark" className="w-full max-w-xs sm:w-auto" />
            <Link
              href="/shop"
              data-cta
              className="ui-label text-xs underline underline-offset-4 hover:no-underline"
            >
              ELEGIR MI TALLA EN LA WEB
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
