# IMÁGENES — origen y licencia

Todas las fotos provienen de **Unsplash** y están bajo la
[Licencia Unsplash](https://unsplash.com/es/licencia): uso libre comercial y no comercial,
sin necesidad de permiso ni atribución (aunque aquí se documenta el origen igual).

**No se usó ninguna imagen de Pinterest ni de otras tiendas.**

| Archivo | Origen (Unsplash ID) | URL de la foto | Uso en la web |
|---|---|---|---|
| `hero-af1.jpg` | `photo-1588361861040-ac9b1018f6d5` | https://unsplash.com/photos/ac9b1018f6d5 | Hero a pantalla completa de la home |
| `af1-white-1.jpg` | `photo-1597350584914-55bb62285896` | https://unsplash.com/photos/55bb62285896 | Foto principal Triple White (AF1 '07 real) |
| `af1-white-2.jpg` | `photo-1588361861040-ac9b1018f6d5` | https://unsplash.com/photos/ac9b1018f6d5 | Triple White — foto 2 (hover en /shop) |
| `af1-white-3.jpg` | `photo-1613070120286-98b11cdb9ae2` | https://unsplash.com/photos/98b11cdb9ae2 | Triple White — foto 3 (par AF1 '07) |
| `af1-white-4.jpg` | `photo-1626379616459-b2ce1d9decbc` | https://unsplash.com/photos/b2ce1d9decbc | Triple White — foto 4 (lifestyle) |
| `af1-black-1.jpg` | `photo-1687511558022-7b4f3dbd22e1` | https://unsplash.com/photos/7b4f3dbd22e1 | Foto principal Triple Black |
| `af1-black-2.jpg` | `photo-1687511879024-c3b017aa0729` | https://unsplash.com/photos/c3b017aa0729 | Triple Black — foto 2 (hover en /shop) |
| `af1-black-3.jpg` | `photo-1632497775901-50ba4637399f` | https://unsplash.com/photos/50ba4637399f | Triple Black — foto 3 (editorial pared blanca) |
| `af1-black-4.jpg` | `photo-1676838179247-6e60dba67d5c` | https://unsplash.com/photos/6e60dba67d5c | Triple Black — foto 4 (detalle) |
| `editorial-wall.jpg` | `photo-1708088588197-bd7d8088019a` | https://unsplash.com/photos/bd7d8088019a | Banda editorial de la home |

## Imágenes descartadas (y por qué)

| Unsplash ID | Motivo |
|---|---|
| `photo-1616615965190-08884c4d85c4` | La descripción decía "Nike negra" pero la zapatilla es **adidas** (3 franjas visibles) |
| `photo-1574020462714-5451391cc336` | Es una **adidas Prophere**, no sirve para un producto Nike |
| `photo-1712168332222-c1996322f935` | AF1 con **swoosh rojo**: no es Triple White |

## Cómo cambiar las fotos

1. Deja el archivo nuevo en `public/images/` con el mismo nombre (ej. `af1-white-1.jpg`).
2. O edita la lista `images` del producto en `src/data/products.ts`.
3. Nada más. Next.js las optimiza solo.

> Nota de diseño: todas las fotos se muestran **en escala de grises** por CSS para respetar la
> paleta de marca (solo negro, blanco y grises). Al pasar el mouse en /shop recuperan algo de
> contraste. Ver `DECISIONES.md`.
