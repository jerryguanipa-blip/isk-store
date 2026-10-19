"use client";

import { usePathname } from "next/navigation";

/** El panel de administración no lleva header, footer, audio ni botón flotante. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
