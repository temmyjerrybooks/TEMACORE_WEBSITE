import { site } from "@/lib/data";
import { sendSubmissionNotification } from "@/lib/email/notifications";
import type { SeoIssueSeverity } from "@/lib/seo-agent/types";

export type WebsiteAlertType =
  | "Form submission failure"
  | "Email sending failure"
  | "API route error"
  | "Sitemap generation error"
  | "SEO audit failure"
  | "Suspicious form spam"
  | "Repeated failed admin login attempts"
  | "Missing environment variables"
  | "Broken deployment configuration warning";

type WebsiteAlertPayload = {
  alertType: WebsiteAlertType;
  message: string;
  severity?: SeoIssueSeverity;
  context?: {
    label: string;
    value?: string | string[] | null;
  }[];
};

export async function sendWebsiteAlert({
  alertType,
  message,
  severity = "Medium",
  context = []
}: WebsiteAlertPayload) {
  return sendSubmissionNotification({
    subject: `TEMACORE website alert: ${alertType}`,
    heading: "Website technical alert",
    fields: [
      { label: "Alert type", value: alertType },
      { label: "Severity", value: severity },
      { label: "Message", value: message },
      { label: "Notification route", value: site.email },
      ...context
    ]
  });
}
