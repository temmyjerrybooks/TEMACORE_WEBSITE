import { services } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { routes } from "@/lib/navigation";

export function GET() {
  const serviceLinks = services
    .map((service) => `- ${service.title}: ${absoluteUrl(`${routes.services}/${service.slug}`)}`)
    .join("\n");

  const body = `# Temacore

Temacore is a US-registered global operations and technology solutions company helping businesses in North America, the UK, and Europe build reliable remote operations teams and custom business applications through a managed BPO and technology delivery model.

## Who Temacore Serves

Temacore supports businesses that need reliable operational capacity, customer support workflows, back-office execution, CRM administration, business automation, and custom business software.

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
- Industries: ${absoluteUrl(routes.industries)}
- How It Works: ${absoluteUrl(routes.howItWorks)}
- Technology: ${absoluteUrl(routes.technology)}
- Contact: ${absoluteUrl(routes.contact)}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
