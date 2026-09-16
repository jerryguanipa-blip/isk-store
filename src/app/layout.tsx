import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { BrandAudio } from "@/components/BrandAudio";
import { CustomCursor } from "@/components/CustomCursor";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-PE" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-dvh bg-black text-white">
        <a
          href="#contenido"
          className="sr-only-focusable ui-label fixed top-4 left-4 z-[200] bg-white px-4 py-3 text-xs text-black"
        >
          Saltar al contenido
        </a>

        <BrandAudio />
        <CustomCursor />

        <div className="flex min-h-dvh flex-col">
          <Header />
          <main id="contenido" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>

        <CartDrawer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
