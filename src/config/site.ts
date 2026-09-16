/**
 * Configuración central de la tienda ISK.
 * Cambiar algo aquí lo cambia en TODA la web.
 */

const rawWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "51XXXXXXXXX";

export const siteConfig = {
  // --- Marca ---
  name: "ISK",
  fullName: "ISK — Imagina, Sueña & Krea",
  tagline: "IMAGINA · SUEÑA & KREA",
  shortTagline: "IMAGINA · SUEÑA & KREA",

  // --- Dominio ---
  domain: "iskoficial.com",
  url: "https://iskoficial.com",

  // --- SEO ---
  title: "ISK | Air Force 1 Originales en Perú",
  description:
    "Nike Air Force 1 '07 originales en Perú. Triple White y Triple Black, tallas EUR 36 al 44, S/ 209.90. Envío a todo el Perú y pago contra entrega en Lima.",
  keywords: [
    "Air Force 1 Perú",
    "Nike Air Force 1 originales",
    "zapatillas Nike Perú",
    "AF1 Triple White",
    "AF1 Triple Black",
    "ISK",
  ],

  // --- Contacto / venta ---
  /** Solo dígitos, con código de país. Ej: 51987654321 */
  whatsapp: rawWhatsapp,
  /** true cuando el número ya es real (no el placeholder con X) */
  whatsappConfigured: /^\d{9,15}$/.test(rawWhatsapp),
  email: "hola@iskoficial.com",

  // --- Producto ---
  price: 209.9,
  currency: "PEN",
  currencySymbol: "S/",
  locale: "es-PE",
  country: "PE",
  sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44] as const,

  // --- Redes ---
  social: {
    instagram: "https://www.instagram.com/iskoficial",
    tiktok: "https://www.tiktok.com/@iskoficial",
    facebook: "https://www.facebook.com/iskoficial",
  },

  // --- Promesas de la tienda ---
  benefits: [
    { title: "ENVÍO A TODO EL PERÚ", detail: "Olva y Shalom. 24 a 72 horas." },
    { title: "100% ORIGINALES", detail: "Si no es original, te devolvemos tu dinero." },
    { title: "CAMBIO DE TALLA", detail: "Tienes 7 días para cambiar la talla." },
    { title: "PAGO CONTRA ENTREGA", detail: "Disponible en Lima Metropolitana." },
  ],

  legalLinks: [
    { href: "/envios", label: "ENVÍOS" },
    { href: "/cambios", label: "CAMBIOS Y DEVOLUCIONES" },
    { href: "/terminos", label: "TÉRMINOS Y CONDICIONES" },
    { href: "/privacidad", label: "PRIVACIDAD" },
    { href: "/libro-de-reclamaciones", label: "LIBRO DE RECLAMACIONES" },
  ],

  navLinks: [
    { href: "/shop", label: "TIENDA" },
    { href: "/product/air-force-1-triple-white", label: "WHITE" },
    { href: "/product/air-force-1-triple-black", label: "BLACK" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
