import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import { siteConfig } from "@/config/site";
import { priceAmount } from "@/lib/format";
import { ProductDetail } from "@/components/ProductDetail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Un año de validez para la oferta, calculado cuando se construye el sitio. */
const PRICE_VALID_UNTIL = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: `${product.name} — S/ ${priceAmount(product.price)}`,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      url: `${siteConfig.url}/product/${product.slug}`,
      images: [{ url: product.ogImage, width: 2000, height: 2000, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.ogImage],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    brand: { "@type": "Brand", name: "Nike" },
    color: product.colorName,
    category: "Zapatillas",
    image: [product.ogImage, ...product.images.map((image) => image.src)].map(
      (src) => `${siteConfig.url}${src}`,
    ),
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: siteConfig.currency,
      price: priceAmount(product.price),
      priceValidUntil: PRICE_VALID_UNTIL,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: siteConfig.name },
      areaServed: "PE",
    },
    additionalProperty: product.sizes.map((size) => ({
      "@type": "PropertyValue",
      name: "Talla EUR",
      value: String(size.eur),
    })),
  };

  return (
    <div className="mx-auto max-w-[1800px] px-4 pt-6 pb-20 sm:px-6 lg:px-10 lg:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </div>
  );
}
