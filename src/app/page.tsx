import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ApplicationDevelopmentSection,
  CTASection,
  EcosystemSection,
  HomeHero,
  HowItWorksSection,
  IndustriesPreview,
  OperationsSection,
  ServicesOverview,
  TrustBar,
  WhyChooseUsSection
} from "@/components/sections/home-sections";
import { site } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/seo-schema";

export const metadata: Metadata = buildMetadata({
  title: "Temacore | BPO, Remote Teams, Support, and Business Technology",
  description: site.description,
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <HomeHero />
      <TrustBar />
      <ServicesOverview />
      <EcosystemSection />
      <OperationsSection />
      <ApplicationDevelopmentSection />
      <IndustriesPreview />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <CTASection />
    </>
  );
}
