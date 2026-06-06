"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/store/Logo";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

async function signOut() {
  const supabaseClient: any = createSupabaseBrowserClient();

  if (supabaseClient === null) {
    router.push("/admin/login");
    return;
  }

  await supabaseClient.auth.signOut();
  router.push("/admin/login");
  router.refresh();
}

  return (
    <div className="min-h-screen min-h-[100svh] bg-[radial-gradient(circle_at_top_right,rgba(201,154,74,0.16),transparent_26rem),#fbf7ef]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-gold/20 bg-ink p-4 text-cream shadow-[18px_0_60px_rgba(17,16,14,0.22)] lg:block">
        <Link href="/admin" className="block px-2 py-3" aria-label="Admin dashboard">
          <Logo size="sm" textClassName="text-cream" />
        </Link>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === item.href
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-300",
                  active
                    ? "bg-gold-sheen text-ink shadow-soft"
                    : "text-cream/65 hover:bg-cream/10 hover:text-cream"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-gold/20 bg-cream/92 shadow-[0_10px_35px_rgba(17,16,14,0.06)] backdrop-blur-xl transition-all duration-500">
          <div className="flex min-h-16 items-center justify-between gap-3 px-3 sm:px-4 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Admin
              </p>
              <h1 className="truncate text-lg font-bold text-ink">Store manager</h1>
            </div>
            <div className="flex min-w-0 max-w-[72vw] items-center gap-2 overflow-x-auto">
              <div className="flex shrink-0 gap-1 lg:hidden">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/admin"
                      ? pathname === item.href
                      : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "focus-ring flex h-10 w-10 items-center justify-center rounded-md",
                        active ? "bg-gold text-ink" : "bg-ink/5 text-ink/65"
                      )}
                      aria-label={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
              <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={signOut}>
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </Button>
            </div>
          </div>
        </header>
        <main className="min-w-0 px-3 py-6 sm:px-4 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
