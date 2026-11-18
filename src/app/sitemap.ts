import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://egyptian-discovery-v1-0.vercel.app";
  return ["/", "/destinations", "/trips", "/shop", "/about", "/contact", "/account"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
