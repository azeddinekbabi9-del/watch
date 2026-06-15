"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import { WhatsAppFloatingButton } from "@/components/store/WhatsAppFloatingButton";
import type { ProductWithCategory, StoreSettings } from "@/types/database";

export function CustomerChrome({
  children,
  settings,
  searchProducts
}: {
  children: React.ReactNode;
  settings: StoreSettings;
  searchProducts: ProductWithCategory[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const style = { "--store-main": settings.main_color } as CSSProperties;

  if (isAdmin) {
    return <div style={style}>{children}</div>;
  }

  return (
    <div style={style} className="min-h-screen min-h-[100svh] bg-[#050505] text-cream">
      <SiteHeader settings={settings} products={searchProducts} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <WhatsAppFloatingButton phone={settings.admin_whatsapp_phone} />
    </div>
  );
}
