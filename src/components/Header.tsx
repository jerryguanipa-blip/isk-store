"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { IskMark } from "@/components/brand/IskMark";
import { Marquee } from "@/components/Marquee";
import { siteConfig } from "@/config/site";
import { cartCount, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/client-hooks";
import { cn } from "@/lib/format";
import { buildLandingMessage, whatsappUrl } from "@/lib/checkout";

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = cartCount(items);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Barra de anuncio */}
      <div className="bg-surface pt-[env(safe-area-inset-top)] text-ink">
        <Marquee text={siteConfig.tagline} className="ui-label py-2 text-xs" />
      </div>

      {/* Barra principal */}
      <header className="sticky top-0 z-[90] border-b border-line bg-paper">
        <div className="mx-auto grid h-14 max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-16 sm:px-6 lg:px-10">
          {/* Izquierda: menú */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 flex h-11 w-11 items-center justify-center md:hidden"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </button>

            <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "ui-label border-b border-transparent py-1 text-[13px] transition-colors hover:border-ink",
                    pathname === link.href && "border-ink",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Centro: logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 px-2"
            aria-label={`${siteConfig.name} — inicio`}
          >
            <IskMark tone="dark" className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="ui-label hidden text-[13px] tracking-[0.2em] sm:inline">
              {siteConfig.name}
            </span>
          </Link>

          {/* Derecha: carrito */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={openCart}
              className="ui-label -mr-2 flex h-11 items-center gap-2 px-2 text-[13px] transition-opacity hover:opacity-70"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">Carrito</span>
              <span className="tabular-nums">({hydrated ? count : 0})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[95] bg-paper pt-[env(safe-area-inset-top)] text-ink md:hidden"
          >
            <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center border-b border-line px-4">
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Cerrar menú"
                className="-ml-2 flex h-11 w-11 items-center justify-center"
              >
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <IskMark tone="dark" className="h-8 w-8" />
              <span />
            </div>

            <nav className="flex flex-col px-4" aria-label="Menú móvil">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="ui-label block border-b border-line py-5 text-[15px]"
                >
                  {link.label}
                </Link>
              ))}

              <a
                href={whatsappUrl(buildLandingMessage())}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="ui-label block border-b border-line py-5 text-[15px]"
              >
                COMPRAR VÍA WHATSAPP
              </a>

              <p className="eyebrow mt-10 text-muted">{siteConfig.tagline}</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
