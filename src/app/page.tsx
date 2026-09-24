import { AiFlywheel } from "@/components/sections/ai-flywheel";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ApplicationDevelopmentSection,
  CTASection,
  EcosystemSection,
  HomeHero,
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
  title: "TEMACORE | AI, InsurTech, FinTech & Intelligent Operations",
  description: site.description,
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <HomeHero />
      <TrustBar />
      <EcosystemSection />
      <ServicesOverview />
      <OperationsSection />
      <ApplicationDevelopmentSection />
      <IndustriesPreview />
      <AiFlywheel />
      <WhyChooseUsSection />
      <CTASection />
    </>
  );
}
