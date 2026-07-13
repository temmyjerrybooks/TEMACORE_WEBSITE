import { getSupabaseAdminConfig } from "@/lib/admin/config";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import type { WhitepaperEvent } from "@/lib/db/types";

export type WhitepaperDashboardData = {
  isConfigured: boolean;
  setupMessage?: string;
  counts: {
    opens: number;
    starts: number;
    halfway: number;
    completions: number;
    downloads: number;
    contactClicks: number;
  };
  mostFrequentlyReachedPage: number | null;
  averageFurthestPage: number | null;
  recentEvents: WhitepaperEvent[];
};

function emptyDashboard(setupMessage?: string): WhitepaperDashboardData {
  return {
    isConfigured: false,
    setupMessage,
    counts: {
      opens: 0,
      starts: 0,
      halfway: 0,
      completions: 0,
      downloads: 0,
      contactClicks: 0
    },
    mostFrequentlyReachedPage: null,
    averageFurthestPage: null,
    recentEvents: []
  };
}

function getMostFrequentlyReachedPage(events: WhitepaperEvent[]) {
  const counts = new Map<number, number>();

  events.forEach((event) => {
    if (!event.page_number) {
      return;
    }

    counts.set(event.page_number, (counts.get(event.page_number) ?? 0) + 1);
  });

  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0] - right[0])[0]?.[0] ?? null;
}

function getAverageFurthestPage(events: WhitepaperEvent[]) {
  const furthestBySession = new Map<string, number>();

  events.forEach((event) => {
    if (!event.page_number) {
      return;
    }

    furthestBySession.set(
      event.session_id,
      Math.max(furthestBySession.get(event.session_id) ?? 0, event.page_number)
    );
  });

  const furthestPages = [...furthestBySession.values()];

  if (furthestPages.length === 0) {
    return null;
  }

  return Math.round((furthestPages.reduce((total, page) => total + page, 0) / furthestPages.length) * 10) / 10;
}

export async function getWhitepaperDashboardData(): Promise<WhitepaperDashboardData> {
  const config = getSupabaseAdminConfig();

  if (!config.isConfigured) {
    return emptyDashboard(
      "Supabase is not connected yet. Add the required server-side settings and run src/lib/db/whitepaper-schema.sql to enable whitepaper analytics."
    );
  }

  const supabase = getSupabaseAdminClient();
  const [opens, starts, halfway, completions, downloads, contactClicks, pageEvents, recentEvents] = await Promise.all([
    supabase.from("whitepaper_events").select("id", { count: "exact", head: true }).eq("event_name", "whitepaper_page_view"),
    supabase.from("whitepaper_events").select("id", { count: "exact", head: true }).eq("event_name", "whitepaper_started"),
    supabase.from("whitepaper_events").select("id", { count: "exact", head: true }).eq("event_name", "whitepaper_halfway_reached"),
    supabase.from("whitepaper_events").select("id", { count: "exact", head: true }).eq("event_name", "whitepaper_completed"),
    supabase.from("whitepaper_events").select("id", { count: "exact", head: true }).eq("event_name", "whitepaper_pdf_downloaded"),
    supabase.from("whitepaper_events").select("id", { count: "exact", head: true }).eq("event_name", "whitepaper_contact_clicked"),
    supabase
      .from("whitepaper_events")
      .select("id, session_id, event_name, page_number, referrer, user_agent_category, created_at")
      .eq("event_name", "whitepaper_page_viewed")
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase
      .from("whitepaper_events")
      .select("id, session_id, event_name, page_number, referrer, user_agent_category, created_at")
      .order("created_at", { ascending: false })
      .limit(12)
  ]);

  const errors = [
    opens.error,
    starts.error,
    halfway.error,
    completions.error,
    downloads.error,
    contactClicks.error,
    pageEvents.error,
    recentEvents.error
  ].filter(Boolean);

  if (errors.length > 0) {
    return emptyDashboard(errors[0]?.message ?? "Whitepaper analytics are unavailable.");
  }

  const reachedPages = pageEvents.data ?? [];

  return {
    isConfigured: true,
    counts: {
      opens: opens.count ?? 0,
      starts: starts.count ?? 0,
      halfway: halfway.count ?? 0,
      completions: completions.count ?? 0,
      downloads: downloads.count ?? 0,
      contactClicks: contactClicks.count ?? 0
    },
    mostFrequentlyReachedPage: getMostFrequentlyReachedPage(reachedPages),
    averageFurthestPage: getAverageFurthestPage(reachedPages),
    recentEvents: recentEvents.data ?? []
  };
}
