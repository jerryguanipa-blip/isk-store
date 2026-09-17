# DECISIONES

Decisiones que tomé solo, sin preguntar, mientras trabajaba de noche.
Todas son fáciles de revertir; abajo digo cómo.

---

### 1. Archivos de marca: la carpeta `D:\isk-storepublicbrand` SÍ tenía los archivos
Al principio parecía vacía (una herramienta no veía su contenido). Dentro estaban
`LOGO ISK.jpg` (logo blanco sobre negro, exactamente el descrito) e `ISK intro.mp3`.
Los copié a `public/brand/` como `isk-logo.jpg` e `isk-intro.mp3`, verifiqué que los
archivos fueran idénticos (hash MD5) y recién entonces borré la carpeta mal nombrada.
**No se creó ningún logo inventado: se usó el logo real.**

### 2. El logo SVG se dibujó a mano, calcado del logo real
El logo original es un JPG (no se puede escalar ni animar por partes). Dibujé un SVG
vectorial equivalente (`src/components/brand/IskMark.tsx`) con las letras I, S, K y la
órbita elíptica como elementos separados, para poder animarlos uno por uno en la intro.
El JPG original sigue guardado en `public/brand/isk-logo.jpg` y se usa como icono de iOS.

### 3. Todas las fotos se muestran en blanco y negro
La marca pide "SOLO negro #000000, blanco #FFFFFF y grises". Varias fotos libres de
Unsplash traían colores (luces neón, hojas de otoño, cielo azul). En vez de descartarlas,
las paso por `grayscale` con CSS. Resultado: se ven editoriales y la paleta queda pura.
**Cómo revertirlo:** borra la clase `grayscale` en `src/app/globals.css` (regla `.isk-photo`).

### 4. Tipografía: Space Grotesk + Inter
Space Grotesk para títulos (tiene carácter, se parece al tono de a-ma-maniere sin copiarlo)
e Inter para textos largos y precios. Ambas de Google Fonts, cargadas con `next/font`.

### 5. La intro NO bloquea el contenido para Google
La home se renderiza siempre en el HTML; la intro es un overlay encima que se monta en el
cliente. Google ve la tienda completa. Además la intro solo aparece **una vez por sesión**
(`sessionStorage`), y nunca en `/shop`, `/product/...` ni en el resto de páginas.

### 6. El audio suena al hacer clic en ENTRAR (no antes)
Los navegadores bloquean el audio automático. Por eso `isk-intro.mp3` arranca exactamente
en el clic de ENTRAR. Hay botón de silencio y enlace "Saltar intro" siempre visibles, y la
preferencia de silencio se recuerda en `localStorage`.

### 7. Stock: todas las tallas siempre disponibles
El pedido decía "todas disponibles". Dejé el campo `stock` en cada talla dentro de
`src/data/products.ts` para que en el futuro se pueda marcar una talla como agotada
sin tocar el código de las páginas.

### 8. Checkout por WhatsApp con número placeholder
`NEXT_PUBLIC_WHATSAPP` vale `51XXXXXXXXX` (el valor que me diste). **Eso no es un número
real**: mientras siga así, el botón de WhatsApp abrirá un chat inválido.
Ver `PENDIENTES.md`, punto 1. Se cambia en un solo sitio (`.env.local` y Vercel).

### 9. Estructura lista para Mercado Pago / Culqi
`src/lib/checkout.ts` define una interfaz `PaymentProvider` y hoy solo implementa
`whatsappProvider`. Para agregar Mercado Pago o Culqi basta con escribir otro provider y
cambiar una línea en `src/config/site.ts`. No hay que tocar el carrito ni las páginas.

### 10. Libro de Reclamaciones: se envía por WhatsApp
Es obligatorio en Perú (Indecopi). Como todavía no hay backend ni correo configurado, el
formulario valida los datos y arma un mensaje de WhatsApp con el reclamo completo y un
código de reclamo generado en el momento. **Legalmente conviene además guardarlo en una
base de datos y responder en 15 días hábiles**: anotado en `PENDIENTES.md`.

### 11. Precio y moneda en un solo lugar
`src/config/site.ts` tiene `price: 209.9` y la función de formato `S/ 209.90`. Cambiar el
precio de toda la tienda = cambiar ese número.

### 12. Solo Air Force 1 clásicas en las fotos
Pediste expresamente "solo AF1 blancas clásicas y negras clásicas". Revisé cada foto una
por una y saqué todo lo que no lo era (AF1 Type, Shadow, Sage, Utility, swoosh de color,
Air Max 90, adidas). Triple White quedó con 3 fotos reales. Para Triple Black no hay fotos
libres de la clásica de cuerpo entero, así que puse una imagen de marca provisional + un
detalle real de suela. **No usé Pinterest** (derechos de autor). Ver `IMAGENES.md`.

### 13. `.vercel` y `.env.local` fuera de git
`vercel link` agregó un token temporal (`VERCEL_OIDC_TOKEN`) a `.env.local`. Ese archivo
nunca se sube a GitHub (está en `.gitignore`), así que el repo público no expone nada.

### 14. Fotos del dueño: marco blanco, sin recorte y sin filtro
Las fotos que entregaste son de catálogo sobre fondo blanco puro. En vez de recortarlas o
pasarlas a gris, se muestran enteras en marcos blancos cuadrados sobre la web negra (estilo
catálogo premium). Los bloques WHITE / BLACK de la home pasaron a paneles blancos con texto
negro. El hero y la banda editorial siguen con fotos de ambiente en blanco y negro.
**Cómo revertirlo:** en `ProductCard.tsx` y `ProductGallery.tsx`, `object-contain bg-white` →
`object-cover`.

