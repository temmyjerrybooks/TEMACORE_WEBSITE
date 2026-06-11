import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"]
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin"]
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin"]
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/admin"]
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin"]
      },
      {
        userAgent: "Claude-User",
        allow: "/",
        disallow: ["/admin"]
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: ["/admin"]
      }
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`
  };
}
