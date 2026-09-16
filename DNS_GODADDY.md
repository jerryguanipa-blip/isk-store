# Conectar iskoficial.com a la web (GoDaddy → Vercel)

**Estado al 16/09/2026:** la web está terminada y publicada. Solo falta este paso, que
requiere entrar a la cuenta de GoDaddy **dueña de iskoficial.com**.

---

## ⚠️ 1. La cuenta correcta de GoDaddy

- iskoficial.com está registrado en **GoDaddy** (desde el 03/09/2025, vence el 03/09/2027).
- **No está en la cuenta que estaba abierta en Chrome** (la de "JERRY ALEXANDER", que tiene
  jagofy.com, jeryale.com, mrairforce1.com, nibosi1985.com y valleydreams.pe).
- Está en **otra cuenta de GoDaddy**, probablemente la creada con el correo de ISK
  (la cuenta de Vercel de la tienda se llama `iskoficial5`).

Entra a GoDaddy con esa otra cuenta. Si no recuerdas cuál es, en https://sso.godaddy.com
usa "¿Olvidaste tu usuario?" con los correos que uses para ISK.

> No se tocó nada en la cuenta de JERRY ALEXANDER. Tampoco se usó mrairforce1.com: no hay
> confirmación de que ese sea el dominio de esta tienda.

---

## 2. Qué hay hoy en los DNS de iskoficial.com (revisado)

| Tipo | Nombre | Valor actual | Qué es | ¿Se toca? |
|---|---|---|---|---|
| `A` | `@` | `23.227.38.32` | Tienda de **Shopify** | ✅ **Sí, se cambia** |
| `CNAME` | `www` | `shops.myshopify.com` | Tienda de **Shopify** | ✅ **Sí, se cambia** |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; …` | Protección de correo | ❌ **No tocar** |
| `NS` | `@` | `ns01` / `ns02.domaincontrol.com` | Servidores de GoDaddy | ❌ **No tocar** |
| `MX` | `@` | *(no hay)* | Hoy no hay correo en el dominio | — |

Al cambiar las dos primeras filas, iskoficial.com deja de mostrar Shopify y muestra la
tienda nueva. No afecta ningún correo (no hay MX).

---

## 3. Los 2 cambios exactos

En GoDaddy → **Dominios → iskoficial.com → DNS → Registros DNS**:

**Cambio 1 — editar el registro `A` de `@`**

| Campo | Valor |
|---|---|
| Tipo | `A` |
| Nombre | `@` |
| Valor | `76.76.21.21` |
| TTL | `600 segundos` |

Si hubiera **otro** registro `A` con nombre `@`, bórralo: debe quedar solo `76.76.21.21`.

**Cambio 2 — editar el registro `CNAME` de `www`**

| Campo | Valor |
|---|---|
| Tipo | `CNAME` |
| Nombre | `www` |
| Valor | `cname.vercel-dns.com` |
| TTL | `600 segundos` |

**No toques:** nameservers, `_dmarc` ni ningún otro registro. No actives "Reenvío" (Forwarding).

---

## 4. Lo que ya está listo del lado de la web

- `iskoficial.com` y `www.iskoficial.com` **ya están agregados** al proyecto en Vercel.
- **Una sola URL oficial:** `https://iskoficial.com`. `www.iskoficial.com` redirige (301)
  al dominio sin www (configurado en el código).
- Canonical, Open Graph y sitemap ya apuntan a `https://iskoficial.com`.
- Las URLs `*.vercel.app` ya envían `noindex`, para que Google no las muestre.
- HTTPS: Vercel crea el certificado **solo**, minutos después de que los DNS apunten.

---

## 5. Después de cambiar los DNS (10–30 min, a veces hasta 48 h)

Comprueba en el navegador:

- https://iskoficial.com → debe verse la tienda con el candado 🔒
- https://www.iskoficial.com → debe saltar a https://iskoficial.com

O desde la terminal, en `D:\isk-store`:

```bash
vercel domains inspect iskoficial.com
```

Cuando ya no diga "WARNING! This Domain is not configured properly", **activa el paso final**
para que la dirección `isk-store.vercel.app` también mande a los clientes al dominio propio:

```bash
vercel env add REDIRECT_VERCEL_TO_DOMAIN production
```

Cuando pida el valor, escribe `1`. Luego:

```bash
vercel --prod --yes
```

> ⚠️ No actives ese paso antes de que iskoficial.com funcione: dejaría la web inaccesible.

---

### Para volver atrás (a Shopify)

`A @ → 23.227.38.32` y `CNAME www → shops.myshopify.com`.
