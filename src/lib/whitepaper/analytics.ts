import { getSupabaseAdminConfig } from "@/lib/admin/config";
import { getSupabaseAdminClient } from "@/lib/db/supabase";

export const whitepaperEventNames = [
  "whitepaper_page_view",
  "whitepaper_started",
  "whitepaper_page_viewed",
  "whitepaper_halfway_reached",
  "whitepaper_completed",
  "whitepaper_pdf_downloaded",
  "whitepaper_contact_clicked",
  "whitepaper_fullscreen_opened",
  "whitepaper_view_mode_changed"
] as const;

export type WhitepaperEventName = (typeof whitepaperEventNames)[number];

export type WhitepaperEventInput = {
  sessionId: string;
  eventName: WhitepaperEventName;
  pageNumber?: number | null;
};

type ParsedEvent =
  | { ok: true; value: WhitepaperEventInput }
  | { ok: false; message: string };

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const analyticsWindowMs = 60 * 1000;
const maxAnalyticsEventsPerWindow = 60;
const globalAnalyticsRateLimit = globalThis as typeof globalThis & {
  __temacoreWhitepaperRateLimit?: Map<string, RateLimitEntry>;
};

function rateLimitStore() {
  if (!globalAnalyticsRateLimit.__temacoreWhitepaperRateLimit) {
    globalAnalyticsRateLimit.__temacoreWhitepaperRateLimit = new Map();
  }

  return globalAnalyticsRateLimit.__temacoreWhitepaperRateLimit;
}

function isValidEventName(value: unknown): value is WhitepaperEventName {
  return typeof value === "string" && whitepaperEventNames.includes(value as WhitepaperEventName);
}

function isValidSessionId(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
}

export function parseWhitepaperEvent(payload: unknown): ParsedEvent {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid analytics payload." };
  }

  const candidate = payload as Record<string, unknown>;

  if (!isValidSessionId(candidate.sessionId)) {
    return { ok: false, message: "Invalid whitepaper session." };
  }

  if (!isValidEventName(candidate.eventName)) {
    return { ok: false, message: "Unsupported analytics event." };
  }

  const pageNumber = candidate.pageNumber;

  if (pageNumber !== undefined && pageNumber !== null) {
    if (typeof pageNumber !== "number" || !Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 17) {
      return { ok: false, message: "Invalid whitepaper page number." };
    }
  }

  return {
    ok: true,
    value: {
      sessionId: candidate.sessionId,
      eventName: candidate.eventName,
      pageNumber: typeof pageNumber === "number" ? pageNumber : null
    }
  };
}

export function allowWhitepaperEvent(sessionId: string) {
  const store = rateLimitStore();
  const now = Date.now();
  const existing = store.get(sessionId);

  if (!existing || existing.resetAt <= now) {
    store.set(sessionId, { count: 1, resetAt: now + analyticsWindowMs });
    return true;
  }

  if (existing.count >= maxAnalyticsEventsPerWindow) {
    return false;
  }

  store.set(sessionId, { count: existing.count + 1, resetAt: existing.resetAt });
  return true;
}

function sanitizeReferrer(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

function categorizeUserAgent(userAgent: string | null) {
  const value = (userAgent ?? "").toLowerCase();

  if (/tablet|ipad/.test(value)) {
    return "tablet" as const;
  }

  if (/mobi|android|iphone|ipod/.test(value)) {
    return "mobile" as const;
  }

  return "desktop" as const;
}

export async function recordWhitepaperEvent(input: WhitepaperEventInput, request: Request) {
  const config = getSupabaseAdminConfig();

  if (!config.isConfigured) {
    return false;
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("whitepaper_events").insert({
    session_id: input.sessionId,
    event_name: input.eventName,
    page_number: input.pageNumber ?? null,
    referrer: sanitizeReferrer(request.headers.get("referer")),
    user_agent_category: categorizeUserAgent(request.headers.get("user-agent"))
  });

  return !error;
}
