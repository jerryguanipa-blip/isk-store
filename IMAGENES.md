# IMÁGENES — origen

## Fotos de producto (sin fondo, PhotoRoom) — vigentes desde el 16/09/2026

El dueño entregó 10 PNG con fondo transparente (procesados con PhotoRoom, batch remover).
Originales guardados en `assets-originales/sin-fondo/`. Convertidos a WebP con alfa
(calidad 90, 2000×2000) en `public/images/`.

| Archivo web | PNG original | Vista |
|---|---|---|
| `af1-white-1-clean.webp` | `1B_sin_fondo.png` | Lateral (principal) |
| `af1-white-2-clean.webp` | `4B_sin_fondo.png` | Par 3/4 (hover en /shop) |
| `af1-white-3-clean.webp` | `2B_sin_fondo.png` | Lateral interna |
| `af1-white-4-clean.webp` | `5B_sin_fondo.png` | Desde arriba |
| `af1-white-5.jpg` | *(no vino PNG de 6B)* | Trasera — se mantiene la foto con fondo blanco |
| `af1-white-6-clean.webp` | `3B_sin_fondo.png` | Suela |
| `af1-black-1-clean.webp` | `1BLACK_sin_fondo.png` | Lateral (principal) |
| `af1-black-2-clean.webp` | `4BLACK_sin_fondo.png` | Par 3/4 (hover en /shop) |
| `af1-black-3-clean.webp` | `3BLACK_sin_fondo.png` | Lateral interna |
| `af1-black-4-clean.webp` | `5BLACK_sin_fondo.png` | Desde arriba |
| `af1-black-5-cut.webp` | *(no vino PNG de 6BLACK)* | Trasera — se mantiene el recorte casero anterior |
| `af1-black-6-clean.webp` | `2BLACK_sin_fondo.png` | Suela |

Para compartir en redes (Open Graph) se siguen usando `af1-white-1.jpg` y `af1-black-1.jpg`
(con fondo blanco): WhatsApp y Facebook no muestran bien imágenes transparentes.

**Pendiente opcional:** pasar por PhotoRoom `6B` y `6BLACK` (vista trasera) y guardarlas como
`af1-white-5-clean.webp` / `af1-black-5-clean.webp` para completar el set.

> ⚠ Licencia: son fotos de catálogo tipo oficial de Nike. Muy usadas por revendedores, pero sin
> licencia libre; si alguna plataforma lo reclama, reemplazarlas por fotos propias.

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
