export function getAdminEmail() {
  return (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
}

export function getSupabaseAuthConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = getAdminEmail();

  return {
    isConfigured: Boolean(supabaseUrl && anonKey && adminEmail),
    supabaseUrl,
    anonKey
  };
}

export function getSupabaseAdminConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    isConfigured: Boolean(supabaseUrl && serviceRoleKey),
    supabaseUrl,
    serviceRoleKey
  };
}
