import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { ADMIN_ACCESS_COOKIE } from "@/lib/admin/cookies";
import { validateAdminAccessToken } from "@/lib/admin/auth-core";

type AuditAccessResult =
  | {
      ok: true;
      method: "admin-session" | "secret";
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

export async function verifyAuditRequestAccess(request: Request | NextRequest): Promise<AuditAccessResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  const adminSession = await validateAdminAccessToken(accessToken);

  if (adminSession.ok) {
    return {
      ok: true,
      method: "admin-session"
    };
  }

  const configuredSecret = process.env.SEO_AUDIT_SECRET;
  const providedSecret = request.headers.get("x-seo-audit-secret");

  if (!configuredSecret) {
    return {
      ok: false,
      status: 503,
      message: "SEO_AUDIT_SECRET is not configured and no valid admin session was found."
    };
  }

  if (!providedSecret || providedSecret !== configuredSecret) {
    return {
      ok: false,
      status: 401,
      message: "SEO audit request is not authorized."
    };
  }

  return {
    ok: true,
    method: "secret"
  };
}
