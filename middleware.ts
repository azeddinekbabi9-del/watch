import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_BASE_PATH,
  ADMIN_LOGIN_PATH,
  isAdminPath,
  isLegacyAdminPath
} from "@/lib/admin-routes";
import { getSupabaseConfig } from "@/lib/config";
import type { Database } from "@/types/database";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

function getAdminEmailAllowlist() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isLegacyAdminPath(pathname)) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === ADMIN_LOGIN_PATH;
  const config = getSupabaseConfig();

  if (!config.isConfigured) {
    if (isLoginPage) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createServerClient<Database, "public", Database["public"]>(
    config.url,
    config.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    if (isLoginPage) {
      return response;
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedEmails = getAdminEmailAllowlist();
  const userEmail = String(user.email ?? "").toLowerCase();

  if (allowedEmails.length > 0 && !allowedEmails.includes(userEmail)) {
    if (isLoginPage) {
      return response;
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN_PATH;
    loginUrl.searchParams.set("error", "not-authorized");
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = ADMIN_BASE_PATH;
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/wqitakadmin098/:path*"]
};
