import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function CapabilityStatus() {
  return (
    <section className="bg-paper py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Capability status"
          title="Existing foundations, developing intelligence, future opportunities."
          body="Availability is confirmed against the specific product and implementation before an engagement is agreed."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Existing products and services",
              body: "Temacore provides managed operations and enterprise software services and has developed Life and General Insurance platforms. Live product capabilities, integrations, and controls are confirmed for each deployment."
            },
            {
              title: "AI in development",
              body: "A shared AI workflow intelligence layer is being developed for reviewable assistance. Document processing, routing, knowledge retrieval, and operational recommendations are candidate capabilities; this does not imply that each is production-live."
            },
            {
              title: "Future roadmap",
              body: "The direction is to expand validated AI patterns into FinTech and adjacent industries, and automate more repetitive work. Scope and timing depend on validation, data readiness, and human controls; regulated approvals remain with authorized people."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-black text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
