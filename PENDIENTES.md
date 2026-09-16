# PENDIENTES — cosas que necesitan que TÚ hagas algo

Ordenadas por urgencia. Lo demás ya está hecho y funcionando.

---

## 🔴 1. PONER EL NÚMERO REAL DE WHATSAPP (bloquea las ventas)

Hoy el número es el placeholder `51XXXXXXXXX`. **Mientras siga así, ningún botón de
WhatsApp va a abrir un chat real y la tienda no puede recibir pedidos.**

Se cambia en dos sitios:

**a) En tu PC (para pruebas locales)** — archivo `D:\isk-store\.env.local`:

```bash
NEXT_PUBLIC_WHATSAPP=51987654321
```

**b) En Vercel (la web publicada):**

```bash
vercel env rm NEXT_PUBLIC_WHATSAPP production
```

```bash
vercel env add NEXT_PUBLIC_WHATSAPP production
```

Te pedirá el valor: escribe tu número con código de país y sin `+`, espacios ni guiones
(ejemplo: `51987654321`). Después hay que volver a desplegar:

```bash
vercel --prod --yes
```

> Mientras el número sea el placeholder, la web muestra un aviso gris en el carrito.
> Ese aviso desaparece solo en cuanto pongas un número válido.

---

## 🟠 2. APUNTAR EL DOMINIO iskoficial.com EN GODADDY

Los registros exactos están en `DNS_GODADDY.md`, explicados paso a paso.
Hasta que hagas eso, la web vive en la URL de Vercel (está en `REPORTE.md`).

---

## 🟡 3. REDES SOCIALES: LAS CUENTAS SON UNA SUPOSICIÓN

En `src/config/site.ts` puse:

- Instagram: `https://www.instagram.com/iskoficial`
- TikTok: `https://www.tiktok.com/@iskoficial`
- Facebook: `https://www.facebook.com/iskoficial`

**No verifiqué que existan.** Si tus cuentas se llaman distinto, corrige esas tres líneas.
Si alguna red no la usas, bórrala de ahí y desaparece del footer.

---

## 🟡 4. CORREO DE CONTACTO

Puse `hola@iskoficial.com` en `src/config/site.ts`. Aparece en las páginas legales
(privacidad, cambios, términos). **Si ese buzón no existe, créalo o cámbialo**, porque
legalmente es el canal de contacto que estás publicando.

---

## 🟡 5. LIBRO DE RECLAMACIONES: FALTA GUARDARLO EN ALGÚN LADO

Hoy el formulario valida los datos, genera un código de reclamo y lo envía por WhatsApp.
Funciona y cumple con mostrar el libro, **pero la normativa de Indecopi pide además:**

- Guardar cada reclamo (mínimo 2 años).
- Enviar una copia al correo del consumidor.
- Responder en máximo 15 días hábiles.

Para cumplirlo del todo hace falta una base de datos y un envío de correo
(por ejemplo Supabase + Resend). No lo monté porque requiere cuentas y claves tuyas.
La estructura del formulario ya está lista para enchufarlo.

---

## 🟡 6. DATOS DE LA EMPRESA EN LAS PÁGINAS LEGALES

Las páginas legales están escritas y son correctas, pero **les falta la razón social y el
RUC**, que es lo que exige Indecopi. Cuando me los pases (o los pongas tú) hay que
agregarlos en:

- `src/app/terminos/page.tsx` → sección "1. QUIÉNES SOMOS"
- `src/app/libro-de-reclamaciones/page.tsx` → recuadro de la izquierda

---

## 🟠 7. FOTOS REALES DE LA TRIPLE BLACK (la principal es provisional)

Pediste **solo AF1 clásicas blancas y negras**. La blanca quedó con 3 fotos reales de la
AF1 '07 Triple White clásica. Para la negra **no existe ninguna foto libre** de la AF1 '07
Triple Black clásica de cuerpo entero, así que la foto principal es una imagen de marca
("AF1 · TRIPLE BLACK · foto real del producto próximamente").

**Lo que tienes que hacer:** tómale fotos a tu par negro con el celular (luz de ventana,
fondo liso blanco o negro, de costado y en par) y guárdalas como:

- `public/images/af1-black-1.jpg` ← la principal (de costado)
- `public/images/af1-black-3.jpg` ← opcional, el par (y agrégala en `src/data/products.ts`)

**No uses fotos de Pinterest** (el pin que mandaste): tienen dueño y en una tienda que vende
pueden traer reclamos o bajas por derechos de autor. Si quieres una foto profesional sin
tomarla tú, cómprala en un banco con licencia (Shutterstock, Adobe Stock) o pídele al
proveedor las fotos oficiales con permiso de uso.

Para publicar el cambio: guarda las fotos y ejecuta en `D:\isk-store`:

```bash
git add -A
```

```bash
git commit -m "Fotos reales Triple Black"
```

```bash
vercel --prod --yes
```

---

## 🟢 8. COSAS QUE DECIDÍ YO

Están todas explicadas en `DECISIONES.md`. Si alguna no te gusta, ahí dice cómo revertirla.
