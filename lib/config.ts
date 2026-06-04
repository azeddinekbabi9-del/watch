export function getSupabaseConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://oqpjuhtatyxufksgymqt.supabase.co";

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_piY_1ttbqtN1bEjDBRxJyA_bnCOWbhf";

  const isConfigured = Boolean(url && anonKey && anonKey.startsWith("sb_"));

  return {
    url,
    anonKey,
    isConfigured
  };
}
