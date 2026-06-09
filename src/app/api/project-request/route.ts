import { NextResponse } from "next/server";
import {
  formText,
  jsonError,
  optionalFormText,
  requireFields
} from "@/lib/api/form-data";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
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
    const formData = await request.formData();
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
      return jsonError(error.message, 500);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit project request.";

    return jsonError(message, 500);
  }
}
