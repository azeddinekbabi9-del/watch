import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/config";
import type { Database } from "@/types/database";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

type SupabaseServerClient = ReturnType<
  typeof createServerClient<Database, "public", Database["public"]>
>;

export function createSupabaseServerClient(): SupabaseServerClient {
  const cookieStore = cookies();
  const config = getSupabaseConfig();

  return createServerClient<Database, "public", Database["public"]>(
    config.url,
    config.anonKey,
    {
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
    }
  );
}
