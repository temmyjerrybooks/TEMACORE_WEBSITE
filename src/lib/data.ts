import {
  BadgeCheck,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ChartNoAxesColumnIncreasing,
  ClipboardCheck,
  Code2,
  Database,
  FileCheck2,
  Headphones,
  Layers3,
  LineChart,
  LucideIcon,
  Network,
  ShieldCheck,
  UsersRound,
  Workflow,
  Zap
} from "lucide-react";

export const site = {
  name: "Temacore",
  legalDescriptor: "US-registered global operations and technology company",
  email: "info@temacore.com",
  domain: "https://temacore.com/",
  description:
    "Temacore builds remote operations teams, outsourcing systems, customer support workflows, and custom business technology for companies in North America, the UK, and Europe."
};

export type ServiceSlug =
  | "business-process-outsourcing"
  | "remote-teams"
  | "customer-support"
  | "back-office-operations"
  | "custom-application-development"
  | "business-automation";

export type Metric = {
  value: string;
  label: string;
};

export type Service = {
  slug: ServiceSlug;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  metrics: Metric[];
  outcomes: string[];
  capabilities: string[];
  process: {
    title: string;
    body: string;
  }[];
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "business-process-outsourcing",
    title: "Business Process Outsourcing",
    shortTitle: "BPO",
    eyebrow: "Managed operations",
    summary:
      "Run recurring business workflows through trained teams, documented SOPs, QA controls, and clear performance reporting.",
    description:
      "Temacore designs and manages operational workflows for companies that need reliable execution without expanding internal headcount. We combine process documentation, trained offshore and remote operators, supervision, and management visibility.",
    icon: BriefcaseBusiness,
    metrics: [
      { value: "SOP", label: "documented delivery" },
      { value: "QA", label: "review checkpoints" },
      { value: "SLA", label: "tracked execution" }
    ],
    outcomes: [
      "Lower operational overhead without losing control",
      "Cleaner handoffs between sales, support, finance, and admin teams",
      "Consistent task completion across time zones",
      "Performance visibility through weekly reporting"
    ],
    capabilities: [
      "Data entry and records management",
      "Order processing and workflow coordination",
      "Document review and quality assurance",
      "Vendor, client, and internal follow-up",
      "Operational reporting and escalation tracking"
    ],
    process: [
      {
        title: "Map the workflow",
        body: "We document the current process, key risks, handoff points, systems, and service expectations."
      },
      {
        title: "Build the operating model",
        body: "We define roles, SOPs, QA steps, reporting cadence, and escalation paths before launch."
      },
      {
        title: "Deploy and optimize",
        body: "A managed team executes the workflow while Temacore supervisors track quality, speed, and bottlenecks."
      }
    ],
    deliverables: [
      "Workflow map",
      "Standard operating procedures",
      "Team role matrix",
      "Quality checklist",
      "Weekly operations report"
    ]
  },
  {
    slug: "remote-teams",
    title: "Remote Operations Teams",
    shortTitle: "Remote Teams",
    eyebrow: "Extended workforce",
    summary:
      "Build a dedicated remote team for administrative, support, sales, and operations roles with management structure included.",
    description:
      "Temacore helps companies assemble reliable remote teams that operate as an extension of the client organization. We handle role design, candidate screening, onboarding structure, performance tracking, and day-to-day management support.",
    icon: UsersRound,
    metrics: [
      { value: "1-10+", label: "seat team models" },
      { value: "US/EU", label: "coverage ready" },
      { value: "KPI", label: "managed delivery" }
    ],
    outcomes: [
      "Dedicated talent without full internal recruiting overhead",
      "Faster coverage for repetitive and time-sensitive workflows",
      "Clear accountability through role scorecards",
      "Flexible scaling as workload changes"
    ],
    capabilities: [
      "Virtual assistants and executive support",
      "Operations coordinators",
      "CRM and sales support specialists",
      "Customer support agents",
      "Admin and back-office analysts"
    ],
    process: [
      {
        title: "Define the seats",
        body: "We translate workload into roles, coverage hours, required tools, and measurable responsibilities."
      },
      {
        title: "Select and onboard",
        body: "We source, screen, train, and align team members with your systems and communication cadence."
      },
      {
        title: "Manage performance",
        body: "We track quality, throughput, attendance, and client feedback through a consistent operating rhythm."
      }
    ],
    deliverables: [
      "Role profiles",
      "Hiring scorecard",
      "Onboarding checklist",
      "Team operating rhythm",
      "Performance dashboard"
    ]
  },
  {
    slug: "customer-support",
    title: "Customer Support Outsourcing",
    shortTitle: "Customer Support",
    eyebrow: "Client experience",
    summary:
      "Deliver responsive customer support across email, chat, phone, helpdesk, and CRM workflows.",
    description:
      "Temacore builds customer support operations that protect brand trust while reducing response burden on internal teams. We structure coverage, scripts, knowledge bases, QA reviews, and escalation workflows.",
    icon: Headphones,
    metrics: [
      { value: "CX", label: "brand-aligned support" },
      { value: "QA", label: "ticket reviews" },
      { value: "CRM", label: "workflow logging" }
    ],
    outcomes: [
      "Faster first response and cleaner ticket ownership",
      "Consistent tone and escalation standards",
      "Reduced backlog across helpdesk and inboxes",
      "Better customer visibility through structured reporting"
    ],
    capabilities: [
      "Email and chat support",
      "Phone support coordination",
      "Helpdesk ticket triage",
      "CRM updates and customer records",
      "Knowledge base maintenance"
    ],
    process: [
      {
        title: "Audit the support flow",
        body: "We review channels, ticket types, response targets, current scripts, and escalation rules."
      },
      {
        title: "Train support agents",
        body: "Agents learn product context, tone, policies, and decision trees before live customer interaction."
      },
      {
        title: "Measure service quality",
        body: "We monitor response time, resolution quality, customer notes, and unresolved themes."
      }
    ],
    deliverables: [
      "Support playbook",
      "Response templates",
      "Escalation matrix",
      "QA scorecard",
      "Ticket performance report"
    ]
  },
  {
    slug: "back-office-operations",
    title: "Back-Office Operations",
    shortTitle: "Back Office",
    eyebrow: "Operational support",
    summary:
      "Keep admin, records, finance support, scheduling, research, and coordination tasks moving behind the scenes.",
    description:
      "Temacore supports the administrative work that keeps customer-facing teams focused. We create dependable back-office workflows for repetitive, detail-heavy tasks that need accuracy and follow-through.",
    icon: ClipboardCheck,
    metrics: [
      { value: "Admin", label: "workflow coverage" },
      { value: "Data", label: "clean records" },
      { value: "Ops", label: "daily execution" }
    ],
    outcomes: [
      "Cleaner internal records and fewer loose ends",
      "Less time spent on repetitive administrative work",
      "More consistent scheduling and documentation",
      "Reliable coordination across tools and teams"
    ],
    capabilities: [
      "Inbox and calendar support",
      "CRM cleanup and list management",
      "Invoice and document coordination",
      "Research and data collection",
      "Appointment setting support"
    ],
    process: [
      {
        title: "Prioritize tasks",
        body: "We separate recurring, time-sensitive, and high-accuracy work into clear operating lanes."
      },
      {
        title: "Set controls",
        body: "We create checklists, naming conventions, approvals, and audit points to keep work accurate."
      },
      {
        title: "Run the desk",
        body: "A remote operations team completes the work, documents exceptions, and reports daily progress."
      }
    ],
    deliverables: [
      "Back-office task map",
      "Checklist library",
      "Approval rules",
      "Daily work queue",
      "Exception log"
    ]
  },
  {
    slug: "custom-application-development",
    title: "Custom Application Development",
    shortTitle: "Custom Apps",
    eyebrow: "Business software",
    summary:
      "Design and build client portals, CRM systems, workflow dashboards, internal tools, and secure business applications.",
    description:
      "Temacore develops business applications that match the way teams actually operate. We focus on practical systems: portals, CRM workflows, dashboards, approvals, records, reporting, and integrations.",
    icon: Code2,
    metrics: [
      { value: "Portal", label: "client access" },
      { value: "CRM", label: "pipeline systems" },
      { value: "API", label: "integrations" }
    ],
    outcomes: [
      "Centralized data and fewer disconnected spreadsheets",
      "Business tools tailored to real workflows",
      "Cleaner client, team, and management visibility",
      "Scalable foundations for automation and reporting"
    ],
    capabilities: [
      "Client portals",
      "CRM systems",
      "Workflow dashboards",
      "Internal admin tools",
      "API integrations and reporting"
    ],
    process: [
      {
        title: "Discover requirements",
        body: "We capture roles, permissions, data models, user journeys, reporting needs, and integration points."
      },
      {
        title: "Prototype the workflow",
        body: "We create a practical interface model that stakeholders can review before full development."
      },
      {
        title: "Build and release",
        body: "We develop, test, document, and prepare the application for secure deployment and iteration."
      }
    ],
    deliverables: [
      "Requirements brief",
      "Data model",
      "Clickable workflow prototype",
      "Production application",
      "Deployment checklist"
    ]
  },
  {
    slug: "business-automation",
    title: "Business Automation",
    shortTitle: "Automation",
    eyebrow: "Workflow intelligence",
    summary:
      "Automate repetitive tasks, lead follow-up, appointment setting, notifications, reporting, and cross-system workflows.",
    description:
      "Temacore helps teams reduce manual work by connecting tools, creating workflow rules, and building automation around real operating needs. We prioritize reliability, governance, and measurable time savings.",
    icon: Workflow,
    metrics: [
      { value: "Lead", label: "follow-up flows" },
      { value: "Ops", label: "task automation" },
      { value: "BI", label: "reporting loops" }
    ],
    outcomes: [
      "Fewer manual handoffs and missed follow-ups",
      "More consistent lead and appointment workflows",
      "Automated notifications and task routing",
      "Actionable reporting for managers"
    ],
    capabilities: [
      "Lead follow-up automation",
      "Appointment setting workflows",
      "CRM and helpdesk automation",
      "Internal notification systems",
      "Reporting and dashboard automation"
    ],
    process: [
      {
        title: "Find automation value",
        body: "We identify repetitive work, error-prone handoffs, delay points, and places where rules can drive action."
      },
      {
        title: "Design guarded flows",
        body: "We map triggers, conditions, permissions, fallback states, and notification logic."
      },
      {
        title: "Launch and monitor",
        body: "We deploy automations with test cases, reporting, and exception handling for ongoing reliability."
      }
    ],
    deliverables: [
      "Automation opportunity map",
      "Workflow logic diagram",
      "Configured automations",
      "Exception handling rules",
      "Automation performance report"
    ]
  }
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const trustItems = [
  "North America, UK, and Europe focus",
  "Managed remote delivery",
  "Operations and technology together",
  "SOP and SLA-driven execution"
];

