import Link from "next/link";
import { IskMark } from "@/components/brand/IskMark";
import { siteConfig } from "@/config/site";
import { buildLandingMessage, whatsappUrl } from "@/lib/checkout";

const socials = [
  { href: siteConfig.social.instagram, label: "INSTAGRAM" },
  { href: siteConfig.social.tiktok, label: "TIKTOK" },
  // "Facebook" abre directamente el WhatsApp oficial de la tienda
  { href: whatsappUrl(buildLandingMessage()), label: "FACEBOOK" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1800px] px-4 pt-14 pb-24 sm:px-6 lg:px-10 lg:pt-16 lg:pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <IskMark className="h-12 w-12" />
            <p className="eyebrow mt-5 text-white/70">{siteConfig.tagline}</p>
            <p className="mt-3 max-w-xs text-sm text-white/70">
              Nike Air Force 1 &apos;07 clásicas en Perú. Dos colores, nueve tallas,
              un solo precio.
            </p>
          </div>

          {/* Tienda */}
          <nav aria-label="Tienda">
            <h2 className="eyebrow text-white/70">TIENDA</h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="isk-sentence inline-block text-sm text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Redes sociales">
            <h2 className="eyebrow text-white/70">SÍGUENOS</h2>
            <ul className="mt-4 space-y-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="isk-sentence inline-block text-sm text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Información legal">
            <h2 className="eyebrow text-white/70">INFORMACIÓN</h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.legalLinks
                .filter((link) => link.href !== "/libro-de-reclamaciones")
                .map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="isk-sentence inline-block text-sm text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/libro-de-reclamaciones"
              className="mt-5 inline-flex min-h-11 items-center border border-white/40 px-4 text-sm transition-colors hover:border-white"
              aria-label="Libro de Reclamaciones virtual"
            >
              <span className="isk-sentence">LIBRO DE RECLAMACIONES</span>
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="text-xs text-white/70">
            © 2026 ISK Oficial. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
