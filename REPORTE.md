# REPORTE — Tienda ISK

**Fecha:** 16 de septiembre de 2026

## 🟢 LA WEB ESTÁ EN VIVO

### 👉 https://iskoficial.com

| Qué | Dónde |
|---|---|
| Web publicada | **https://iskoficial.com** (HTTPS activo) |
| Código en GitHub | https://github.com/jerryguanipa-blip/isk-store |
| Panel de Vercel | https://vercel.com/isk-offcial/isk-store |
| Carpeta en tu PC | `D:\isk-store` |
| Dominio iskoficial.com | ✅ **Conectado el 16/09/2026.** `www` y `isk-store.vercel.app` redirigen a https://iskoficial.com |

---

## 🆕 REDISEÑO FINAL (16/09/2026)

**Hecho y publicado:**
- Portada con tu `PORTADA HD` en blanco y negro, fundida con el negro; "AIR FORCE 1" en una sola línea en todos los tamaños.
- WHITE sobre blanco y BLACK sobre negro con las zapatillas **sin fondos pegados** (recortes con transparencia).
- CTA **COMPRAR VÍA WHATSAPP** con mensaje según el color, más botón flotante que nunca tapa botones.
- Marquee **IMAGINA · SUEÑA · KREA** suave, con bordes difuminados.
- Audio ISK: autoplay si el navegador deja; si no, con el primer toque. Una vez por visita, completo, sin loop.
- Fuera: "NIKE · ORIGINALES · PERÚ", "POR QUÉ COMPRAR EN ISK", beneficios, pared de otros modelos, "IR A LA TIENDA".

**Pruebas automáticas (Chrome real):**
- 10 anchos (320 → 1440 px) × 7 páginas: **0 desbordes, 0 textos cortados, 0 botones tapados, 0 errores de consola, 0 archivos 404**.
- Audio probado con autoplay bloqueado y permitido: suena 1 vez, no se reinicia con scroll, al abrir producto ni al recargar.
- Ninguna ruta `C:\Users\...` en la web publicada.

**Lighthouse en producción (móvil):**

| Página | Rendimiento | Accesibilidad | Buenas prácticas |
|---|---|---|---|
| Inicio | **100** | **100** | **100** |
| Producto | **97** | **100** | **100** |

> En el dominio propio SEO da **100**. `isk-store.vercel.app` lleva `noindex` y redirige a iskoficial.com.

---

## ⚡ LO URGENTE

1. ~~Conectar iskoficial.com~~ ✅ **Hecho:** DNS cambiados en GoDaddy, HTTPS activo
   (Let's Encrypt, se renueva solo), `www` y `isk-store.vercel.app` redirigen al dominio.
   Lighthouse en https://iskoficial.com: **97 / 100 / 100 / 100** (rendimiento, accesibilidad,
   buenas prácticas, SEO).
2. **Poner tu número real de WhatsApp** cuando lo decidas (hoy `51XXXXXXXXX`).
   Cómo: `PENDIENTES.md`, punto 1.

---

## ✅ QUÉ SE HIZO

### Marca
- Encontré tus archivos en la carpeta mal nombrada, los copié a `public/brand/`
  (`isk-logo.jpg`, `isk-intro.mp3`), confirmé que eran idénticos y borré la carpeta vieja.
- Vectoricé el logo ISK a SVG (órbita + letras) en versión blanca y negra.
- Favicon, icono de iPhone, manifest e imagen para compartir en redes (Open Graph) con el logo.

### Intro de entrada
- Pantalla negra: la órbita se dibuja sola, aparecen I, S y K una por una (fundido, desenfoque
  y escala) y luego "IMAGINA · SUEÑA & KREA" con las letras separándose.
- Botón **ENTRAR** con pulso suave. **Tu audio suena al hacer clic** (los navegadores no
  permiten sonido antes).
- Al entrar: el logo hace zoom y la home sube como una cortina.
- Botón de silencio y "Saltar intro" siempre visibles. Se puede cerrar con Esc.
- Sale **una sola vez por visita** y solo en la página de inicio.
- Versión simple para quien tiene activado "reducir movimiento".
- Google ve la tienda completa: la intro no afecta el SEO.

### Páginas
| Página | Qué tiene |
|---|---|
| `/` Inicio | Hero con AF1 blanca clásica, "AIR FORCE 1", botón COMPRAR AHORA, bloques WHITE / BLACK en paneles blancos con tus fotos, cinta animada "ISK · IMAGINA · SUEÑA & KREA", 4 beneficios, banda editorial |
| `/shop` | Grilla con filtro TODO / WHITE / BLACK y cambio de foto al pasar el mouse |
| `/product/air-force-1-triple-white` | Galería de 6 fotos con miniaturas y zoom, precio, tallas EUR 36–44 (obligatorio elegir), guía de tallas EUR/US/CM, AGREGAR AL CARRITO, COMPRAR POR WHATSAPP |
| `/product/air-force-1-triple-black` | Igual |
| Carrito lateral + `/cart` | Cantidades, subtotal, FINALIZAR PEDIDO POR WHATSAPP |
| `/envios` `/cambios` `/terminos` `/privacidad` | Textos legales completos, en español de Perú |
| `/libro-de-reclamaciones` | Formulario Indecopi completo, valida, genera código de reclamo y lo envía por WhatsApp |
| 404 | Página propia con el logo ISK |

