import type { NextResponse } from "next/server";

export const ADMIN_ACCESS_COOKIE = "temacore_admin_access_token";
export const ADMIN_REFRESH_COOKIE = "temacore_admin_refresh_token";

type AdminSessionTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

function secureCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  };
}

export function setAdminSessionCookies(response: NextResponse, session: AdminSessionTokens) {
  response.cookies.set(
    ADMIN_ACCESS_COOKIE,
    session.accessToken,
    secureCookieOptions(Math.max(session.expiresIn - 30, 60))
  );
  response.cookies.set(
    ADMIN_REFRESH_COOKIE,
    session.refreshToken,
    secureCookieOptions(60 * 60 * 24 * 14)
  );
}

export function clearAdminSessionCookies(response: NextResponse) {
  response.cookies.set(ADMIN_ACCESS_COOKIE, "", secureCookieOptions(0));
  response.cookies.set(ADMIN_REFRESH_COOKIE, "", secureCookieOptions(0));
}
