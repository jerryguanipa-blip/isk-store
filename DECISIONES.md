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
