import { NextResponse } from "next/server";
import {
  formText,
  jsonError,
  optionalFormText,
  requireFields
} from "@/lib/api/form-data";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { sendSubmissionNotification } from "@/lib/email/notifications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
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
      return jsonError(error.message, 500);
    }

    await sendSubmissionNotification({
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit application.";

    return jsonError(message, 500);
  }
}
