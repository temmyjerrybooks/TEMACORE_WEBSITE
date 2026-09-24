import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePageTemplate } from "@/components/templates/service-page-template";
import { getServiceBySlug, services } from "@/lib/data";
import { routes } from "@/lib/navigation";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo-schema";

type ServiceRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug
  }));
}

export async function generateMetadata({ params }: ServiceRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service"
    };
  }

  return buildMetadata({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.summary,
    path: `${routes.services}/${service.slug}`
  });
}

export default async function ServiceDetailPage({ params }: ServiceRouteProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const faq = faqSchema(service);
  const jsonLd = [
    serviceSchema(service),
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl(routes.home) },
      { name: "Services", url: absoluteUrl(routes.services) },
      { name: service.title, url: absoluteUrl(`${routes.services}/${service.slug}`) }
    ]),
    ...(faq ? [faq] : [])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ServicePageTemplate service={service} />
    </>
  );
}
