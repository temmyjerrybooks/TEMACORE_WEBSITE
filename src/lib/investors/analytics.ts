import { createHash } from "node:crypto";
import { getSupabaseAdminConfig } from "@/lib/admin/config";
import { getSupabaseAdminClient } from "@/lib/db/supabase";

export const investorDeckEventNames = [
  "investor_deck_page_view",
  "investor_deck_started",
  "investor_deck_slide_viewed",
  "investor_deck_halfway_reached",
  "investor_deck_completed",
  "investor_deck_pdf_downloaded",
  "investor_deck_contact_clicked",
  "investor_deck_fullscreen_opened",
  "investor_deck_autoplay_started"
] as const;

export type InvestorDeckEventName = (typeof investorDeckEventNames)[number];

export type InvestorDeckEventInput = {
  sessionId: string;
  eventName: InvestorDeckEventName;
  slideNumber?: number | null;
};

type ParsedEvent =
  | { ok: true; value: InvestorDeckEventInput }
  | { ok: false; message: string };

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const analyticsWindowMs = 60 * 1000;
const maxAnalyticsEventsPerWindow = 60;
const globalAnalyticsRateLimit = globalThis as typeof globalThis & {
  __temacoreInvestorDeckRateLimit?: Map<string, RateLimitEntry>;
};

function rateLimitStore() {
  if (!globalAnalyticsRateLimit.__temacoreInvestorDeckRateLimit) {
    globalAnalyticsRateLimit.__temacoreInvestorDeckRateLimit = new Map();
  }

  return globalAnalyticsRateLimit.__temacoreInvestorDeckRateLimit;
}

function isValidEventName(value: unknown): value is InvestorDeckEventName {
  return typeof value === "string" && investorDeckEventNames.includes(value as InvestorDeckEventName);
}

function isValidSessionId(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
}

export function parseInvestorDeckEvent(payload: unknown): ParsedEvent {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid analytics payload." };
  }

  const candidate = payload as Record<string, unknown>;

  if (!isValidSessionId(candidate.sessionId)) {
    return { ok: false, message: "Invalid presentation session." };
  }

  if (!isValidEventName(candidate.eventName)) {
    return { ok: false, message: "Unsupported analytics event." };
  }

  const slideNumber = candidate.slideNumber;

  if (slideNumber !== undefined && slideNumber !== null) {
    if (typeof slideNumber !== "number" || !Number.isInteger(slideNumber) || slideNumber < 1 || slideNumber > 15) {
      return { ok: false, message: "Invalid slide number." };
    }
  }

  return {
    ok: true,
    value: {
      sessionId: candidate.sessionId,
      eventName: candidate.eventName,
      slideNumber: typeof slideNumber === "number" ? slideNumber : null
    }
  };
}

function clientFingerprint(request: Request, sessionId: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = forwardedFor || request.headers.get("x-real-ip") || sessionId;

  return createHash("sha256").update(clientAddress).digest("hex");
}

export function allowInvestorDeckEvent(request: Request, sessionId: string) {
  const store = rateLimitStore();
  const key = clientFingerprint(request, sessionId);
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + analyticsWindowMs });
    return true;
  }

  if (existing.count >= maxAnalyticsEventsPerWindow) {
    return false;
  }

  store.set(key, { count: existing.count + 1, resetAt: existing.resetAt });
  return true;
}

function sanitizeReferrer(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

function categorizeUserAgent(userAgent: string | null) {
  const value = (userAgent ?? "").toLowerCase();

  if (/tablet|ipad/.test(value)) {
    return "tablet";
  }

  if (/mobi|android|iphone|ipod/.test(value)) {
    return "mobile";
  }

  return "desktop";
}

export async function recordInvestorDeckEvent(input: InvestorDeckEventInput, request: Request) {
  const config = getSupabaseAdminConfig();

  if (!config.isConfigured) {
    return false;
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("investor_deck_events").insert({
    session_id: input.sessionId,
    event_name: input.eventName,
    slide_number: input.slideNumber ?? null,
    referrer: sanitizeReferrer(request.headers.get("referer")),
    user_agent_category: categorizeUserAgent(request.headers.get("user-agent"))
  });

  if (error) {
    return false;
  }

  return true;
}
