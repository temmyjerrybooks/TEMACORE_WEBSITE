export type FounderPortrait = {
  src: string;
  alt: string;
};

export type FounderProfile = {
  name: string;
  initials: string;
  title: string;
  descriptor: string;
  email: string;
  linkedInUrl: string;
  githubUrl: string;
  portrait?: FounderPortrait;
  knowsAbout: string[];
};

/**
 * Public founder-profile source of truth. Keep this configuration limited to
 * information manually verified from Temacore and the public LinkedIn profile.
 * Do not infer employers, dates, credentials, location, or a portrait from
 * third-party sources. Add `portrait` only after an approved local asset is
 * available in public/founder/.
 */
export const founderProfile: FounderProfile = {
  name: "Temitope Abodunde",
  initials: "TA",
  title: "Founder, Temacore LLC",
  descriptor: "Software Engineering - Insurance Technology - Workflow Automation",
  email: "info@temacore.com",
  linkedInUrl: "https://www.linkedin.com/in/temitope-abodunde-48730b164",
  githubUrl: "https://github.com/temmyjerrybooks",
  knowsAbout: [
    "Insurance technology",
    "Insurance systems",
    "Business process automation",
    "Full-stack software development",
    "Custom business systems",
    "BPO operations",
    "Workflow design"
  ]
};
