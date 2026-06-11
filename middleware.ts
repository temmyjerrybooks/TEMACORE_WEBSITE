import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
  clearAdminSessionCookies,
  setAdminSessionCookies
} from "@/lib/admin/cookies";
import { refreshAdminSession, validateAdminAccessToken } from "@/lib/admin/auth-core";

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);

  if (request.nextUrl.pathname !== "/admin") {
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
  }

  const response = NextResponse.redirect(loginUrl);
  clearAdminSessionCookies(response);

  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const accessToken = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(ADMIN_REFRESH_COOKIE)?.value;

  if (isLoginPage && !accessToken && !refreshToken) {
    return NextResponse.next();
  }

  const validation = await validateAdminAccessToken(accessToken);

  if (validation.ok) {
    return isLoginPage ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  const refreshed = await refreshAdminSession(refreshToken);

  if (refreshed.ok) {
    const response = isLoginPage
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();

    setAdminSessionCookies(response, refreshed.session);

    return response;
  }

  if (isLoginPage) {
    return NextResponse.next();
  }

  return redirectToLogin(request);
}

export const config = {
  matcher: ["/admin/:path*"]
};