export const homeStats: Metric[] = [
  { value: "6", label: "core service lines" },
  { value: "3", label: "market regions supported" },
  { value: "24h", label: "response target for new inquiries" },
  { value: "1", label: "partner for people, process, and systems" }
];

export const industries = [
  {
    title: "Professional Services",
    body: "Admin support, client follow-up, CRM hygiene, reporting, and operating dashboards for advisory and agency teams.",
    icon: Building2
  },
  {
    title: "Technology and SaaS",
    body: "Customer support, back-office workflows, onboarding coordination, internal tools, and automation.",
    icon: Layers3
  },
  {
    title: "Healthcare Support",
    body: "Scheduling coordination, records support, intake workflows, and administrative operations with careful controls.",
    icon: FileCheck2
  },
  {
    title: "Real Estate and Property",
    body: "Lead follow-up, appointment setting, listing support, document tracking, and client communication.",
    icon: CalendarCheck
  },
  {
    title: "Ecommerce and Retail",
    body: "Customer service, order support, returns coordination, inventory admin, and helpdesk workflows.",
    icon: BadgeCheck
  },
  {
    title: "Finance and Business Services",
    body: "Records management, document review, client support operations, and controlled workflow automation.",
    icon: ShieldCheck
  }
];

export const howItWorksSteps = [
  {
    title: "Discovery",
    body: "We clarify the business problem, volume, tools, risks, service expectations, and success metrics.",
    icon: Network
  },
  {
    title: "Operating Design",
    body: "We create the roles, workflow map, SOPs, QA checks, permissions, and reporting cadence.",
    icon: ClipboardCheck
  },
  {
    title: "Team and System Setup",
    body: "We onboard remote operators, configure tools, prepare forms, and align communication channels.",
    icon: UsersRound
  },
  {
    title: "Managed Delivery",
    body: "The team runs the workflow while Temacore supervisors monitor output, quality, and blockers.",
    icon: ChartNoAxesColumnIncreasing
  },
  {
    title: "Optimization",
    body: "We improve staffing, automation, dashboards, and operating procedures as the work matures.",
    icon: Zap
  }
];

