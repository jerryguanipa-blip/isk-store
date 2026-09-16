import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/shop", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/envios", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/cambios", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/terminos", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/libro-de-reclamaciones", priority: 0.4, changeFrequency: "yearly" as const },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.95,
    })),
  ];
}
