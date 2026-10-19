# PENDIENTES — cosas que necesitan que TÚ hagas algo

Ordenadas por urgencia. Lo demás ya está hecho y funcionando.

---

## ✅ 0. PUBLICAR — RESUELTO (19/10/2026)

La web ya no se publica a mano: **cada cambio que subo a GitHub se publica solo** en
iskoficial.com (GitHub Actions → Vercel). El archivo que lo hace es
`.github/workflows/publicar.yml` y usa el secreto `VERCEL_TOKEN` del repositorio.

Si alguna vez quieres publicar a mano: GitHub → pestaña **Actions** → *Publicar en Vercel* →
**Run workflow**.

---

## ✅ 1. CONTRASEÑA DEL PANEL — PUESTA (19/10/2026)

`ADMIN_PASSWORD` está cargada en Vercel (Production). El panel abre en
**https://iskoficial.com/admin** y pide esa contraseña. La sesión dura 8 horas.

Para cambiarla: Vercel → isk-store → Settings → Environment Variables → `ADMIN_PASSWORD` →
Edit → Save, y vuelve a publicar (Actions → Run workflow).

---

## ✅ 2. GUARDAR LOS PEDIDOS — RESUELTO (19/10/2026)

Se creó el almacén **isk-tienda** (Vercel Blob, privado) y está conectado al proyecto. Los
pedidos y el stock ya se guardan de verdad: no se borran cuando el servidor reinicia.

Es privado a propósito: dentro van nombres, celulares y DNI de clientes, así que solo se lee
con el token del servidor, nunca por una URL pública.

---

## ✅ 3. NÚMERO DE PAGO — YA NO VIVE EN LA WEB (19/10/2026)

Por seguridad, **la web no muestra ningún número de pago**. Si alguien lograra tocar la página,
no hay número que cambiar: no podrían desviar ni un sol.

Cómo funciona ahora: el cliente elige color y tallas, toca **ENVIAR PEDIDO POR WHATSAPP** y te
llega el pedido escrito con su código (ej. `ISK-4KQ9`). Tú le respondes por el chat con los datos
de pago, él te manda la captura y tú cierras la venta en `/admin` con **CONFIRMAR VENTA**.

---

## ✅ 4. INVENTARIO — CARGADO (19/10/2026)

Quedó el stock real que pasaste: **72 pares** (36 blancas + 36 negras).

| Talla | Blancas | Negras |
|---|---|---|
| 36 | 3 | 3 |
| 37 | 4 | 3 |
| 38 | 3 | 3 |
| 39 | 3 | 3 |
| 40 | 4 | 4 |
| 41 | 6 | 5 |
| 42 | 7 | 6 |
| 43 | 5 | 7 |
| 44 | 1 | 2 |

Está escrito en el código como stock de arranque, así que la web ya sale con esos números. Cada
pedido descuenta en el acto y, si el cliente no paga en 15 minutos, los pares vuelven solos.
Cuando una talla llega a 0 sale tachada y no se puede pedir. Para corregir cantidades: `/admin`
→ **INVENTARIO** (tiene − y + y los atajos TODAS EN 1 / 2 / 0 / SIN CONTROL).

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

## ✅ 6. PUBLICACIÓN AUTOMÁTICA — RESUELTA POR OTRO CAMINO (19/10/2026)

No se pudo enlazar Vercel con GitHub porque son cuentas distintas: la tienda vive en la cuenta
de Vercel **ISK OFFICIAL** (que tiene conectado el GitHub `iskoficial5-sudo`), y el código está
en el GitHub `jerryguanipa-blip`, que ya está enlazado a tu otra cuenta de Vercel. GitHub solo
se deja enlazar a una cuenta de Vercel a la vez.

La solución fue publicar con **GitHub Actions** usando un token de Vercel: el resultado es el
mismo (cada push publica solo) y no hubo que mover cuentas ni repositorios de sitio.

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
