import { NextResponse } from "next/server";
import { setAdminSessionCookies } from "@/lib/admin/cookies";
import { signInAdminWithPassword } from "@/lib/admin/auth-core";

export const runtime = "nodejs";

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const loginWindowMs = 10 * 60 * 1000;
const maxLoginAttempts = 5;
const globalLoginAttempts = globalThis as typeof globalThis & {
  __temacoreAdminLoginAttempts?: Map<string, LoginAttempt>;
};

function loginAttempts() {
  if (!globalLoginAttempts.__temacoreAdminLoginAttempts) {
    globalLoginAttempts.__temacoreAdminLoginAttempts = new Map();
  }

  return globalLoginAttempts.__temacoreAdminLoginAttempts;
}

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isLimited(key: string) {
  const now = Date.now();
  const attempt = loginAttempts().get(key);

  if (!attempt) {
    return false;
  }

  if (attempt.resetAt <= now) {
    loginAttempts().delete(key);
    return false;
  }

  return attempt.count >= maxLoginAttempts;
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const attempts = loginAttempts();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, {
      count: 1,
      resetAt: now + loginWindowMs
    });
    return;
  }

  attempts.set(key, {
    count: current.count + 1,
    resetAt: current.resetAt
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;

  const password = typeof payload?.password === "string" ? payload.password : "";
  const key = clientKey(request);

  if (isLimited(key)) {
    return NextResponse.json(
      { ok: false, error: "Too many sign-in attempts. Try again later." },
      { status: 429 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { ok: false, error: "Password is required." },
      { status: 400 }
    );
  }

  const result = await signInAdminWithPassword(password);

  if (!result.ok) {
    if (result.status === 401 || result.status === 403) {
      recordFailedAttempt(key);
    }

    return NextResponse.json({ ok: false, error: result.message }, { status: result.status });
  }

  loginAttempts().delete(key);

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookies(response, result.session);

  return response;
}
