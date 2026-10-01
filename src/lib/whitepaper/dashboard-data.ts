import { getDatabaseConfig } from "@/lib/db/config";
import { getDatabase } from "@/lib/db/postgres";
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
  const config = getDatabaseConfig();

  if (!config.isConfigured) {
    return emptyDashboard(
      "PostgreSQL is not connected yet. Configure DATABASE_URL and run npm run db:migrate to enable database storage."
    );
  }

  const database = getDatabase();
  const [opens, starts, halfway, completions, downloads, contactClicks, pageEvents, recentEvents] = await Promise.all([
    database.select("whitepaper_events", { head: true, equals: { event_name: "whitepaper_page_view" } }),
    database.select("whitepaper_events", { head: true, equals: { event_name: "whitepaper_started" } }),
    database.select("whitepaper_events", { head: true, equals: { event_name: "whitepaper_halfway_reached" } }),
    database.select("whitepaper_events", { head: true, equals: { event_name: "whitepaper_completed" } }),
    database.select("whitepaper_events", { head: true, equals: { event_name: "whitepaper_pdf_downloaded" } }),
    database.select("whitepaper_events", { head: true, equals: { event_name: "whitepaper_contact_clicked" } }),
    database.select("whitepaper_events", { equals: { event_name: "whitepaper_page_viewed" }, orderBy: "created_at", ascending: false, limit: 5000 }),
    database.select("whitepaper_events", { orderBy: "created_at", ascending: false, limit: 12 })
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
