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
        message: spamCheck.reason ?? "Talent application spam signal detected.",
        severity: "Medium",
        context: [{ label: "Route", value: "/api/talent-application" }]
      });

      return jsonError("Unable to accept this submission.", 400);
    }

    const missing = requireFields(formData, ["full_name", "email", "role_interest"]);

    if (missing) {
      return jsonError(missing);
    }

    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.from("talent_applications").insert({
      full_name: formText(formData, "full_name"),
      email: formText(formData, "email"),
      country: optionalFormText(formData, "country"),
      role_interest: formText(formData, "role_interest"),
      experience_level: optionalFormText(formData, "experience_level"),
      portfolio_url: optionalFormText(formData, "portfolio_url"),
      availability: optionalFormText(formData, "availability"),
      experience_summary: optionalFormText(formData, "experience_summary"),
      status: "submitted"
    });

    if (error) {
      await sendWebsiteAlert({
        alertType: "Form submission failure",
        message: error.message,
        severity: "High",
        context: [{ label: "Route", value: "/api/talent-application" }]
      });

      return jsonError(error.message, 500);
    }

    const notificationSent = await sendSubmissionNotification({
      subject: "New TEMACORE talent application",
      heading: "New talent application submitted",
      fields: [
        { label: "Full name", value: formText(formData, "full_name") },
        { label: "Email", value: formText(formData, "email") },
        { label: "Country", value: optionalFormText(formData, "country") },
        { label: "Role interest", value: formText(formData, "role_interest") },
        { label: "Experience level", value: optionalFormText(formData, "experience_level") },
        { label: "Availability", value: optionalFormText(formData, "availability") },
        { label: "Portfolio", value: optionalFormText(formData, "portfolio_url") },
        { label: "Experience summary", value: optionalFormText(formData, "experience_summary") }
      ]
    });

    if (!notificationSent) {
      await sendWebsiteAlert({
        alertType: "Email sending failure",
        message: "Talent application saved, but notification email was not sent.",
        severity: "Medium",
        context: [{ label: "Route", value: "/api/talent-application" }]
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit application.";

    await sendWebsiteAlert({
      alertType: "API route error",
      message,
      severity: "High",
      context: [{ label: "Route", value: "/api/talent-application" }]
    }).catch(() => undefined);

    return jsonError(message, 500);
  }
}
