# IMÁGENES — origen y licencia

Todas las fotos vienen de **Unsplash** o **Pexels**, con licencia libre para uso comercial
sin necesidad de permiso ni atribución ([Licencia Unsplash](https://unsplash.com/es/licencia),
[Licencia Pexels](https://www.pexels.com/es-es/licencia/)). Igual dejo anotado el origen.

**Ninguna imagen es de Pinterest ni de otras tiendas.**

Solo se usaron fotos de la **Air Force 1 clásica** (se descartaron variantes como Type,
Shadow, Utility con swoosh de color, Air Max, adidas, etc.).

| Archivo | Fuente | ID | Qué muestra | Dónde se usa |
|---|---|---|---|---|
| `hero-af1.jpg` | Unsplash | `photo-1617659512089-6fdec6c54406` | AF1 '07 Triple White clásica, fondo negro | Hero de la home |
| `af1-white-1.jpg` | Unsplash | `photo-1617659512089-6fdec6c54406` | AF1 '07 Triple White clásica, fondo negro | Foto principal Triple White |
| `af1-white-2.jpg` | Unsplash | `photo-1597350584914-55bb62285896` | Par AF1 '07 Triple White clásicas | Foto 2 (hover en /shop) |
| `af1-white-3.jpg` | Unsplash | `photo-1637962032623-a692b4bd4a84` | Detalle AIR + cuero blanco (AF1 '07) | Foto 3 |
| `af1-black-1.jpg` | **Creada para ISK** | — | Placeholder elegante "AF1 · TRIPLE BLACK" | Foto principal Triple Black (provisional) |
| `af1-black-2.jpg` | Pexels | `2119223` | Suela AIR de una AF1 negra clásica | Foto 2 (hover en /shop) |
| `editorial-wall.jpg` | Unsplash | `photo-1708088588197-bd7d8088019a` | Pared de zapatillas en B/N | Banda editorial de la home |

URLs directas:
- Unsplash: `https://unsplash.com/photos/<parte final del ID>`
- Pexels: `https://www.pexels.com/photo/<ID>/`

## ⚠ Triple Black: la foto principal es provisional

En Unsplash y Pexels **no existe ninguna foto libre de la AF1 '07 Triple Black clásica de
cuerpo entero** (revisé decenas en tres búsquedas distintas). Como pediste solo AF1 clásicas,
no puse ninguna zapatilla parecida: la foto principal es una imagen de marca en negro
("AF1 · TRIPLE BLACK · foto real del producto próximamente") y la segunda es un detalle real
de la suela de una AF1 negra clásica.

**No se usaron fotos de Pinterest** aunque se sugirió un pin: esas imágenes tienen dueño
(fotógrafos o tiendas) y usarlas en una tienda comercial puede traer reclamos por derechos
de autor. La solución buena es tu propia foto (ver `PENDIENTES.md`).

## Descartadas (y por qué)

| ID | Motivo |
|---|---|
| Unsplash `photo-1588361861040` | Es una AF1 **Type**, no la clásica |
| Unsplash `photo-1656230259229`, Pexels `12611630` | Son AF1 **Shadow** (doble swoosh) |
| Unsplash `photo-1712168332222`, `photo-1712167631738` | AF1 con **swoosh rojo** |
| Unsplash `photo-1626379616459` | AF1 **Sage** (plataforma) |
| Unsplash `photo-1687511558022`, `photo-1687511879024` | Son **Air Max 90**, no AF1 |
| Unsplash `photo-1616615965190`, `photo-1574020462714` | Son **adidas** |
| Unsplash `photo-1641745899178` | AF1 **gris** con suela negra |
| Unsplash `photo-1613070120286` | AF1 '07 blanca pero con **swoosh negro** (no es Triple White) |
| Pexels `2859181` | AF1 **Utility** negra con swoosh blanco |
| Unsplash `photo-1676838179247` | Zapatilla negra que **no es AF1** |
| Unsplash `photo-1626379637476` | AF1 **Sage rosada** |

## Cómo cambiar las fotos

1. Pon tu foto en `public/images/` con el mismo nombre (ej. `af1-black-1.jpg`) y listo.
2. Para agregar o quitar fotos, edita la lista `images` del producto en `src/data/products.ts`.

> Todas las fotos se ven en escala de grises por CSS, para respetar la paleta
> negro/blanco/grises. Ver `DECISIONES.md`.
