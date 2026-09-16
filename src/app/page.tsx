import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { formatPrice, priceAmount } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";

export const metadata: Metadata = {
  title: siteConfig.title,
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
      image: `${siteConfig.url}/images/af1-white-2.jpg`,
      url: siteConfig.url,
      priceRange: formatPrice(siteConfig.price),
      currenciesAccepted: "PEN",
      paymentAccepted: "Efectivo, Yape, Plin, Transferencia, Contra entrega",
      address: {
        "@type": "PostalAddress",
        addressCountry: "PE",
        addressLocality: "Lima",
      },
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
      <section className="relative flex h-dvh min-h-[560px] items-end overflow-hidden">
        <Image
          src="/images/hero-af1.jpg"
          alt="Nike Air Force 1 '07 Triple White clásica sobre fondo negro"
          fill
          priority
          sizes="100vw"
          className="isk-photo isk-photo-hero object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"
        />

        <div className="relative mx-auto w-full max-w-[1800px] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-28">
          <Reveal>
            <p className="eyebrow text-white/60">NIKE · ORIGINALES · PERÚ</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="display mt-6 text-[17vw] leading-[0.82] sm:text-[13vw] lg:text-[11vw]">
              AIR FORCE 1
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-sm leading-relaxed text-white/60">
                Triple White y Triple Black. Tallas EUR 36 al 44. Un solo precio:{" "}
                {formatPrice(siteConfig.price)}.
              </p>

              <Link
                href="/shop"
                className="ui-label group inline-flex items-center gap-4 self-start border border-white px-10 py-4 text-xs transition-colors hover:bg-white hover:text-black sm:self-auto"
              >
                COMPRAR AHORA
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------- SPLIT WHITE / BLACK ---------------------------------- */}
      <section aria-labelledby="colores-titulo" className="border-t border-white/10">
        <h2 id="colores-titulo" className="sr-only">
          Elige tu color
        </h2>

        <div className="grid gap-px bg-black md:grid-cols-2">
          {[white, black].map((product) => (
            <Link
              key={product.slug}
              href={`/product/${product.slug}`}
              className="group relative flex min-h-[560px] flex-col overflow-hidden bg-white text-black focus-visible:outline-black focus-visible:-outline-offset-8 md:h-[85vh]"
            >
              <p className="display relative z-10 p-6 text-6xl sm:p-10 sm:text-7xl lg:text-8xl">
                {product.color}
              </p>

              <div className="relative flex-1">
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="isk-product object-contain transition-transform duration-[1200ms] group-hover:scale-105 group-hover:-rotate-2"
                />
              </div>

              <div className="relative w-full p-6 sm:p-10">
                <p className="max-w-xs text-sm text-black/60">{product.intro}</p>
                <span className="ui-label mt-6 inline-flex items-center gap-3 border-b border-black/40 pb-1 text-[11px] transition-colors group-hover:border-black">
                  VER PRODUCTO
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------- MARQUEE ---------------------------------- */}
      <Marquee text={`${siteConfig.name} · ${siteConfig.tagline} ·`} />

      {/* ---------------------------------- BENEFICIOS ---------------------------------- */}
      <section
        aria-labelledby="beneficios-titulo"
        className="mx-auto max-w-[1800px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32"
      >
        <Reveal>
          <h2 id="beneficios-titulo" className="display text-4xl sm:text-5xl lg:text-6xl">
            POR QUÉ COMPRAR
            <br />
            EN {siteConfig.name}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 0.08}>
              <div className="h-full bg-black p-8 lg:p-10">
                <p className="ui-label text-[10px] text-white/55 tabular-nums">
                  0{index + 1}
                </p>
                <h3 className="ui-label mt-6 text-xs leading-relaxed">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {benefit.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------- EDITORIAL ---------------------------------- */}
      <section className="relative">
        <div className="grid items-stretch lg:grid-cols-2">
          <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[80vh]">
            <Image
              src="/images/editorial-wall.jpg"
              alt="Pared de zapatillas fotografiada en blanco y negro"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="isk-photo object-cover"
            />
          </div>

          <div className="flex items-center border-t border-white/10 bg-black px-4 py-16 sm:px-6 lg:border-t-0 lg:border-l lg:px-16 lg:py-0">
            <Reveal>
              <p className="eyebrow text-white/55">{siteConfig.tagline}</p>
              <h2 className="display mt-8 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
                DOS COLORES.
                <br />
                NUEVE TALLAS.
                <br />
                UN SOLO PRECIO.
              </h2>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-white/55">
                No vendemos catálogos infinitos. Vendemos el par que todo el mundo quiere:
                original, al precio justo, con envío a todo el Perú y pago contra entrega
                en Lima.
              </p>
              <p className="mt-10 text-3xl tabular-nums">
                {formatPrice(siteConfig.price)}
                <span className="ml-3 align-middle text-xs text-white/55">
                  PEN · {priceAmount(siteConfig.price)}
                </span>
              </p>
              <Link
                href="/shop"
                className="ui-label group mt-10 inline-flex items-center gap-4 bg-white px-10 py-4 text-xs text-black transition-opacity hover:opacity-80"
              >
                IR A LA TIENDA
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
