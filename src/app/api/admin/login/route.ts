import { NextResponse } from "next/server";
import { setAdminSessionCookies } from "@/lib/admin/cookies";
import { signInAdminWithPassword } from "@/lib/admin/auth-core";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;

  const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload?.password === "string" ? payload.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Admin email and password are required." },
      { status: 400 }
    );
  }

  const result = await signInAdminWithPassword(email, password);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.message }, { status: result.status });
  }

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookies(response, result.session);

  return response;
}
