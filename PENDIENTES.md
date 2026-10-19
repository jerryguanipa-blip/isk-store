# PENDIENTES — cosas que necesitan que TÚ hagas algo

Ordenadas por urgencia. Lo demás ya está hecho y funcionando.

---

## 🔴 0. PUBLICAR LA VERSIÓN NUEVA (el panel todavía no está en iskoficial.com)

El código del panel ya está en GitHub (commit subido), pero **falta publicarlo en Vercel**: mi
sesión de `vercel` en esta PC perdió el permiso ("Not authorized") y los despliegues a producción
están bloqueados para mí. Hazlo tú con estos tres comandos, en orden:

```bash
vercel login
```

```bash
vercel link --yes
```

```bash
vercel env rm NEXT_PUBLIC_WHATSAPP production
```

(si dice que no existe, perfecto, sigue de largo)

```bash
vercel --prod --yes
```

Cuando termine, abre https://iskoficial.com/admin: debe pedirte contraseña (para eso es el punto
1 de abajo). Si prefieres no usar la terminal, también puedes conectar GitHub con Vercel (punto 6)
y a partir de ahí cada `git push` publica solo.

---

## 🔴 1. CONTRASEÑA DEL PANEL `/admin` (sin esto el panel no abre)

El panel de la tienda está en **https://iskoficial.com/admin**. Para que abra hay que poner una
contraseña tuya (mínimo 6 caracteres). Se hace una sola vez:

```bash
vercel env add ADMIN_PASSWORD production
```

Te va a pedir el valor: escribe la contraseña que quieras (no la escribas en el chat ni en
ningún archivo del proyecto). Después, para que tome efecto:

```bash
vercel --prod --yes
```

En tu PC, para probar en local, el archivo `D:\isk-store\.env.local` ya tiene una de prueba
(`ADMIN_PASSWORD`). Cámbiala cuando quieras: ese archivo no se sube a GitHub.

---

## 🔴 2. GUARDAR LOS PEDIDOS DE VERDAD (Vercel Blob, es gratis para este tamaño)

Hoy, en la web publicada, los pedidos se guardan en memoria temporal del servidor: funcionan,
pero se borran cuando Vercel reinicia la función. Para que queden guardados:

1. Entra a **vercel.com → proyecto `isk-store` → pestaña Storage**.
2. Crea un store de tipo **Blob** y conéctalo al proyecto `isk-store`.
   Vercel agrega solo la variable `BLOB_READ_WRITE_TOKEN`; no hay que copiar nada a mano.
3. Vuelve a desplegar: `vercel --prod --yes`.

El código ya detecta esa variable: si existe, guarda ahí; si no, avisa en el panel con un aviso
naranja. (Yo no puedo crear el store: pide tu cuenta y es un servicio que tienes que aceptar tú.)

---

## ✅ 3. NÚMERO DE YAPE / PLIN — HECHO (19/10/2026)

Ya está puesto en el código: **983501670**, a nombre de **Jerimy G.**, para Yape y para Plin.
Es lo que ve el cliente en la pantalla de pago, con botón de copiar.

Si alguna vez cambias de número (o si el de Plin es distinto al de Yape), **no hace falta tocar
código**: `/admin` → **AJUSTES** → escribes el número nuevo → **GUARDAR AJUSTES**.

---

## 🔴 4. INVENTARIO FINAL

Dijiste que me pasarías el inventario final. Mientras tanto, todas las tallas están sin control
de stock (se pueden vender). En `/admin` → **INVENTARIO** pones los pares que tienes de cada
talla: en 0 la talla sale tachada en la web, y vacío significa «sin control».

---

## ✅ 5. NÚMERO DE WHATSAPP — HECHO (19/10/2026)

Todos los botones de WhatsApp de la web (y la confirmación de cada pedido) van al
**916385028** — tu WhatsApp de JERRY SHOP. Quedó escrito en el código como `51916385028`,
así que funciona sin configurar nada más.

**Un solo detalle al publicar:** si en Vercel quedó guardada la variable
`NEXT_PUBLIC_WHATSAPP` con el número de prueba viejo, esa variable **le gana al código**.
Para asegurarte, corre esto una vez antes de publicar (si dice que no existe, mejor: no hay
nada que borrar):

