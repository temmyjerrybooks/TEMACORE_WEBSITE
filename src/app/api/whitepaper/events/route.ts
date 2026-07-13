import { NextResponse } from "next/server";
import {
  allowWhitepaperEvent,
  parseWhitepaperEvent,
  recordWhitepaperEvent
} from "@/lib/whitepaper/analytics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = parseWhitepaperEvent(payload);

  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.message }, { status: 400 });
  }

  if (!allowWhitepaperEvent(parsed.value.sessionId)) {
    return NextResponse.json({ ok: false, error: "Too many analytics events." }, { status: 429 });
  }

  await recordWhitepaperEvent(parsed.value, request).catch(() => false);

  return new NextResponse(null, { status: 204 });
}
