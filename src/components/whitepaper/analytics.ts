"use client";

import type { WhitepaperEventName } from "@/lib/whitepaper/analytics";

const sessionStorageKey = "temacore_whitepaper_session";

function createSessionId() {
  if (typeof crypto === "undefined") {
    return null;
  }

  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  if (typeof crypto.getRandomValues !== "function") {
    return null;
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
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

    if (!sessionId) {
      return null;
    }

    window.sessionStorage.setItem(sessionStorageKey, sessionId);
    return sessionId;
  } catch {
    return null;
  }
}

export function trackWhitepaperEvent(eventName: WhitepaperEventName, pageNumber?: number) {
  const sessionId = getSessionId();

  if (!sessionId) {
    return;
  }

  void fetch("/api/whitepaper/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ sessionId, eventName, pageNumber }),
    keepalive: true
  }).catch(() => undefined);
}
