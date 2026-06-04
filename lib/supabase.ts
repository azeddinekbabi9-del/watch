import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/config";

let browserClient: any = null;

export function createSupabaseBrowserClient(): any {
  const config = getSupabaseConfig();

  if (!config.isConfigured) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(config.url, config.anonKey);
  }

  return browserClient;
}