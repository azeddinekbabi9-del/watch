export const fallbackSupabaseUrl = "https://oqpjuhtatyxufksgymqt.supabase.co";
export const fallbackSupabaseAnonKey =
  "sb_publishable_piY_1ttbqtN1bEjDBRxJyA_bnCOWbhf";

function readPublicEnv(name: string) {
  if (typeof process === "undefined") {
    return "";
  }

  return process.env[name]?.trim() ?? "";
}

export function getSupabaseConfig() {
  // Cloudflare Worker runtime/client builds may not expose NEXT_PUBLIC values
  // correctly after deployment, so these public Supabase values are used as a
  // production fallback when runtime env vars are missing.
  const url =
    readPublicEnv("NEXT_PUBLIC_SUPABASE_URL") || fallbackSupabaseUrl;
  const anonKey =
    readPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || fallbackSupabaseAnonKey;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && anonKey.startsWith("sb_"))
  };
}

export const defaultStoreName = "WQITAK";
