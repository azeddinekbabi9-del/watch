import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/config";

type CookieToSet = {
  name: string;
  value: string;
  options?: any;
};

export function createSupabaseServerClient(): any {
  const cookieStore = cookies();
  const config = getSupabaseConfig();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components can read cookies but cannot always mutate them.
        }
      }
    }
  });
}