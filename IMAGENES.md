# IMÁGENES — origen y licencia

Todas las fotos vienen de **Unsplash** o **Pexels**, con licencia libre para uso comercial
sin necesidad de permiso ni atribución ([Licencia Unsplash](https://unsplash.com/es/licencia),
[Licencia Pexels](https://www.pexels.com/es-es/licencia/)). Igual dejo anotado el origen.

**Ninguna imagen es de Pinterest ni de otras tiendas.**

Solo se usaron fotos de la **Air Force 1 clásica** (se descartaron variantes como Type,
Shadow, Utility con swoosh de color, Air Max, adidas, etc.).

| Archivo | Fuente | ID | Qué muestra | Dónde se usa |
|---|---|---|---|---|
| `hero-af1.jpg` | Unsplash | `photo-1617659512089-6fdec6c54406` | AF1 '07 blanca clásica, fondo negro | Hero de la home |
| `af1-white-1.jpg` | Unsplash | `photo-1617659512089-6fdec6c54406` | AF1 '07 blanca clásica, fondo negro | Foto principal Triple White |
| `af1-white-2.jpg` | Unsplash | `photo-1597350584914-55bb62285896` | Par AF1 '07 Triple White | Foto 2 (hover en /shop) |
| `af1-white-3.jpg` | Unsplash | `photo-1637962032623-a692b4bd4a84` | Detalle AIR + cuero blanco | Foto 3 |
| `af1-white-4.jpg` | Unsplash | `photo-1613070120286-98b11cdb9ae2` | Par AF1 '07 blancas en estudio | Foto 4 |
| `af1-black-1.jpg` | Pexels | `2859181` | AF1 negras puestas (lifestyle) | Foto principal Triple Black |
| `af1-black-2.jpg` | Pexels | `2119223` | Suela AIR de una AF1 negra | Foto 2 (hover en /shop) |
| `af1-black-3.jpg` | Unsplash | `photo-1676838179247-6e60dba67d5c` | Cuero negro, ambiente | Foto 3 |
| `editorial-wall.jpg` | Unsplash | `photo-1708088588197-bd7d8088019a` | Pared de zapatillas en B/N | Banda editorial de la home |

URLs directas:
- Unsplash: `https://unsplash.com/photos/<parte final del ID>`
- Pexels: `https://www.pexels.com/photo/<ID>/`

## ⚠ Aviso importante sobre Triple Black

En Unsplash y Pexels **no existe una foto libre de la AF1 '07 Triple Black clásica de
cuerpo entero en estudio**. Revisé decenas. Las que usé son AF1 negras reales, pero la
foto principal es "puesta" y tiene el swoosh en tono claro. **Es la primera foto que conviene
reemplazar por una tuya.** Anotado en `PENDIENTES.md`.

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

## Cómo cambiar las fotos

1. Pon tu foto en `public/images/` con el mismo nombre (ej. `af1-black-1.jpg`) y listo.
2. Para agregar o quitar fotos, edita la lista `images` del producto en `src/data/products.ts`.

> Todas las fotos se ven en escala de grises por CSS, para respetar la paleta
> negro/blanco/grises. Ver `DECISIONES.md`.
