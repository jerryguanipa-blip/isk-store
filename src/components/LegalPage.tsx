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
    <div className="mx-auto max-w-[1800px] px-4 pt-10 pb-20 sm:px-6 lg:px-10 lg:pt-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h1 className="display mt-3 text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-6 text-xs text-muted">Última actualización: {updated}</p>

          <nav aria-label="Otras páginas legales" className="mt-10 space-y-3">
            {siteConfig.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="ui-label block text-xs text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="legal-body max-w-2xl space-y-6 text-sm leading-relaxed text-muted">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Título de sección dentro de una página legal. */
export function LegalHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="ui-label pt-6 text-xs text-ink first:pt-0">{children}</h2>
  );
}

/** Lista con viñetas coherente con el resto de la web. */
export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="text-muted">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
