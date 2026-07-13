import type { Service } from "@/lib/data";
import { getServiceFaqs, site } from "@/lib/data";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { routes } from "@/lib/navigation";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Temacore",
    url: getSiteUrl(),
    logo: absoluteUrl("/logo.png"),
    email: site.email,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "2709 N Hayden Island Dr STE 115066",
      addressLocality: "Portland",
      addressRegion: "OR",
      postalCode: "97217",
      addressCountry: "US"
    }
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Temacore",
    url: getSiteUrl(),
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: "Temacore"
    }
  };
}

export function webPageSchema({
  name,
  description,
  path
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: site.name,
      url: getSiteUrl()
    },
    about: {
      "@type": "Organization",
      name: site.name,
      url: getSiteUrl()
    }
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    url: absoluteUrl(`${routes.services}/${service.slug}`),
    description: service.summary,
    provider: {
      "@type": "Organization",
      name: "Temacore",
      url: getSiteUrl()
    },
    areaServed: ["North America", "United Kingdom", "Europe"]
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function whitepaperSchema({
  headline,
  description,
  path,
  coverImage,
  pdfUrl
}: {
  headline: string;
  description: string;
  path: string;
  coverImage: string;
  pdfUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(path)
    },
    image: absoluteUrl(coverImage),
    datePublished: "2026-07",
    version: "1.0",
    publisher: {
      "@type": "Organization",
      name: "Temacore LLC",
      url: getSiteUrl(),
      logo: absoluteUrl("/logo.png")
    },
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: absoluteUrl(pdfUrl),
      encodingFormat: "application/pdf"
    }
  };
}

export function faqSchema(service: Service) {
  const faqs = getServiceFaqs(service.slug);

  if (faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function contactPointSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Temacore",
    url: getSiteUrl(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: site.email,
        contactType: "customer support",
        areaServed: ["North America", "United Kingdom", "Europe"],
        availableLanguage: ["English"]
      }
    ]
  };
}
