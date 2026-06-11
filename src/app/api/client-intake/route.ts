import { NextResponse } from "next/server";
import {
  formText,
  formTextArray,
  jsonError,
  optionalFormText,
  requireFields
} from "@/lib/api/form-data";
import { detectBasicSpam, rateLimitPlaceholder } from "@/lib/api/security";
import { sendWebsiteAlert } from "@/lib/alerts/website-alerts";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { sendSubmissionNotification } from "@/lib/email/notifications";

export const runtime = "nodejs";

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
        message: spamCheck.reason ?? "Client intake spam signal detected.",
        severity: "Medium",
        context: [{ label: "Route", value: "/api/client-intake" }]
      });

      return jsonError("Unable to accept this submission.", 400);
    }

    const missing = requireFields(formData, [
      "company_name",
      "contact_name",
      "email",
      "region",
      "workflow_summary"
    ]);

    if (missing) {
      return jsonError(missing);
    }

    const servicesNeeded = formTextArray(formData, "services_needed");
    const supabase = getSupabaseAdminClient();

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        company_name: formText(formData, "company_name"),
        contact_name: formText(formData, "contact_name"),
        email: formText(formData, "email"),
        region: formText(formData, "region"),
        service_interest: servicesNeeded.join(", ") || null,
        source: "client_intake",
        status: "new",
        notes: formText(formData, "workflow_summary")
      })
      .select("id")
      .single();

    if (leadError || !lead) {
      await sendWebsiteAlert({
        alertType: "Form submission failure",
        message: leadError?.message ?? "Unable to create lead.",
        severity: "High",
        context: [{ label: "Route", value: "/api/client-intake" }]
      });

      return jsonError(leadError?.message ?? "Unable to create lead.", 500);
    }

    const { error: intakeError } = await supabase.from("client_intakes").insert({
      lead_id: lead.id,
      company_name: formText(formData, "company_name"),
      website: optionalFormText(formData, "website"),
      region: formText(formData, "region"),
      services_needed: servicesNeeded,
      monthly_volume: optionalFormText(formData, "monthly_volume"),
      current_tools: optionalFormText(formData, "current_tools"),
      workflow_summary: formText(formData, "workflow_summary"),
      status: "submitted"
    });

    if (intakeError) {
      await sendWebsiteAlert({
        alertType: "Form submission failure",
        message: intakeError.message,
        severity: "High",
        context: [{ label: "Route", value: "/api/client-intake" }]
      });

      return jsonError(intakeError.message, 500);
    }

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
    });

    if (!notificationSent) {
      await sendWebsiteAlert({
        alertType: "Email sending failure",
        message: "Client intake saved, but notification email was not sent.",
        severity: "Medium",
        context: [{ label: "Route", value: "/api/client-intake" }]
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit intake.";

    await sendWebsiteAlert({
      alertType: "API route error",
      message,
      severity: "High",
      context: [{ label: "Route", value: "/api/client-intake" }]
    }).catch(() => undefined);

    return jsonError(message, 500);
  }
}
