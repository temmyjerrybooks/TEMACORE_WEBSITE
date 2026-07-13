import { getSupabaseAdminConfig } from "@/lib/admin/config";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import type { InvestorDeckEvent } from "@/lib/db/types";

export type InvestorDeckDashboardData = {
  isConfigured: boolean;
  setupMessage?: string;
  counts: {
    opens: number;
    starts: number;
    completions: number;
    downloads: number;
    contactClicks: number;
  };
  mostFrequentlyReachedSlide: number | null;
  averageFurthestSlide: number | null;
  recentEvents: InvestorDeckEvent[];
};

function emptyDashboard(setupMessage?: string): InvestorDeckDashboardData {
  return {
    isConfigured: false,
    setupMessage,
    counts: {
      opens: 0,
      starts: 0,
      completions: 0,
      downloads: 0,
      contactClicks: 0
    },
    mostFrequentlyReachedSlide: null,
    averageFurthestSlide: null,
    recentEvents: []
  };
}

function getMostFrequentlyReachedSlide(events: InvestorDeckEvent[]) {
  const counts = new Map<number, number>();

  events.forEach((event) => {
    if (!event.slide_number) {
      return;
    }

    counts.set(event.slide_number, (counts.get(event.slide_number) ?? 0) + 1);
  });

  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0] - right[0])[0]?.[0] ?? null;
}

function getAverageFurthestSlide(events: InvestorDeckEvent[]) {
  const furthestBySession = new Map<string, number>();

  events.forEach((event) => {
    if (!event.slide_number) {
      return;
    }

    furthestBySession.set(
      event.session_id,
      Math.max(furthestBySession.get(event.session_id) ?? 0, event.slide_number)
    );
  });

  const furthestSlides = [...furthestBySession.values()];

  if (furthestSlides.length === 0) {
    return null;
  }

  return Math.round((furthestSlides.reduce((total, slide) => total + slide, 0) / furthestSlides.length) * 10) / 10;
}

export async function getInvestorDeckDashboardData(): Promise<InvestorDeckDashboardData> {
  const config = getSupabaseAdminConfig();

  if (!config.isConfigured) {
    return emptyDashboard(
      "Supabase is not connected yet. Add the required server-side settings and run src/lib/db/investor-deck-schema.sql to enable investor presentation analytics."
    );
  }

  const supabase = getSupabaseAdminClient();
  const [
    opens,
    starts,
    completions,
    downloads,
    contactClicks,
    slideEvents,
    recentEvents
  ] = await Promise.all([
    supabase.from("investor_deck_events").select("id", { count: "exact", head: true }).eq("event_name", "investor_deck_page_view"),
    supabase.from("investor_deck_events").select("id", { count: "exact", head: true }).eq("event_name", "investor_deck_started"),
    supabase.from("investor_deck_events").select("id", { count: "exact", head: true }).eq("event_name", "investor_deck_completed"),
    supabase.from("investor_deck_events").select("id", { count: "exact", head: true }).eq("event_name", "investor_deck_pdf_downloaded"),
    supabase.from("investor_deck_events").select("id", { count: "exact", head: true }).eq("event_name", "investor_deck_contact_clicked"),
    supabase
      .from("investor_deck_events")
      .select("id, session_id, event_name, slide_number, referrer, user_agent_category, created_at")
      .not("slide_number", "is", null)
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase
      .from("investor_deck_events")
      .select("id, session_id, event_name, slide_number, referrer, user_agent_category, created_at")
      .order("created_at", { ascending: false })
      .limit(12)
  ]);

  const errors = [opens.error, starts.error, completions.error, downloads.error, contactClicks.error, slideEvents.error, recentEvents.error].filter(Boolean);

  if (errors.length > 0) {
    return emptyDashboard(errors[0]?.message ?? "Investor presentation analytics are unavailable.");
  }

  const reachedSlides = slideEvents.data ?? [];

  return {
    isConfigured: true,
    counts: {
      opens: opens.count ?? 0,
      starts: starts.count ?? 0,
      completions: completions.count ?? 0,
      downloads: downloads.count ?? 0,
      contactClicks: contactClicks.count ?? 0
    },
    mostFrequentlyReachedSlide: getMostFrequentlyReachedSlide(reachedSlides),
    averageFurthestSlide: getAverageFurthestSlide(reachedSlides),
    recentEvents: recentEvents.data ?? []
  };
}
