# Cómo conectar iskoficial.com a la nueva web (GoDaddy)

Tiempo: 10 minutos. No hace falta saber de programación.

---

## ⚠️ ANTES DE EMPEZAR — LÉELO

Revisé tu dominio hoy (16/09/2026) y **iskoficial.com ahora apunta a una tienda de Shopify**:

| Registro | Valor actual | Qué es |
|---|---|---|
| `A` de `@` | `23.227.38.32` | Servidor de **Shopify** |
| `CNAME` de `www` | `shops.myshopify.com` | **Shopify** |

**Cuando hagas los cambios de abajo, iskoficial.com dejará de mostrar Shopify y mostrará
la web nueva.** Si todavía vendes por Shopify o tienes un plan pagado ahí, decide primero
qué hacer con esa tienda (pausarla o cancelarla) para no pagar por algo que ya no se ve.

Si prefieres probar la web nueva antes de cambiar nada, ya está en vivo aquí:
**https://isk-store.vercel.app**

---

## Paso 1 — Entrar a los DNS

1. Entra a **https://dcc.godaddy.com/control/portfolio** con tu cuenta de GoDaddy.
2. Haz clic en **iskoficial.com**.
3. Ve a la pestaña **DNS** (o botón **"Administrar DNS"**).

Verás una tabla con registros. Solo vamos a tocar **dos filas**.

---

## Paso 2 — Cambiar el registro `A` (el dominio sin www)

1. Busca la fila con **Tipo `A`** y **Nombre `@`**. Hoy dice `23.227.38.32`.
2. Haz clic en el lápiz ✏️ (editar).
3. Deja así:

   | Campo | Valor |
   |---|---|
   | Tipo | `A` |
   | Nombre | `@` |
   | Valor | `76.76.21.21` |
   | TTL | `600 segundos` (o "Personalizado: 600") |

4. **Guardar**.

> Si hay **más de una** fila `A` con nombre `@`, borra las otras. Tiene que quedar
> **solo una**, la de `76.76.21.21`.

---

## Paso 3 — Cambiar el registro `CNAME` de `www`

1. Busca la fila con **Tipo `CNAME`** y **Nombre `www`**. Hoy dice `shops.myshopify.com`.
2. Haz clic en el lápiz ✏️.
3. Deja así:

   | Campo | Valor |
   |---|---|
   | Tipo | `CNAME` |
   | Nombre | `www` |
   | Valor | `cname.vercel-dns.com` |
   | TTL | `600 segundos` |

4. **Guardar**.

---

## Paso 4 — NO toques lo demás

- **No cambies los "Nameservers"** (deben seguir siendo los de GoDaddy: `ns01/ns02.domaincontrol.com`).
- **No borres** registros `MX` ni `TXT`: son los del correo y verificaciones.
- **No actives** "Reenvío de dominio" (Forwarding) en GoDaddy.

---

## Paso 5 — Esperar y comprobar

- Normalmente funciona en **10 a 30 minutos**. A veces tarda hasta **48 horas**.
- Vercel crea el candado 🔒 (HTTPS) solo, apenas detecta el cambio.
- Vercel te manda un correo cuando el dominio queda verificado.

Para comprobar, abre en el navegador:

- https://iskoficial.com
- https://www.iskoficial.com

Si ves el logo ISK y la intro, **listo** ✅.

Desde la terminal también puedes revisarlo (en `D:\isk-store`):

```bash
vercel domains inspect iskoficial.com
```

Cuando esté bien, ya no aparecerá el mensaje "WARNING! This Domain is not configured properly".

---

## Resumen en una línea

| Tipo | Nombre | Valor |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

---

### ¿Algo salió mal?

- **"Sitio no seguro" o error de certificado:** espera 30 minutos más; Vercel todavía está
  generando el certificado.
- **Sigue apareciendo Shopify:** el cambio aún no se propagó, o quedó otro registro `A`
  viejo. Revisa el Paso 2.
- **Para volver atrás** (a Shopify): pon de nuevo `A @ → 23.227.38.32` y
  `CNAME www → shops.myshopify.com`.
