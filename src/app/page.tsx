import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { products, type Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
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
        siteConfig.social.facebook,
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
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black">
        <div className="isk-hero-media absolute inset-0 lg:left-auto lg:w-[64%]">
          <Image
            src="/images/portada-hd.jpg"
            alt="Pared de zapatillas Air Force 1 en blanco y negro"
            fill
            priority
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="isk-hero-image object-cover object-[46%_28%] lg:object-[50%_35%]"
          />
        </div>
        <div aria-hidden="true" className="isk-hero-shade absolute inset-0" />

        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-10 lg:pb-20">
          <Reveal y={20}>
            <h1 className="display isk-hero-title whitespace-nowrap">AIR FORCE 1</h1>
          </Reveal>

          <Reveal delay={0.15} y={16}>
            <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="font-display text-3xl font-medium tabular-nums sm:text-4xl">
                {formatPrice(siteConfig.price)}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton tone="light" />
                <a
                  href="#modelos"
                  data-cta
                  className="ui-label inline-flex min-h-13 items-center justify-center border border-white/40 px-8 text-xs transition-colors hover:border-white"
                >
                  VER WHITE / BLACK
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------- WHITE / BLACK ---------------------------------- */}
      <section id="modelos" aria-labelledby="modelos-titulo" className="scroll-mt-14">
        <h2 id="modelos-titulo" className="sr-only">
          Air Force 1 White y Black
        </h2>
        <div className="grid lg:grid-cols-2">
          <ColorPanel product={white} />
          <ColorPanel product={black} />
        </div>
      </section>

      {/* ---------------------------------- MARQUEE ---------------------------------- */}
      <Marquee text={siteConfig.tagline} />

      {/* ---------------------------------- DOS COLORES / PRECIO ---------------------------------- */}
      <section
        aria-labelledby="precio-titulo"
        className="mx-auto max-w-[1800px] px-4 py-24 text-center sm:px-6 lg:px-10 lg:py-36"
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

        <Reveal delay={0.08}>
          <ul
            aria-label="Tallas disponibles (EUR)"
            className="mx-auto mt-12 flex max-w-[30rem] flex-wrap justify-center gap-2"
          >
            {siteConfig.sizes.map((size) => (
              <li
                key={size}
                className="grid h-11 w-11 place-items-center border border-white/20 text-sm tabular-nums text-white/80"
              >
                {size}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="display isk-price mt-14 tabular-nums">{formatPrice(siteConfig.price)}</p>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Sin catálogos infinitos. Solo el par que todos quieren.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-5">
            <WhatsAppButton tone="light" className="w-full max-w-xs sm:w-auto" />
            <Link
              href="/shop"
              data-cta
              className="ui-label text-[11px] text-white/70 underline-offset-8 transition-colors hover:text-white hover:underline"
            >
              ELEGIR MI TALLA EN LA WEB
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/** Bloque WHITE (fondo blanco) o BLACK (fondo negro con foco de luz). */
function ColorPanel({ product }: { product: Product }) {
  const light = product.theme === "light";
  const cover = product.images[0];

  return (
    <article
      className={cn(
        "relative flex min-h-[640px] flex-col overflow-hidden px-5 pt-14 pb-12 sm:px-10 lg:min-h-[92vh] lg:pt-16",
        light ? "bg-white text-black" : "isk-spot text-white",
      )}
    >
      <div className="relative z-10 flex items-baseline justify-between gap-4">
        <h3 className="display isk-color-title">{product.color}</h3>
        <p className="font-display text-lg font-medium tabular-nums sm:text-xl">
          {formatPrice(product.price)}
        </p>
      </div>
      <p className={cn("relative z-10 mt-3 text-sm", light ? "text-black/60" : "text-white/65")}>
        {product.intro}
      </p>

      <Link
        href={`/product/${product.slug}`}
        aria-label={`Ver fotos y tallas de ${product.name}`}
        className={cn(
          "group relative z-0 my-6 block min-h-[240px] flex-1",
          light
            ? "focus-visible:outline-black"
            : "focus-visible:outline-white",
        )}
      >
        {/* Las fotos de catálogo traen ~40% de margen: se amplían sin recortar la zapatilla */}
        <div className="absolute inset-0 scale-[1.12] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-2 group-hover:scale-[1.17] sm:scale-[1.4] sm:group-hover:scale-[1.46] lg:scale-[1.3] lg:group-hover:scale-[1.36]">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain"
          />
        </div>
      </Link>

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <WhatsAppButton colorName={product.colorName} tone={light ? "dark" : "light"} />
        <Link
          href={`/product/${product.slug}`}
          data-cta
          className={cn(
            "ui-label self-start text-[11px] underline-offset-8 transition-colors hover:underline sm:self-auto",
            light ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white",
          )}
        >
          VER TALLAS Y FOTOS
        </Link>
      </div>
    </article>
  );
}
