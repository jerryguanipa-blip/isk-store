import { siteConfig } from "@/config/site";

export type ColorKey = "WHITE" | "BLACK";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductSize = {
  /** Talla europea */
  eur: number;
  /** Equivalencia aproximada US (hombre) */
  us: string;
  /** Largo del pie en centímetros */
  cm: string;
  /** Poner en false para marcar la talla como agotada */
  available: boolean;
};

export type Product = {
  slug: string;
  name: string;
  /** Nombre corto para el carrito y WhatsApp */
  shortName: string;
  color: ColorKey;
  colorName: string;
  price: number;
  images: ProductImage[];
  intro: string;
  description: string;
  details: string[];
  sizes: ProductSize[];
};

/** Tabla de tallas compartida (EUR / US / CM). Todas disponibles. */
const SIZE_TABLE: ProductSize[] = [
  { eur: 36, us: "4",    cm: "22.5", available: true },
  { eur: 37, us: "4.5",  cm: "23.5", available: true },
  { eur: 38, us: "5.5",  cm: "24.0", available: true },
  { eur: 39, us: "6.5",  cm: "24.5", available: true },
  { eur: 40, us: "7",    cm: "25.5", available: true },
  { eur: 41, us: "8",    cm: "26.0", available: true },
  { eur: 42, us: "8.5",  cm: "26.5", available: true },
  { eur: 43, us: "9.5",  cm: "27.5", available: true },
  { eur: 44, us: "10",   cm: "28.0", available: true },
];

const SHARED_DETAILS = [
  "Nike Air Force 1 '07 — modelo original.",
  "Corte bajo en cuero con perforaciones en la puntera.",
  "Unidad Nike Air encapsulada en el talón.",
  "Suela de goma con pivote circular para mejor agarre.",
  "Incluye caja original y par de pasadores de repuesto.",
];

export const products: Product[] = [
  {
    slug: "air-force-1-triple-white",
    name: "Nike Air Force 1 '07 — Triple White",
    shortName: "Air Force 1 '07 Triple White",
    color: "WHITE",
    colorName: "Triple White",
    price: siteConfig.price,
    images: [
      { src: "/images/af1-white-1.jpg", alt: "Nike Air Force 1 '07 Triple White vista lateral" },
      { src: "/images/af1-white-2.jpg", alt: "Nike Air Force 1 '07 Triple White sobre fondo negro" },
      { src: "/images/af1-white-3.jpg", alt: "Par de Nike Air Force 1 '07 Triple White" },
      { src: "/images/af1-white-4.jpg", alt: "Nike Air Force 1 '07 Triple White puestas" },
    ],
    intro: "El blanco que nunca se pasa de moda.",
    description:
      "La silueta más reconocible del mundo, en su versión más limpia. Cuero blanco de pared a pared, suela blanca y swoosh al tono: combina con absolutamente todo y se ve nueva cada vez que la limpias. La Air Force 1 '07 Triple White es el par que no te vas a sacar.",
    details: SHARED_DETAILS,
    sizes: SIZE_TABLE,
  },
  {
    slug: "air-force-1-triple-black",
    name: "Nike Air Force 1 '07 — Triple Black",
    shortName: "Air Force 1 '07 Triple Black",
    color: "BLACK",
    colorName: "Triple Black",
    price: siteConfig.price,
    images: [
      { src: "/images/af1-black-1.jpg", alt: "Nike Air Force 1 '07 Triple Black vista lateral" },
      { src: "/images/af1-black-2.jpg", alt: "Nike Air Force 1 '07 Triple Black sobre fondo blanco" },
      { src: "/images/af1-black-3.jpg", alt: "Nike Air Force 1 '07 Triple Black editorial" },
      { src: "/images/af1-black-4.jpg", alt: "Detalle del cuero de la Air Force 1 '07 Triple Black" },
    ],
    intro: "Negro total. Cero mantenimiento.",
    description:
      "Misma silueta, actitud opuesta. Negro de punta a punta —cuero, suela, pasadores y swoosh— para un par que aguanta la ciudad, la lluvia y el uso diario sin delatar nada. La Air Force 1 '07 Triple Black es la opción práctica que además se ve cara.",
    details: SHARED_DETAILS,
    sizes: SIZE_TABLE,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductByColor(color: ColorKey): Product {
  const found = products.find((p) => p.color === color);
  if (!found) throw new Error(`No hay producto para el color ${color}`);
  return found;
}

export const sizeGuide = SIZE_TABLE;
