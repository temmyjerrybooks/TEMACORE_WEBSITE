import { NextResponse } from "next/server";
import { sendWebsiteAlert } from "@/lib/alerts/website-alerts";
import { recordWebsiteAlert, runAndStoreSeoAudit } from "@/lib/seo-agent/audit-storage";

export const runtime = "nodejs";

function isAuthorizedCronRequest(request: Request) {
  const configuredSecret = process.env.CRON_SECRET;
  const headerSecret = request.headers.get("x-cron-secret");
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!configuredSecret) {
    return {
      ok: false,
      status: 503,
      message: "Scheduled audit execution is not available in this environment."
    };
  }

  if (headerSecret === configuredSecret || bearerToken === configuredSecret) {
    return {
      ok: true,
      status: 200,
      message: "Authorized."
    };
  }

  return {
    ok: false,
    status: 401,
    message: "Cron request is not authorized."
  };
}

export async function GET(request: Request) {
  const authorization = isAuthorizedCronRequest(request);

  if (!authorization.ok) {
    return NextResponse.json(
      { ok: false, error: authorization.message },
      { status: authorization.status }
    );
  }

  try {
    const { summary } = await runAndStoreSeoAudit();

    return NextResponse.json({
      ok: true,
      ...summary
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run scheduled SEO audit.";

    await recordWebsiteAlert({
      alertType: "SEO audit failure",
      message,
      severity: "High"
    }).catch(() => undefined);

    await sendWebsiteAlert({
      alertType: "SEO audit failure",
      message,
      severity: "High",
      context: [{ label: "Route", value: "/api/cron/seo-audit" }]
    }).catch(() => undefined);

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
