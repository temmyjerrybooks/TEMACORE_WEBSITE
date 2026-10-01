import { NextResponse } from "next/server";
import { checkDatabaseReadiness } from "@/lib/db/postgres";
import { storageError } from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  try {
    await checkDatabaseReadiness();
    return NextResponse.json({ ok: true, deployment: process.env.VERCEL_GIT_COMMIT_SHA ?? null }, { headers });
  } catch (error) {
    console.error("Database readiness failed", { code: storageError(error).code });
    return NextResponse.json({ ok: false }, { status: 503, headers });
  }
}
