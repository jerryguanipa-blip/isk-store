import type { NextConfig } from "next";

/** Dominio público de la tienda (sin barra final). */
const CANONICAL_HOST = "iskoficial.com";

/**
 * Cuando el dominio propio ya responde, poner REDIRECT_VERCEL_TO_DOMAIN=1 en Vercel
 * para que isk-store.vercel.app redirija (301) a https://iskoficial.com.
 * No se activa por defecto: si los DNS aún no apuntan, la web quedaría inaccesible.
 */
const redirectVercelDomain = process.env.REDIRECT_VERCEL_TO_DOMAIN === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 solo se usa en la portada del hero (prioridad: calidad visual)
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // www → dominio raíz (una sola URL canónica)
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      ...(redirectVercelDomain
        ? [
            {
              source: "/:path*",
              has: [{ type: "host" as const, value: "(?<sub>.+)\.vercel\.app" }],
              destination: `https://${CANONICAL_HOST}/:path*`,
              permanent: true,
            },
          ]
        : []),
    ];
  },
  async headers() {
    return [
      // Las URLs *.vercel.app nunca deben aparecer en Google
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.+)\.vercel\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/brand/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