### Detalles
- Animaciones al hacer scroll, transiciones entre páginas, cursor propio en computadora,
  botón flotante de WhatsApp.
- Carrito guardado en el navegador (no se pierde al recargar).
- Mensaje de WhatsApp con: saludo, cada producto con color, talla y cantidad, total en S/ y
  pedido de nombre, dirección y distrito.
- Estructura lista para agregar Mercado Pago o Culqi (`src/lib/checkout.ts`).

### SEO y calidad
- Título "ISK | Air Force 1 Originales en Perú", descripción, Open Graph y Twitter card.
- `sitemap.xml`, `robots.txt`, `manifest`, JSON-LD de Product con precio en PEN.
- Todo en español (`es-PE`), imágenes optimizadas (AVIF/WebP), navegación por teclado.

**Lighthouse en producción (móvil):**

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Inicio | 94 | 96 | 100 | 100 |
| Tienda | 91 | 94 | 100 | 100 |
| Producto | 91 | 96 | 100 | 100 |

Después de medir corregí los 3 avisos de accesibilidad (contraste, orden de títulos y nombre
del botón del carrito), así que esos números deberían subir un poco más.

### Verificado en la web publicada
- Todas las páginas responden (y una dirección inventada da la 404 propia).
- La intro aparece, ENTRAR la cierra, se libera el scroll y no se repite en la visita.
- Elegir talla es obligatorio (sin talla sale "ELIGE UNA TALLA PARA CONTINUAR").
- Agregar al carrito abre el panel con color, talla y precio correctos.
- Cantidades y totales cuadran en el panel, en `/cart`, en el contador y en el mensaje.
- Guía de tallas con 9 filas, filtro WHITE/BLACK, enlace `wa.me` con el mensaje armado.
- Sin errores en la consola del navegador.

---

## 🧭 DECISIONES QUE TOMÉ

Todas explicadas en `DECISIONES.md`. Las más importantes:

1. **Fotos de producto: las 12 que entregaste**, enteras sobre marcos blancos (sin recorte ni filtro).
2. **Hero y banda editorial en blanco y negro**, con fotos libres de AF1 clásica.
3. **No usé Pinterest**: esas fotos tienen dueño.
4. **Aviso de WhatsApp oculto** para los clientes mientras el número sigue pendiente.
5. Tipografías Space Grotesk (títulos) + Inter (textos).
6. La intro solo sale en el inicio y una vez por visita.

---

## 🛠 CÓMO CAMBIAR COSAS

Después de cualquier cambio, publica así (en `D:\isk-store`):

```bash
git add -A
```

```bash
git commit -m "Describe tu cambio"
```

```bash
git push
```

```bash
vercel --prod --yes
```

> El último comando es necesario mientras no conectes GitHub con Vercel
> (`PENDIENTES.md`, punto 2). Cuando lo conectes, basta con `git push`.

### El precio
Archivo `src/config/site.ts`, línea:

```ts
price: 209.9,
```

Cambia el número (ej. `229.9`). Se actualiza en toda la web, el carrito, WhatsApp y Google.

### El WhatsApp
Es una variable, no está en el código:

- En tu PC: archivo `.env.local` → `NEXT_PUBLIC_WHATSAPP=51987654321`
- En la web publicada: pasos exactos en `PENDIENTES.md`, punto 1.

Formato: código de país + número, sin `+`, espacios ni guiones.

### Las fotos
- Reemplaza el archivo en `public/images/` **con el mismo nombre** y listo (`af1-white-1.jpg` … `af1-black-6.jpg`).
- Para agregar o quitar fotos de un producto: lista `images` en `src/data/products.ts`.
- Origen y licencia de cada foto: `IMAGENES.md`.

### Las redes sociales y el correo
En `src/config/site.ts`: `social` (Instagram, TikTok, Facebook) y `email`.

### Marcar una talla como agotada
En `src/data/products.ts`, en la tabla de tallas, cambia `available: true` por `false`.
El botón de esa talla queda tachado y no se puede elegir.

---

## 📋 PENDIENTES PARA TI

El detalle y los pasos están en **`PENDIENTES.md`**. Resumen:

| # | Qué | Urgencia |
|---|---|---|
| 1 | Poner el número real de WhatsApp | 🔴 Bloquea las ventas |
| 2 | Conectar GitHub con Vercel para que publique solo al hacer `git push` | 🟠 |
| 3 | Cambiar los DNS en GoDaddy (**ojo: hoy apuntan a Shopify**) | 🟠 |
| 4 | ~~Fotos del producto~~ | ✅ Hecho |
| 5 | Confirmar tus cuentas de Instagram / TikTok / Facebook | 🟡 |
| 6 | Crear o cambiar el correo `hola@iskoficial.com` | 🟡 |
| 7 | Guardar los reclamos en una base de datos (Indecopi) | 🟡 |
| 8 | Agregar razón social y RUC en las páginas legales | 🟡 |

---

## 📁 ARCHIVOS DE ESTE REPORTE

| Archivo | Para qué |
|---|---|
| `REPORTE.md` | Este resumen |
| `PENDIENTES.md` | Lo que tienes que hacer tú, con pasos |
| `DNS_GODADDY.md` | Conectar iskoficial.com, paso a paso |
| `DECISIONES.md` | Qué decidí solo y cómo revertirlo |
| `IMAGENES.md` | Origen y licencia de cada foto |
