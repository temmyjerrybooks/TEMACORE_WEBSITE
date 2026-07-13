import type { MetadataRoute } from "next";
import { services } from "@/lib/data";
import { routes } from "@/lib/navigation";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticRoutes = [
    routes.home,
    routes.about,
    routes.services,
    routes.platforms,
    routes.ai,
    routes.insurtech,
    routes.whitepaper,
    routes.founder,
    routes.industries,
    routes.venture,
    routes.howItWorks,
    routes.technology,
    routes.careers,
    routes.clientIntake,
    routes.projectRequest,
    routes.contact
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date()
    })),
    ...services.map((service) => ({
      url: `${base}${routes.services}/${service.slug}`,
      lastModified: new Date()
    }))
  ];
}
