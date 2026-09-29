import type { Metadata } from "next";
import { site } from "@/lib/data";

export const defaultSeoDescription = site.description;

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
  absoluteTitle?: boolean;
  description?: string;
  path?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  noIndex?: boolean;
  noArchive?: boolean;
};

export function buildMetadata({
  title,
  absoluteTitle = false,
  description = defaultSeoDescription,
  path = "/",
  image = "/logo.png",
  imageWidth = 1024,
  imageHeight = 1024,
  imageAlt = "TEMACORE logo",
  noIndex = false,
  noArchive = false
}: SeoMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
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
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt
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
      follow: !noIndex,
      noarchive: noArchive
    }
  };
}
