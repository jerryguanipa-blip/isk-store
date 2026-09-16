import Link from "next/link";
import { siteConfig } from "@/config/site";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
};

export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-[1800px] px-4 pt-28 pb-24 sm:px-6 lg:px-10 lg:pt-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <header className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-white/40">{eyebrow}</p>
          <h1 className="display mt-5 text-4xl leading-[0.95] sm:text-5xl">{title}</h1>
          <p className="mt-6 text-xs text-white/35">Última actualización: {updated}</p>

          <nav aria-label="Otras páginas legales" className="mt-10 space-y-3">
            {siteConfig.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="ui-label block text-[10px] text-white/50 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="legal-body max-w-2xl space-y-6 text-sm leading-relaxed text-white/60">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Título de sección dentro de una página legal. */
export function LegalHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="ui-label pt-6 text-xs text-white first:pt-0">{children}</h2>
  );
}

/** Lista con viñetas coherente con el resto de la web. */
export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="text-white/25">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
