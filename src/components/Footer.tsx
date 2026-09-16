import Link from "next/link";
import { IskMark } from "@/components/brand/IskMark";
import { siteConfig } from "@/config/site";

const socials = [
  { href: siteConfig.social.instagram, label: "INSTAGRAM" },
  { href: siteConfig.social.tiktok, label: "TIKTOK" },
  { href: siteConfig.social.facebook, label: "FACEBOOK" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-[1800px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <IskMark className="h-16 w-16" />
            <p className="eyebrow mt-6 text-white/50">{siteConfig.tagline}</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              Nike Air Force 1 &apos;07 originales en Perú. Dos colores, nueve tallas,
              un solo precio.
            </p>
          </div>

          {/* Tienda */}
          <nav aria-label="Tienda">
            <h2 className="eyebrow text-white/55">TIENDA</h2>
            <ul className="mt-6 space-y-3">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="ui-label text-[11px] text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="eyebrow mt-10 text-white/55">SÍGUENOS</h2>
            <ul className="mt-6 space-y-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-label text-[11px] text-white/70 transition-colors hover:text-white"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Información legal">
            <h2 className="eyebrow text-white/55">INFORMACIÓN</h2>
            <ul className="mt-6 space-y-3">
              {siteConfig.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="ui-label text-[11px] text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/libro-de-reclamaciones"
              className="mt-8 inline-flex items-center border border-white/25 px-4 py-3 transition-colors hover:border-white"
              aria-label="Libro de Reclamaciones virtual"
            >
              <span className="ui-label text-[10px]">📗 LIBRO DE RECLAMACIONES</span>
            </Link>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} {siteConfig.name}. {siteConfig.domain}
          </p>
          <p className="text-xs text-white/55">
            Hecho en Perú · Precios en soles (PEN)
          </p>
        </div>
      </div>
    </footer>
  );
}
