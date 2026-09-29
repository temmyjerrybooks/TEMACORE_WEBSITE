import { services, site } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { routes } from "@/lib/navigation";

export function GET() {
  const serviceLinks = services
    .map((service) => `- ${service.title}: ${absoluteUrl(`${routes.services}/${service.slug}`)}`)
    .join("\n");

  const body = `# Temacore

${site.description}

## What Temacore Builds

Temacore builds vertical AI, enterprise software, and intelligent workflow infrastructure. Its strongest current product base is insurance, including separate Life and General Insurance platforms. Financial operations and intelligent business operations are adjacent applications.

## What Temacore AI Is

Temacore AI is the shared intelligence layer in development across enterprise products and workflows. It brings document intelligence, knowledge retrieval, workflow orchestration, and decision support into structured processes, with human review, permissions, and traceability. AI cannot effectively automate a process that has not first been understood and structured. Candidate capabilities require implementation-specific validation.

## Industries and Supporting Operations

- Insurance: developed Life and General Insurance software platforms support structured records, documents, and operational workflows.
- Financial operations / FinTech: strategic applications include document-heavy financial administration and review; no production financial product deployment is implied.
- Intelligent business operations: reusable enterprise workflow architecture applies to complex business processes.
- Managed operations and BPO: supporting commercial execution, a deployment environment, and practical workflow knowledge that informs software and AI development.

## Capability Status

Existing offerings include managed operations, enterprise software services, and developed Life and General Insurance platforms. Live capabilities must be confirmed for the specific implementation. AI workflow intelligence is in development; candidate use cases are not claims of production deployment. Future opportunities include broader FinTech applications and reuse across adjacent industries, with human review, traceability, role-based controls, and regulated approvals retained by authorized people.

## Core Service Categories

- Business Process Outsourcing
- Remote operations teams
- Customer support outsourcing
- Virtual assistant services
- Back-office operations
- Lead generation and appointment setting
- CRM administration and CRM development
- E-commerce support
- Custom web and mobile application development
- Client portal development
- Workflow and business process automation
- Data analytics and reporting dashboards
- SaaS product development
- Technology consulting

## Important Links

- Home: ${absoluteUrl(routes.home)}
- About: ${absoluteUrl(routes.about)}
- Services: ${absoluteUrl(routes.services)}
${serviceLinks}
- Platforms: ${absoluteUrl(routes.platforms)}
- AI Workflow Intelligence: ${absoluteUrl(routes.ai)}
- Insurance Technology: ${absoluteUrl(routes.insurtech)}
- Connected Operations Intelligence Whitepaper: ${absoluteUrl(routes.whitepaper)}
- Founder: ${absoluteUrl(routes.founder)}
- Industries: ${absoluteUrl(routes.industries)}
- Venture: ${absoluteUrl(routes.venture)}
- How It Works: ${absoluteUrl(routes.howItWorks)}
- Technology: ${absoluteUrl(routes.technology)}
- Project Request: ${absoluteUrl(routes.projectRequest)}
- Contact: ${absoluteUrl(routes.contact)}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
