export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  platforms: "/platforms",
  ai: "/ai",
  insurtech: "/insurtech",
  investors: "/investors",
  industries: "/industries",
  venture: "/venture",
  howItWorks: "/how-it-works",
  technology: "/technology",
  careers: "/careers",
  clientIntake: "/client-intake",
  projectRequest: "/project-request",
  contact: "/contact",
  admin: "/admin"
} as const;

export const mainNavigation = [
  { label: "About", href: routes.about },
  { label: "Services", href: routes.services },
  { label: "Platforms", href: routes.platforms },
  { label: "Industries", href: routes.industries },
  { label: "Venture", href: routes.venture }
];

export const platformNavigation = [
  {
    label: "Platform Overview",
    description: "Connected operations, software, insurance, and AI.",
    href: routes.platforms
  },
  {
    label: "Insurance Technology",
    description: "Life and general insurance workflow support.",
    href: routes.insurtech
  },
  {
    label: "AI Workflow Intelligence",
    description: "Human-in-the-loop operational decision support.",
    href: routes.ai
  },
  {
    label: "Technology Solutions",
    description: "Custom applications, portals, CRM, and automation.",
    href: routes.technology
  }
];

export const footerNavigation = {
  company: [
    { label: "About Temacore", href: routes.about },
    { label: "How It Works", href: routes.howItWorks },
    { label: "Industries", href: routes.industries },
    { label: "Careers", href: routes.careers }
  ],
  action: [
    { label: "Client Intake", href: routes.clientIntake },
    { label: "Project Request", href: routes.projectRequest },
    { label: "Book Consultation", href: routes.contact }
  ]
};
