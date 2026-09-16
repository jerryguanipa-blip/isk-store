"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { IskMark } from "@/components/brand/IskMark";
import { siteConfig } from "@/config/site";
import { cartCount, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/client-hooks";
import { cn } from "@/lib/format";

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[90] border-b transition-colors duration-500",
          scrolled || menuOpen
            ? "border-white/10 bg-black/90 backdrop-blur-md"
            : "border-transparent bg-gradient-to-b from-black/70 to-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1800px] items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-10">
          {/* Izquierda: navegación en escritorio */}
          <nav className="hidden flex-1 items-center gap-8 md:flex" aria-label="Principal">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "ui-label text-[11px] text-white/70 transition-colors hover:text-white",
                  pathname === link.href && "text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex flex-1 items-center md:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>

          {/* Centro: logo */}
          <Link
            href="/"
            className="flex items-center gap-3 px-2"
            aria-label={`${siteConfig.name} — inicio`}
          >
            <IskMark className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="ui-label hidden text-[13px] tracking-[0.35em] sm:inline">
              {siteConfig.name}
            </span>
          </Link>

          {/* Derecha: carrito */}
          <div className="flex flex-1 items-center justify-end gap-6">
            <Link
              href="/shop"
              className="ui-label hidden text-[11px] text-white/70 transition-colors hover:text-white lg:inline"
            >
              COMPRAR
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="ui-label flex items-center gap-2 text-[11px] transition-opacity hover:opacity-70"
              aria-label={
                hydrated && count > 0
                  ? `Abrir carrito, ${count} artículos`
                  : "Abrir carrito"
              }
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
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
            className="fixed inset-0 z-[95] bg-black md:hidden"
          >
            <div className="flex h-14 items-center justify-between px-4">
              <button type="button" onClick={closeMenu} aria-label="Cerrar menú">
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <IskMark className="h-7 w-7" />
              <span className="w-5" />
            </div>

            <nav className="flex flex-col px-6 pt-10" aria-label="Menú móvil">
              {siteConfig.navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="display block border-b border-white/10 py-6 text-4xl"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Link
                  href="/cart"
                  onClick={closeMenu}
                  className="display block border-b border-white/10 py-6 text-4xl"
                >
                  CARRITO
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="eyebrow mt-12 text-white/40"
              >
                {siteConfig.tagline}
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
