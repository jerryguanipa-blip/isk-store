import { siteConfig } from "@/config/site";

/**
 * Formatea un precio como "S/ 209.90".
 * Se hace a mano (y no con Intl) para que el servidor y el navegador
 * produzcan exactamente el mismo texto y no haya errores de hidratación.
 */
export function formatPrice(value: number): string {
  return `${siteConfig.currencySymbol} ${value.toFixed(2)}`;
}

/** "209.90" — sin símbolo, para JSON-LD y metadatos. */
export function priceAmount(value: number): string {
  return value.toFixed(2);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
