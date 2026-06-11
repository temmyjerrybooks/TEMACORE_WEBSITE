import { getAdminEmail, getSupabaseAuthConfig } from "@/lib/admin/config";

export type AdminSession = {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

type SupabaseAuthUser = {
  id: string;
  email?: string | null;
};

type SupabaseTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: SupabaseAuthUser;
};

type AdminAuthResult =
  | {
      ok: true;
      session: AdminSession;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

function isAllowedAdminEmail(email?: string | null) {
  return Boolean(email && email.toLowerCase() === getAdminEmail());
}

function toAdminSession(data: SupabaseTokenResponse): AdminAuthResult {
  const email = data.user.email?.toLowerCase();

  if (!email || !isAllowedAdminEmail(email)) {
    return {
      ok: false,
      status: 403,
      message: "Unable to sign in with the provided credentials."
    };
  }

  return {
    ok: true,
    session: {
      userId: data.user.id,
      email,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    }
  };
}

export async function signInAdminWithPassword(email: string, password: string): Promise<AdminAuthResult> {
  const config = getSupabaseAuthConfig();
  const adminEmail = getAdminEmail();
  const submittedEmail = email.trim().toLowerCase();

  if (!config.isConfigured || !config.supabaseUrl || !config.anonKey || !adminEmail) {
    return {
      ok: false,
      status: 503,
      message: "Admin access is not available."
    };
  }

  if (submittedEmail !== adminEmail) {
    return {
      ok: false,
      status: 401,
      message: "Unable to sign in with the provided credentials."
    };
  }

  const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: submittedEmail,
      password
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status === 400 ? 401 : response.status,
      message: "Unable to sign in with the provided credentials."
    };
  }

  const data = (await response.json()) as SupabaseTokenResponse;

  return toAdminSession(data);
}

export async function validateAdminAccessToken(accessToken?: string): Promise<AdminAuthResult> {
  const config = getSupabaseAuthConfig();

  if (!config.isConfigured || !config.supabaseUrl || !config.anonKey || !accessToken) {
    return {
      ok: false,
      status: 401,
      message: "Admin session is not active."
    };
  }

  const response = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      ok: false,
      status: 401,
      message: "Admin session has expired."
    };
  }

  const user = (await response.json()) as SupabaseAuthUser;
  const email = user.email?.toLowerCase();

  if (!email || !isAllowedAdminEmail(email)) {
    return {
      ok: false,
      status: 403,
      message: "Admin session is not authorized."
    };
  }

  return {
    ok: true,
    session: {
      userId: user.id,
      email,
      accessToken,
      refreshToken: "",
      expiresIn: 60
    }
  };
}

export async function refreshAdminSession(refreshToken?: string): Promise<AdminAuthResult> {
  const config = getSupabaseAuthConfig();

  if (!config.isConfigured || !config.supabaseUrl || !config.anonKey || !refreshToken) {
    return {
      ok: false,
      status: 401,
      message: "Admin session cannot be refreshed."
    };
  }

  const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      refresh_token: refreshToken
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      ok: false,
      status: 401,
      message: "Admin session has expired."
    };
  }

  const data = (await response.json()) as SupabaseTokenResponse;

  return toAdminSession(data);
}
