import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/account"] }, sitemap: "https://egyptian-discovery-v1-0.vercel.app/sitemap.xml" };
}
