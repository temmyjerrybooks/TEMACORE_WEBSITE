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
  domain: "https://www.temacore.com/",
  description:
    "Temacore builds remote operations teams, outsourcing systems, customer support workflows, and custom business technology for companies in North America, the UK, and Europe."
};

export type ServiceSlug =
  | "business-process-outsourcing"
  | "remote-teams"
  | "customer-support"
  | "virtual-assistant-services"
  | "back-office-operations"
  | "lead-generation-appointment-setting"
  | "custom-application-development"
  | "mobile-application-development"
  | "crm-development"
  | "client-portal-development"
  | "business-automation"
  | "data-reporting-dashboards";

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
      { value: "Seats", label: "role-based team models" },
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
  },
  {
    slug: "virtual-assistant-services",
    title: "Virtual Assistant Services",
    shortTitle: "Virtual Assistants",
    eyebrow: "Executive and admin support",
    summary:
      "Provide dependable remote assistant support for scheduling, inbox coordination, CRM updates, research, and administrative follow-through.",
    description:
      "Temacore virtual assistant services help teams reduce administrative load while keeping communication, scheduling, and routine coordination organized through documented workflows.",
    icon: UsersRound,
    metrics: [
      { value: "Admin", label: "daily support" },
      { value: "CRM", label: "record updates" },
      { value: "Desk", label: "task coordination" }
    ],
    outcomes: [
      "More consistent administrative follow-through",
      "Cleaner inbox, calendar, and CRM coordination",
      "Less context switching for internal teams",
      "A documented assistant workflow that can scale"
    ],
    capabilities: [
      "Inbox and calendar coordination",
      "CRM updates and contact records",
      "Research and list preparation",
      "Meeting preparation and follow-up",
      "Administrative task tracking"
    ],
    process: [
      {
        title: "Define assistant responsibilities",
        body: "We clarify recurring tasks, communication expectations, tools, access needs, and approval rules."
      },
      {
        title: "Build the task playbook",
        body: "We create checklists and handoff rules so assistant work stays clear and repeatable."
      },
      {
        title: "Run and refine",
        body: "The assistant executes the workflow while managers review output, blockers, and improvements."
      }
    ],
    deliverables: [
      "Assistant role profile",
      "Task checklist",
      "Communication rules",
      "Access and approval notes",
      "Weekly task report"
    ]
  },
  {
    slug: "lead-generation-appointment-setting",
    title: "Lead Generation and Appointment Setting",
    shortTitle: "Lead Follow-Up",
    eyebrow: "Sales operations support",
    summary:
      "Support lead follow-up, appointment setting, CRM updates, prospect research, and structured sales coordination.",
    description:
      "Temacore helps teams keep lead follow-up organized with appointment workflows, CRM hygiene, prospect research, and clear escalation rules for qualified opportunities.",
    icon: CalendarCheck,
    metrics: [
      { value: "Lead", label: "follow-up workflows" },
      { value: "CRM", label: "pipeline updates" },
      { value: "Calls", label: "appointment coordination" }
    ],
    outcomes: [
      "Fewer missed lead follow-ups",
      "More organized appointment coordination",
      "Cleaner CRM activity records",
      "Better handoffs between sales and operations"
    ],
    capabilities: [
      "Prospect research and list preparation",
      "Lead follow-up workflows",
      "Appointment setting coordination",
      "CRM updates and activity logging",
      "Qualified lead escalation"
    ],
    process: [
      {
        title: "Define qualification rules",
        body: "We document lead sources, follow-up steps, appointment criteria, and escalation requirements."
      },
      {
        title: "Prepare outreach operations",
        body: "We align scripts, templates, CRM fields, and daily work queues."
      },
      {
        title: "Track and report",
        body: "We monitor follow-up activity, booking status, and exceptions without inventing performance claims."
      }
    ],
    deliverables: [
      "Lead workflow map",
      "Follow-up script notes",
      "CRM field checklist",
      "Appointment status tracker",
      "Activity report"
    ]
  },
  {
    slug: "mobile-application-development",
    title: "Mobile Application Development",
    shortTitle: "Mobile Apps",
    eyebrow: "Business mobile software",
    summary:
      "Build mobile applications that support business workflows, customer access, team operations, and data-driven services.",
    description:
      "Temacore develops mobile application experiences for companies that need practical business tools, customer-facing access, workflow visibility, and secure integration with backend systems.",
    icon: Code2,
    metrics: [
      { value: "iOS", label: "mobile experience" },
      { value: "Android", label: "mobile experience" },
      { value: "API", label: "backend integration" }
    ],
    outcomes: [
      "Mobile access for customers, teams, or field workflows",
      "A clearer application scope before development begins",
      "Backend integration planning for business data",
      "A release path that supports iteration"
    ],
    capabilities: [
      "Mobile product scoping",
      "User experience planning",
      "Frontend and backend development",
      "API integration",
      "Testing and deployment preparation"
    ],
    process: [
      {
        title: "Scope the mobile workflow",
        body: "We define users, features, data flows, devices, and business rules."
      },
      {
        title: "Design and build",
        body: "We create the app experience and connect it to the required backend systems."
      },
      {
        title: "Test and prepare release",
        body: "We test core flows, permissions, and deployment requirements before launch."
      }
    ],
    deliverables: [
      "Mobile requirements brief",
      "User flow map",
      "Application build",
      "Integration notes",
      "Release checklist"
    ]
  },
  {
    slug: "crm-development",
    title: "CRM Development",
    shortTitle: "CRM Development",
    eyebrow: "Sales and customer systems",
    summary:
      "Design CRM systems for contacts, pipelines, lead follow-up, appointment status, reporting, and customer operations.",
    description:
      "Temacore builds CRM systems and CRM workflows that help teams track customer relationships, sales activity, support context, and management reporting without relying on scattered spreadsheets.",
    icon: Database,
    metrics: [
      { value: "CRM", label: "records and pipeline" },
      { value: "Ops", label: "workflow tracking" },
      { value: "Reports", label: "management visibility" }
    ],
    outcomes: [
      "Centralized contact and activity records",
      "Clearer pipeline and follow-up ownership",
      "Better visibility into customer and sales workflows",
      "A CRM structure aligned to real team behavior"
    ],
    capabilities: [
      "CRM data model design",
      "Lead and pipeline workflows",
      "Contact and account records",
      "Reporting views",
      "CRM automation planning"
    ],
    process: [
      {
        title: "Audit the current CRM flow",
        body: "We review fields, stages, handoffs, reporting needs, and existing tool limitations."
      },
      {
        title: "Design the CRM structure",
        body: "We define records, permissions, pipeline stages, and activity rules."
      },
      {
        title: "Build and iterate",
        body: "We implement the CRM workflow, test common scenarios, and refine based on usage."
      }
    ],
    deliverables: [
      "CRM requirements brief",
      "Data model",
      "Pipeline configuration",
      "Reporting views",
      "User workflow documentation"
    ]
  },
  {
    slug: "client-portal-development",
    title: "Client Portal Development",
    shortTitle: "Client Portals",
    eyebrow: "Client-facing systems",
    summary:
      "Build secure client portals for requests, files, status updates, approvals, communication, and service visibility.",
    description:
      "Temacore develops client portals that give businesses and their clients a clearer place to manage requests, documents, updates, approvals, and operational visibility.",
    icon: Layers3,
    metrics: [
      { value: "Portal", label: "client access" },
      { value: "Files", label: "document flow" },
      { value: "Status", label: "request visibility" }
    ],
    outcomes: [
      "A clearer client experience for requests and updates",
      "Reduced dependence on scattered email threads",
      "Role-aware access planning",
      "Better visibility into service progress"
    ],
    capabilities: [
      "Client request workflows",
      "Document and file access",
      "Status dashboards",
      "Approval workflows",
      "Role-based portal planning"
    ],
    process: [
      {
        title: "Define portal users",
        body: "We clarify client roles, internal roles, permissions, and the workflows the portal must support."
      },
      {
        title: "Map requests and records",
        body: "We design the request types, status fields, files, notifications, and reporting views."
      },
      {
        title: "Build the portal",
        body: "We develop the interface, connect the data model, and prepare a release path."
      }
    ],
    deliverables: [
      "Portal requirements brief",
      "Permission model",
      "Request workflow map",
      "Client portal build",
      "Launch checklist"
    ]
  },
  {
    slug: "data-reporting-dashboards",
    title: "Data Analytics and Reporting Dashboards",
    shortTitle: "Data Dashboards",
    eyebrow: "Reporting and visibility",
    summary:
      "Create dashboards and reporting workflows that help teams monitor operations, workload, status, and business performance signals.",
    description:
      "Temacore builds practical reporting dashboards for teams that need clearer visibility into tasks, pipelines, support queues, operations, and management decisions.",
    icon: ChartNoAxesColumnIncreasing,
    metrics: [
      { value: "BI", label: "reporting views" },
      { value: "Data", label: "organized inputs" },
      { value: "Ops", label: "performance signals" }
    ],
    outcomes: [
      "Clearer reporting for recurring operations",
      "Less manual spreadsheet consolidation",
      "Better visibility into status and workload",
      "Dashboards aligned to business decisions"
    ],
    capabilities: [
      "Dashboard requirements planning",
      "Data source mapping",
      "Operational reporting views",
      "Workflow status dashboards",
      "Management reporting"
    ],
    process: [
      {
        title: "Define reporting questions",
        body: "We identify what managers need to see, how often, and which source data supports it."
      },
      {
        title: "Structure the data",
        body: "We map inputs, clean fields, and design dashboard views around operational use."
      },
      {
        title: "Build and review",
        body: "We create dashboards and refine them around the decisions they need to support."
      }
    ],
    deliverables: [
      "Reporting requirements",
      "Data source map",
      "Dashboard build",
      "Metric definitions",
      "Review checklist"
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
  { value: "12", label: "core service lines" },
  { value: "3", label: "market regions supported" },
  { value: "Intake", label: "structured start for new inquiries" },
  { value: "1", label: "partner for people, process, and systems" }
];

export type ServiceFaq = {
  question: string;
  answer: string;
};

const relatedServiceMap: Record<ServiceSlug, ServiceSlug[]> = {
  "business-process-outsourcing": [
    "customer-support",
    "virtual-assistant-services",
    "back-office-operations",
    "lead-generation-appointment-setting"
  ],
  "remote-teams": [
    "virtual-assistant-services",
    "customer-support",
    "back-office-operations",
    "client-portal-development"
  ],
  "customer-support": [
    "business-process-outsourcing",
    "remote-teams",
    "crm-development",
    "business-automation"
  ],
  "virtual-assistant-services": [
    "remote-teams",
    "back-office-operations",
    "lead-generation-appointment-setting",
    "client-portal-development"
  ],
  "back-office-operations": [
    "business-process-outsourcing",
    "virtual-assistant-services",
    "crm-development",
    "data-reporting-dashboards"
  ],
  "lead-generation-appointment-setting": [
    "crm-development",
    "remote-teams",
    "business-automation",
    "customer-support"
  ],
  "custom-application-development": [
    "crm-development",
    "client-portal-development",
    "business-automation",
    "mobile-application-development"
  ],
  "mobile-application-development": [
    "custom-application-development",
    "client-portal-development",
    "crm-development",
    "business-automation"
  ],
  "crm-development": [
    "custom-application-development",
    "client-portal-development",
    "business-automation",
    "data-reporting-dashboards"
  ],
  "client-portal-development": [
    "custom-application-development",
    "crm-development",
    "business-automation",
    "data-reporting-dashboards"
  ],
  "business-automation": [
    "custom-application-development",
    "crm-development",
    "client-portal-development",
    "data-reporting-dashboards"
  ],
  "data-reporting-dashboards": [
    "business-automation",
    "crm-development",
    "client-portal-development",
    "back-office-operations"
  ]
};

export function getRelatedServices(slug: ServiceSlug) {
  const relatedSlugs = relatedServiceMap[slug] ?? [];

  return relatedSlugs
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((service): service is Service => Boolean(service));
}

export function getServiceFaqs(slug: ServiceSlug): ServiceFaq[] {
  const service = getServiceBySlug(slug);

  if (!service) {
    return [];
  }

  return [
    {
      question: `What is ${service.title}?`,
      answer: service.summary
    },
    {
      question: `Who is ${service.title} for?`,
      answer:
        "This service is for businesses that need clearer operational capacity, better workflow ownership, or practical technology support without adding unnecessary internal complexity."
    },
    {
      question: "How does Temacore start an engagement?",
      answer:
        "Temacore starts by reviewing the workflow, tools, roles, risks, and expected outcomes before recommending a managed delivery model."
    },
    {
      question: "How can a business request this service?",
      answer:
        "Businesses can use the client intake form, project request form, or contact page to share their requirements with the TEMACORE Team."
    }
  ];
}

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
