import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/config";
import type { Database } from "@/types/database";

type SupabaseBrowserClient = ReturnType<
  typeof createBrowserClient<Database, "public", Database["public"]>
>;

let browserClient: SupabaseBrowserClient | null = null;

export function createSupabaseBrowserClient(): SupabaseBrowserClient | null {
  const config = getSupabaseConfig();

  if (!config.isConfigured) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database, "public", Database["public"]>(
      config.url,
      config.anonKey
    );
  }

  return browserClient;
}
