import { NextResponse } from "next/server";
import { verifyAuditRequestAccess } from "@/lib/admin/audit-access";
import { sendWebsiteAlert } from "@/lib/alerts/website-alerts";
import { recordWebsiteAlert, runAndStoreSeoAudit } from "@/lib/seo-agent/audit-storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const access = await verifyAuditRequestAccess(request);

  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.message }, { status: access.status });
  }

  try {
    const { summary } = await runAndStoreSeoAudit();

    return NextResponse.json({
      ok: true,
      ...summary
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run SEO audit.";

    await recordWebsiteAlert({
      alertType: "SEO audit failure",
      message,
      severity: "High"
    }).catch(() => undefined);

    await sendWebsiteAlert({
      alertType: "SEO audit failure",
      message,
      severity: "High",
      context: [{ label: "Route", value: "/api/admin/seo/run-audit" }]
    }).catch(() => undefined);

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
