import { NextResponse } from "next/server";
import { formText, formTextArray, jsonError, optionalFormText, requireFields } from "@/lib/api/form-data";
import { detectBasicSpam, rateLimitPlaceholder } from "@/lib/api/security";
import { sendWebsiteAlert } from "@/lib/alerts/website-alerts";
import { saveClientIntake } from "@/lib/db/intakes";
import { sendSubmissionNotification } from "@/lib/email/notifications";
import { intakeUnavailableMessage } from "@/lib/forms/intake-submission";

export const runtime = "nodejs";

function logStorageFailure(error: unknown) {
  const detail = error && typeof error === "object" ? error as Record<string, unknown> : {};
  const cause = detail.cause && typeof detail.cause === "object" ? detail.cause as Record<string, unknown> : {};
  const diagnosticText = [detail.message, detail.details, detail.code, cause.code].filter(value => typeof value === "string").join(" ");
  console.error("Client intake backend failure", {
    code: typeof detail.code === "string" && /^[A-Z0-9_]{1,40}$/.test(detail.code) ? detail.code : "BACKEND_REQUEST_FAILED",
    networkCode: diagnosticText.match(/\b(ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ETIMEDOUT|UND_ERR_CONNECT_TIMEOUT|UND_ERR_HEADERS_TIMEOUT)\b/)?.[1] ?? null,
    configured: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.TEMACORE_DATABASE_URL)
  });
}

export async function POST(request: Request) {
  try {
    const rateLimit = rateLimitPlaceholder(request);
    if (!rateLimit.allowed) return jsonError(rateLimit.reason ?? "Please wait before submitting again.", 429);

    const formData = await request.formData();
    const spamCheck = detectBasicSpam(formData);
    if (spamCheck.detected) {
      await sendWebsiteAlert({
        alertType: "Suspicious form spam",
        message: spamCheck.reason ?? "Client intake spam signal detected.",
        severity: "Medium",
        context: [{ label: "Route", value: "/api/client-intake" }]
      }).catch(() => undefined);
      return jsonError("Unable to accept this submission.", 400);
    }

    const missing = requireFields(formData, ["company_name", "contact_name", "email", "region", "workflow_summary"]);
    if (missing) return jsonError(missing);

    const servicesNeeded = formTextArray(formData, "services_needed");
    await saveClientIntake({
      company_name: formText(formData, "company_name"),
      contact_name: formText(formData, "contact_name"),
      email: formText(formData, "email"),
      region: formText(formData, "region"),
      service_interest: servicesNeeded.join(", ") || null,
      source: "client_intake",
      status: "new",
      notes: formText(formData, "workflow_summary")
    }, {
      company_name: formText(formData, "company_name"),
      website: optionalFormText(formData, "website"),
      region: formText(formData, "region"),
      services_needed: servicesNeeded,
      monthly_volume: optionalFormText(formData, "monthly_volume"),
      current_tools: optionalFormText(formData, "current_tools"),
      workflow_summary: formText(formData, "workflow_summary"),
      status: "submitted"
    });

    // Notification delivery cannot turn an already committed submission into a failure.
    const notificationSent = await sendSubmissionNotification({
      subject: "New TEMACORE client intake",
      heading: "New client intake submitted",
      fields: [
        { label: "Company", value: formText(formData, "company_name") },
        { label: "Contact", value: formText(formData, "contact_name") },
        { label: "Email", value: formText(formData, "email") },
        { label: "Website", value: optionalFormText(formData, "website") },
        { label: "Region", value: formText(formData, "region") },
        { label: "Monthly volume", value: optionalFormText(formData, "monthly_volume") },
        { label: "Services needed", value: servicesNeeded },
        { label: "Workflow summary", value: formText(formData, "workflow_summary") }
      ]
    }).catch(() => false);

    if (!notificationSent) {
      await sendWebsiteAlert({
        alertType: "Email sending failure",
        message: "Client intake saved, but notification email was not sent.",
        severity: "Medium",
        context: [{ label: "Route", value: "/api/client-intake" }]
      }).catch(() => undefined);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    logStorageFailure(error);
    await sendWebsiteAlert({
      alertType: "API route error",
      message: "Client intake could not be saved. Check the database connection and server diagnostic codes.",
      severity: "High",
      context: [{ label: "Route", value: "/api/client-intake" }]
    }).catch(() => undefined);
    return jsonError(intakeUnavailableMessage, 503);
  }
}
