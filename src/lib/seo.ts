import type { Metadata } from "next";
import { site } from "@/lib/data";

export const defaultSeoDescription =
  "Temacore combines managed operations, custom business applications, insurance technology platforms, and AI-assisted workflow intelligence for organizations building smarter service delivery.";

export function getSiteUrl() {
  const configuredUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? site.domain).replace(/\/$/, "");

  if (configuredUrl === "https://temacore.com") {
    return "https://www.temacore.com";
  }

  return configuredUrl;
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getSiteUrl()}${normalizedPath}`;
}

type SeoMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description = defaultSeoDescription,
  path = "/",
  image = "/logo.png",
  noIndex = false
}: SeoMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      images: [
        {
          url: imageUrl,
          width: 1024,
          height: 1024,
          alt: "TEMACORE logo"
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    },
    robots: {
      index: !noIndex,
      follow: !noIndex
    }
  };
}