export const whyTemacore = [
  {
    title: "Operations first, technology enabled",
    body: "We do not treat outsourcing and software as separate worlds. People, process, dashboards, and automation are designed together.",
    icon: Workflow
  },
  {
    title: "Built for executive visibility",
    body: "Clients get clear work queues, quality signals, reporting cadence, and escalation paths instead of a black-box vendor model.",
    icon: LineChart
  },
  {
    title: "Designed for distributed teams",
    body: "Temacore is structured for remote delivery, cross-time-zone communication, and dependable operational coverage.",
    icon: Network
  },
  {
    title: "Security-aware by default",
    body: "Role-based access, least-privilege thinking, status controls, audit trails, and future Supabase RLS are planned into the architecture.",
    icon: ShieldCheck
  }
];

export const technologySolutions = [
  {
    title: "Client Portals",
    body: "Secure spaces for clients to submit requests, track progress, review files, and communicate with your team.",
    icon: Database
  },
  {
    title: "CRM Systems",
    body: "Sales pipelines, lead follow-up views, appointment status, contact records, and management reporting.",
    icon: UsersRound
  },
  {
    title: "Workflow Dashboards",
    body: "Operational visibility for queues, SLAs, assignments, approvals, exceptions, and daily output.",
    icon: ChartNoAxesColumnIncreasing
  },
  {
    title: "Automation Tools",
    body: "Rules, triggers, reminders, notifications, and integrations that reduce repetitive work.",
    icon: Bot
  }
];
