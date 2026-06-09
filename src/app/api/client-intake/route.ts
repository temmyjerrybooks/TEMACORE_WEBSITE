import { NextResponse } from "next/server";
import {
  formText,
  formTextArray,
  jsonError,
  optionalFormText,
  requireFields
} from "@/lib/api/form-data";
import { getSupabaseAdminClient } from "@/lib/db/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
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
      return jsonError(intakeError.message, 500);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit intake.";

    return jsonError(message, 500);
  }
}