```bash
vercel env rm NEXT_PUBLIC_WHATSAPP production
```

Y después de publicar, abre https://iskoficial.com y toca el botón verde de WhatsApp: tiene
que abrir el chat de JERRY SHOP (916385028).

---

## 🟠 6. CONECTAR GITHUB CON VERCEL (para publicar con un solo `git push`)

La web ya está publicada, pero Vercel **no pudo enlazarse con tu repositorio de GitHub**
(lo intenté 3 veces). El error fue:

> You need admin or write access to the repository "isk-store" to link it.

Pasa porque tu cuenta de Vercel (**iskoficial5**) y tu cuenta de GitHub
(**jerryguanipa-blip**) no están conectadas entre sí. Solo tú puedes autorizarlo desde el
navegador:

1. Entra a https://vercel.com/isk-offcial/isk-store/settings/git
2. Clic en **Connect Git Repository** → **GitHub**.
3. Inicia sesión con **jerryguanipa-blip** y autoriza la app de Vercel
   (puedes darle acceso solo al repo `isk-store`).
4. Elige `jerryguanipa-blip/isk-store`, rama `main`.

Desde ese momento cada `git push` publica la web sola. **Mientras tanto**, para publicar
cambios usa en `D:\isk-store`:

```bash
vercel --prod --yes
```

---

## ✅ 7. DOMINIO iskoficial.com — HECHO (16/09/2026)

- GoDaddy (cuenta ISK): `A @ → 76.76.21.21` y `CNAME www → cname.vercel-dns.com`.
  Los demás registros (`_dmarc`, NS, `_domainconnect`, verificación de Shopify) quedaron igual.
- Certificado HTTPS emitido por Vercel (Let's Encrypt), renovación automática.
- `www.iskoficial.com` y `isk-store.vercel.app` redirigen a https://iskoficial.com.
- La tienda de Shopify ya no se muestra en este dominio.

---

## ✅ 8. FOTOS DEL PRODUCTO — HECHO

Se integraron tus 12 fotos (6 Triple White + 6 Triple Black) el 16/09/2026.
Ver `IMAGENES.md`.

---

## 🟡 9. REDES SOCIALES: LAS CUENTAS SON UNA SUPOSICIÓN

En `src/config/site.ts` puse:

- Instagram: `https://www.instagram.com/iskoficial`
- TikTok: `https://www.tiktok.com/@iskoficial`
- Facebook: `https://www.facebook.com/iskoficial`

**No verifiqué que existan.** Si tus cuentas se llaman distinto, corrige esas tres líneas.
Si alguna red no la usas, bórrala de ahí y desaparece del footer.

---

## 🟡 10. CORREO DE CONTACTO

Puse `hola@iskoficial.com` en `src/config/site.ts`. Aparece en las páginas legales
(privacidad, cambios, términos). **Si ese buzón no existe, créalo o cámbialo**, porque
legalmente es el canal de contacto que estás publicando.

---

## 🟡 11. LIBRO DE RECLAMACIONES: FALTA GUARDARLO EN ALGÚN LADO

Hoy el formulario valida los datos, genera un código de reclamo y lo envía por WhatsApp.
Funciona y cumple con mostrar el libro, **pero la normativa de Indecopi pide además:**

- Guardar cada reclamo (mínimo 2 años).
- Enviar una copia al correo del consumidor.
- Responder en máximo 15 días hábiles.

Para cumplirlo del todo hace falta una base de datos y un envío de correo
(por ejemplo Supabase + Resend). No lo monté porque requiere cuentas y claves tuyas.
La estructura del formulario ya está lista para enchufarlo.

---

## 🟡 12. DATOS DE LA EMPRESA EN LAS PÁGINAS LEGALES

Las páginas legales están escritas y son correctas, pero **les falta la razón social y el
RUC**, que es lo que exige Indecopi. Cuando me los pases (o los pongas tú) hay que
agregarlos en:

- `src/app/terminos/page.tsx` → sección "1. QUIÉNES SOMOS"
- `src/app/libro-de-reclamaciones/page.tsx` → recuadro de la izquierda

---

## 🟢 13. COSAS QUE DECIDÍ YO

Están todas explicadas en `DECISIONES.md`. Si alguna no te gusta, ahí dice cómo revertirla.
