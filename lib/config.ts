export const fallbackSupabaseUrl = "https://example.supabase.co";
export const fallbackSupabaseAnonKey = "public-anon-key";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return {
    url: url || fallbackSupabaseUrl,
    anonKey: anonKey || fallbackSupabaseAnonKey,
    isConfigured: Boolean(url && anonKey)
  };
}

export const defaultStoreName = "VQ Watches";
