/**
 * Configuración central de la tienda ISK.
 * Cambiar algo aquí lo cambia en TODA la web.
 */

const rawWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "51XXXXXXXXX";

export const siteConfig = {
  // --- Marca ---
  name: "ISK",
  fullName: "ISK — Imagina, Sueña, Krea",
  tagline: "IMAGINA · SUEÑA · KREA",

  // --- Dominio ---
  domain: "iskoficial.com",
  url: "https://iskoficial.com",

  // --- SEO ---
  title: "ISK | Air Force 1 Clásicas en Perú",
  description:
    "Air Force 1 '07 blancas y negras en Perú. Tallas EUR 36 al 44, S/ 209.90. Pide por WhatsApp.",
  keywords: [
    "Air Force 1 Perú",
    "Nike Air Force 1 clásicas",
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
    instagram: "https://www.instagram.com/iskoficial_?stkn=bzQzN3JsdTlrN3lu",
    tiktok: "https://www.tiktok.com/@iskofficiality?_r=1&_t=ZS-99msCYvBZZA",
  },


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
