"use client";

import type { InvestorDeckEventName } from "@/lib/investors/analytics";

const sessionStorageKey = "temacore_investor_deck_session";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;

    return value.toString(16);
  });
}

function getSessionId() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const existing = window.sessionStorage.getItem(sessionStorageKey);

    if (existing) {
      return existing;
    }

    const sessionId = createSessionId();
    window.sessionStorage.setItem(sessionStorageKey, sessionId);
    return sessionId;
  } catch {
    return null;
  }
}

export function trackInvestorDeckEvent(eventName: InvestorDeckEventName, slideNumber?: number) {
  const sessionId = getSessionId();

  if (!sessionId) {
    return;
  }

  void fetch("/api/investors/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ sessionId, eventName, slideNumber }),
    keepalive: true
  }).catch(() => undefined);
}
