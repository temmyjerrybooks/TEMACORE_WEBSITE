import type { Metadata } from "next";
import {
  ApplicationDevelopmentSection,
  CTASection,
  HomeHero,
  HowItWorksSection,
  IndustriesPreview,
  OperationsSection,
  ServicesOverview,
  TrustBar,
  WhyChooseUsSection
} from "@/components/sections/home-sections";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Temacore | BPO, Remote Teams, Support, and Business Technology",
  description: site.description
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustBar />
      <ServicesOverview />
      <OperationsSection />
      <ApplicationDevelopmentSection />
      <IndustriesPreview />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <CTASection />
    </>
  );
}
