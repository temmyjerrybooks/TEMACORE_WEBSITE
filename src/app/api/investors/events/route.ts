import { NextResponse } from "next/server";
import {
  allowInvestorDeckEvent,
  parseInvestorDeckEvent,
  recordInvestorDeckEvent
} from "@/lib/investors/analytics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = parseInvestorDeckEvent(payload);

  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.message }, { status: 400 });
  }

  if (!allowInvestorDeckEvent(request, parsed.value.sessionId)) {
    return NextResponse.json({ ok: false, error: "Too many analytics events." }, { status: 429 });
  }

  await recordInvestorDeckEvent(parsed.value, request).catch(() => false);

  return new NextResponse(null, { status: 204 });
}
