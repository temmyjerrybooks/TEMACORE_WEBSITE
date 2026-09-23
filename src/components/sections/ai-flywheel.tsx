import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { aiFlywheel } from "@/lib/ai-direction";

export function AiFlywheel() {
  return (
    <section className="bg-paper py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="The Temacore AI flywheel"
          title="From operating knowledge to reusable intelligence."
          body="Our development model connects real work, enterprise software, and evolving AI. Each validated workflow can inform the next application of the architecture."
          align="center"
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {aiFlywheel.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-line bg-white p-5">
              <span className="text-sm font-black text-blue001">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-lg font-black text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
