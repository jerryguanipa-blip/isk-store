/**
 * Geometría del logo ISK, vectorizada a mano a partir del logo original
 * (public/brand/isk-logo.jpg): letras I, S, K en bold con una órbita
 * elíptica que las atraviesa en diagonal.
 *
 * Se guarda aparte para que el logo estático y la intro animada dibujen
 * exactamente la misma forma.
 */

export const VIEWBOX = "0 0 1000 1000";

export const ORBIT = {
  rotation: -20,
  outer: { cx: 500, cy: 500, rx: 392, ry: 250, strokeWidth: 26 },
  inner: { cx: 500, cy: 500, rx: 366, ry: 226, strokeWidth: 9 },
} as const;

/** Letra I — slab: barra superior, asta y barra inferior. */
export const LETTER_I = {
  bars: [
    { x: 224, y: 384, width: 100, height: 50 },
    { x: 224, y: 574, width: 100, height: 50 },
  ],
  stem: { x: 245, y: 384, width: 58, height: 240 },
} as const;

/** Letra S — trazo grueso, se dibuja con stroke. */
export const LETTER_S = {
  d: "M 486 449 C 486 412 382 412 382 472 C 382 512 486 496 486 536 C 486 596 382 596 382 559",
  strokeWidth: 56,
} as const;

/** Letra K — asta vertical + dos brazos diagonales. */
export const LETTER_K = {
  stem: { x: 544, y: 384, width: 58, height: 240 },
  arms: ["M 602 504 L 776 384", "M 602 504 L 776 624"],
  strokeWidth: 58,
} as const;
