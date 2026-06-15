"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import { WhatsAppFloatingButton } from "@/components/store/WhatsAppFloatingButton";
import type { StoreLanguage, StoreTheme } from "@/lib/preferences";
import type { StoreTextMap } from "@/lib/store-texts";
import type { ProductWithCategory, StoreSettings } from "@/types/database";

export function CustomerChrome({
  children,
  settings,
  searchProducts,
  language,
  theme,
  texts
}: {
  children: React.ReactNode;
  settings: StoreSettings;
  searchProducts: ProductWithCategory[];
  language: StoreLanguage;
  theme: StoreTheme;
  texts: StoreTextMap;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const style = { "--store-main": settings.main_color } as CSSProperties;

  if (isAdmin) {
    return <div style={style}>{children}</div>;
  }

  return (
    <div style={style} className="min-h-screen min-h-[100svh] bg-[var(--page-bg)] text-[var(--text-main)]">
      <SiteHeader
        settings={settings}
        products={searchProducts}
        language={language}
        theme={theme}
        texts={texts}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} language={language} texts={texts} />
      <WhatsAppFloatingButton phone={settings.admin_whatsapp_phone} />
    </div>
  );
}
