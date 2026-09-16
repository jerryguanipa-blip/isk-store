# IMÁGENES — origen

## Fotos de producto (las que eligió el dueño)

Entregadas por el dueño el 16/09/2026 desde `C:\Users\jerry\Desktop\AIR FORCE 1`.
Son fotos de catálogo de la **Nike Air Force 1 '07 clásica**, fondo blanco, 2000×2000.
Se convirtieron a JPG (calidad 90) con nombres claros; Next.js las sirve en AVIF/WebP.

| Archivo | Original | Vista |
|---|---|---|
| `af1-white-1.jpg` | `1B.webp` | Lateral (foto principal) |
| `af1-white-2.jpg` | `4B.webp` | Par en 3/4 (aparece al pasar el mouse en /shop) |
| `af1-white-3.jpg` | `2B.webp` | Lateral interna |
| `af1-white-4.jpg` | `5B.webp` | Desde arriba |
| `af1-white-5.jpg` | `6B.webp` | Trasera |
| `af1-white-6.jpg` | `3B.webp` | Suela |
| `af1-black-1.jpg` | `1BLACK.webp` | Lateral (foto principal) |
| `af1-black-2.jpg` | `4BLACK.webp` | Par en 3/4 (aparece al pasar el mouse en /shop) |
| `af1-black-3.jpg` | `3BLACK.webp` | Lateral interna |
| `af1-black-4.jpg` | `5BLACK.webp` | Desde arriba |
| `af1-black-5.jpg` | `6BLACK.webp` | Trasera |
| `af1-black-6.jpg` | `2BLACK.webp` | Suela |

> ⚠ **Sobre la licencia:** por el estilo parecen fotos oficiales de catálogo de Nike. Es muy
> común que los revendedores las usen, pero no tienen una licencia libre como Unsplash.
> Si algún día Nike o una plataforma lo pide, habría que reemplazarlas por fotos propias.

## Portada (entregada por el dueño)

| Archivo | Original | Uso |
|---|---|---|
| `portada-hd.jpg` | `PORTADA HD.jpg` (Escritorio) | Hero de la home, en blanco y negro |

El original a color se guarda en `assets-originales/PORTADA HD.jpg`.

## Recortes sin fondo (generados para ISK)

`af1-black-1-cut.webp` … `af1-black-6-cut.webp`: las mismas fotos de la Triple Black con el
fondo blanco quitado, para mostrarlas sobre negro. Los JPG con fondo blanco se usan para
compartir en redes.

Se retiraron las fotos editoriales de Unsplash (`hero-af1.jpg`, `editorial-wall.jpg`): la
pared mostraba zapatillas de otros modelos.

## Cómo cambiar las fotos

1. Reemplaza el archivo en `public/images/` con el **mismo nombre** y listo.
2. Para agregar, quitar o reordenar: lista `images` del producto en `src/data/products.ts`
   (la primera es la principal y la segunda es la que aparece al pasar el mouse).
