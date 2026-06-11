import { NextResponse } from "next/server";
import { clearAdminSessionCookies } from "@/lib/admin/cookies";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookies(response);

  return response;
}