### 15. Aviso de WhatsApp oculto para los clientes
El número sigue pendiente por tu decisión, pero el aviso "falta configurar WhatsApp" ya no
se muestra en el carrito: lo veían los compradores.

---

## Rediseño final (16/09/2026)

### 16. Se quitó la pantalla negra de entrada con botón ENTRAR
El brief final pide entrar y ver directamente ISK, la portada y AIR FORCE 1, con el audio
sonando solo. Una pantalla que obliga a tocar "ENTRAR" frena la compra en móvil. El audio
ahora vive en `src/components/BrandAudio.tsx`: intenta autoplay y, si el navegador lo
bloquea, suena con el primer toque, clic o tecla. Suena una sola vez por visita, sin loop,
y no se reinicia al navegar. Mientras suena aparece un botón pequeño "SILENCIAR" abajo a la
izquierda. El código anterior de la intro sigue guardado en git.

### 17. Portada en blanco y negro, fundida con el negro
`PORTADA HD.jpg` se convirtió a monocromo (`public/images/portada-hd.jpg`); el original a
color queda en `assets-originales/`. En móvil ocupa toda la pantalla; en escritorio ocupa
el 64% derecho y se desvanece hacia la izquierda. La foto mide 1199 px de ancho, así que
de esta forma no pierde nitidez en pantallas grandes.

### 18. AF1 negras recortadas (sin fondo) para el bloque BLACK
Las fotos de la negra venían con fondo blanco. Se generaron versiones con transparencia
(`public/images/af1-black-N-cut.webp`) para ponerlas sobre negro con un foco de luz, sin
bordes visibles. La blanca va sobre blanco puro (el fondo coincide exacto). Los JPG
originales se conservan y se usan para compartir en redes (Open Graph).

### 19. Títulos calculados desde el ancho de pantalla
"AIR FORCE 1", "WHITE/BLACK" y "DOS COLORES…" calculan su tamaño para ocupar casi todo el
ancho sin saltar nunca de línea (probado de 320 px a 1440 px).

### 20. Botón flotante de WhatsApp
Aparece después del hero y se oculta solo si debajo hay un botón, enlace o talla, para no
tapar nada. Es negro con borde para verse sobre fondos blancos y negros.

### 21. Una sola URL oficial
`https://iskoficial.com`. `www` redirige al dominio raíz; `*.vercel.app` lleva `noindex` y,
una vez conectado el dominio, redirige con `REDIRECT_VERCEL_TO_DOMAIN=1`.

### 22. Se retiraron textos de relleno
Fuera "NIKE · ORIGINALES · PERÚ", "POR QUÉ COMPRAR EN ISK", las tarjetas y listas de
beneficios (también en la ficha y el carrito), la pared con zapatillas de otros modelos y
el CTA "IR A LA TIENDA". El lema pasó a "IMAGINA · SUEÑA · KREA".

### 23. Correcciones del 16/09/2026 (tarde)
- Footer: "ISK OFICIAL · TODOS LOS DERECHOS RESERVADOS 2026".
- Menú móvil: se quitó CARRITO y se puso **COMPRAR VÍA WHATSAPP** (abre WhatsApp directo con el
  mensaje de Air Force 1). Se usó "VÍA" para que coincida con todos los botones de la web.
- "Originales" → "Clásicas" en título, descripción de /shop, footer, palabras clave y detalle del
  producto. **No** se cambió la garantía de autenticidad de Términos (es legal) ni "caja original"
  en Cambios (se refiere a la caja, no a la calidad).
- Fotos sin fondo de PhotoRoom en toda la web. La Triple White sigue sobre marco blanco y la Triple
  Black sobre negro con foco: se probó la blanca sobre negro (se ve muy bien), pero la vista trasera
  de la blanca no vino sin fondo y habría quedado como un cuadro blanco en la galería.

### 24. Theme "kith-style" (solo visual)
- **Inter** para todo (ya estaba cargada y es una grotesca neutra); se quitó Space Grotesk.
- El marquee grande se reemplazó por uno pequeño en la barra de anuncio, con el mismo texto
  ("IMAGINA · SUEÑA · KREA"). No existía un texto de "envíos" para esa barra, así que no se inventó.
- Hero: el CTA con borde es "COMPRAR VÍA WHATSAPP" (blanco sobre la foto). "VER WHITE / BLACK" pasó
  a enlace subrayado para no poner un botón negro sobre una foto oscura.
- Tarjetas WHITE y BLACK sobre la misma superficie `#F5F5F3` (grilla de catálogo uniforme).
  La vista trasera de la blanca (JPG con fondo blanco) usa `mix-blend-mode: multiply` para
  fundirse con la superficie sin mostrar un recuadro.
- Acordeón "ENVÍOS" usa la etiqueta que ya existía en los enlaces legales; dentro están los mismos
  enlaces "VER POLÍTICA DE ENVÍOS" y "VER CAMBIOS Y DEVOLUCIONES".
- Footer en capitalización normal mediante CSS (`lowercase` + primera letra en mayúscula).
- Se eliminó `CustomCursor.tsx` (el brief pide sin cursor personalizado).

### 26. Hero: lettering "Air Force 1" según referencia OPCIÓN 03
- Con la imagen de referencia (03 · ESCRITURA) se cambió Yellowtail por **Mr Dafoe** (Google Fonts):
  pincel seco, inclinado y ascendente. Texto en "Air Force 1" como en la referencia, rotado -6°.
- Se mantiene la misma animación de escritura (máscara, 1500 ms, una vez), precio Inter 300 y secuencia.
