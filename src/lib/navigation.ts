export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  industries: "/industries",
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
  { label: "Industries", href: routes.industries },
  { label: "How It Works", href: routes.howItWorks },
  { label: "Technology", href: routes.technology }
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
