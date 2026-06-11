import { NextResponse } from "next/server";
import {
  formText,
  jsonError,
  optionalFormText,
  requireFields
} from "@/lib/api/form-data";
import { detectBasicSpam, rateLimitPlaceholder } from "@/lib/api/security";
import { sendWebsiteAlert } from "@/lib/alerts/website-alerts";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { sendSubmissionNotification } from "@/lib/email/notifications";
import type { ProjectRequest } from "@/lib/db/types";

export const runtime = "nodejs";

const projectTypeMap: Record<string, ProjectRequest["project_type"]> = {
  "Client portal": "client_portal",
  "CRM system": "crm",
  "Workflow dashboard": "dashboard",
  "Business automation": "automation",
  "Custom app": "custom_app",
  Other: "other"
};

export async function POST(request: Request) {
  try {
    const rateLimit = rateLimitPlaceholder(request);

    if (!rateLimit.allowed) {
      return jsonError(rateLimit.reason ?? "Please wait before submitting again.", 429);
    }

    const formData = await request.formData();
    const spamCheck = detectBasicSpam(formData);

    if (spamCheck.detected) {
      await sendWebsiteAlert({
        alertType: "Suspicious form spam",
        message: spamCheck.reason ?? "Project request spam signal detected.",
        severity: "Medium",
        context: [{ label: "Route", value: "/api/project-request" }]
      });

      return jsonError("Unable to accept this submission.", 400);
    }

    const missing = requireFields(formData, [
      "company_name",
      "contact_email",
      "project_type",
      "requirements_summary"
    ]);

    if (missing) {
      return jsonError(missing);
    }

    const supabase = getSupabaseAdminClient();
    const projectType = projectTypeMap[formText(formData, "project_type")] ?? "other";

    const { error } = await supabase.from("project_requests").insert({
      project_type: projectType,
      company_name: formText(formData, "company_name"),
      contact_email: formText(formData, "contact_email"),
      budget_range: optionalFormText(formData, "budget_range"),
      timeline: optionalFormText(formData, "timeline"),
      current_tools: optionalFormText(formData, "current_tools"),
      requirements_summary: formText(formData, "requirements_summary"),
      status: "submitted"
    });

    if (error) {
      await sendWebsiteAlert({
        alertType: "Form submission failure",
        message: error.message,
        severity: "High",
        context: [{ label: "Route", value: "/api/project-request" }]
      });

      return jsonError(error.message, 500);
    }

    const notificationSent = await sendSubmissionNotification({
      subject: "New TEMACORE project request",
      heading: "New project request submitted",
      fields: [
        { label: "Company", value: formText(formData, "company_name") },
        { label: "Email", value: formText(formData, "contact_email") },
        { label: "Project type", value: formText(formData, "project_type") },
        { label: "Budget range", value: optionalFormText(formData, "budget_range") },
        { label: "Timeline", value: optionalFormText(formData, "timeline") },
        { label: "Current tools", value: optionalFormText(formData, "current_tools") },
        { label: "Requirements", value: formText(formData, "requirements_summary") }
      ]
    });

    if (!notificationSent) {
      await sendWebsiteAlert({
        alertType: "Email sending failure",
        message: "Project request saved, but notification email was not sent.",
        severity: "Medium",
        context: [{ label: "Route", value: "/api/project-request" }]
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit project request.";

    await sendWebsiteAlert({
      alertType: "API route error",
      message,
      severity: "High",
      context: [{ label: "Route", value: "/api/project-request" }]
    }).catch(() => undefined);

    return jsonError(message, 500);
  }
}
