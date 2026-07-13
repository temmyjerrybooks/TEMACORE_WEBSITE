import { services } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { routes } from "@/lib/navigation";

export function GET() {
  const serviceLinks = services
    .map((service) => `- ${service.title}: ${absoluteUrl(`${routes.services}/${service.slug}`)}`)
    .join("\n");

  const body = `# Temacore

Temacore is a US-registered global operations and technology solutions company helping businesses in North America, the UK, and Europe build reliable remote operations teams and custom business applications through a managed BPO and technology delivery model.

Temacore combines managed operations, custom business applications, insurance technology platforms, and AI-assisted workflow intelligence within one connected ecosystem. Temacore builds the operational, software, insurance, and intelligence infrastructure businesses need to deliver services more efficiently.

## Who Temacore Serves

Temacore supports businesses that need reliable operational capacity, customer support workflows, back-office execution, CRM administration, business automation, and custom business software.

## Platform Ecosystem

- Managed operations: business process outsourcing, remote operations teams, customer support, back-office operations, virtual assistance, CRM administration, and lead follow-up.
- Custom business applications: web and mobile applications, CRM systems, client portals, internal dashboards, workflow automation, and reporting systems.
- Insurance technology: Temacore has developed life insurance and general insurance technology platforms designed to support digital workflows, records, document handling, role-based operations, reporting, and visibility.
- AI workflow intelligence: Temacore is building AI-assisted, human-in-the-loop workflow intelligence designed to provide decision support, operational recommendations, and reviewable assistance. It is not presented as making final regulated decisions.

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
