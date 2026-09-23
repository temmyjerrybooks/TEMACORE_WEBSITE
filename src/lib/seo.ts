import type { Metadata } from "next";
import { site } from "@/lib/data";

export const defaultSeoDescription =
  "Temacore is an AI-first technology company building vertical AI, enterprise software, and intelligent workflow infrastructure for insurance, finance, and business operations.";

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
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  noIndex?: boolean;
  noArchive?: boolean;
};

export function buildMetadata({
  title,
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
