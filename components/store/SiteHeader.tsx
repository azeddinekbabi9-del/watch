"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { PreferenceControls } from "@/components/PreferenceControls";
import { Logo } from "@/components/store/Logo";
import { ProductImageFrame } from "@/components/store/ProductImageFrame";
import type { StoreLanguage, StoreTheme } from "@/lib/preferences";
import { textFromMap, type StoreTextMap } from "@/lib/store-texts";
import { formatPrice, productImageFallback } from "@/lib/utils";
import type { ProductWithCategory, StoreSettings } from "@/types/database";

export function SiteHeader({
  settings,
  products,
  language,
  theme,
  texts
}: {
  settings: StoreSettings;
  products: ProductWithCategory[];
  language: StoreLanguage;
  theme: StoreTheme;
  texts: StoreTextMap;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const brandSettings = { ...settings, store_name: "WQITAK" };
  const t = (key: Parameters<typeof textFromMap>[1]) =>
    textFromMap(texts, key, language);
  const results = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return products
      .filter((product) => product.name.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [products, query]);

  const nav = (
    <>
      <Link href="/" className="rounded-md px-2 py-2 text-base font-semibold text-cream/72 transition-colors duration-300 hover:text-champagne md:px-0 md:py-0 md:text-sm">
        {t("nav_home")}
      </Link>
      <Link
        href="/products"
        className="rounded-md px-2 py-2 text-base font-semibold text-cream/72 transition-colors duration-300 hover:text-champagne md:px-0 md:py-0 md:text-sm"
      >
        {t("nav_products")}
      </Link>
      <Link
        href="/track-order"
        className="rounded-md px-2 py-2 text-base font-semibold text-cream/72 transition-colors duration-300 hover:text-champagne md:px-0 md:py-0 md:text-sm"
      >
        {t("nav_track")}
      </Link>
    </>
  );

  return (
    <header className="site-header sticky top-0 z-40 border-b border-gold/20 bg-[var(--panel-solid)] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-500">
      <div className="container-page flex h-[68px] items-center justify-between gap-3 py-2 sm:h-[72px] sm:py-3">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 md:flex-none" aria-label="Home">
          <Logo settings={brandSettings} size="md" textClassName="text-champagne" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">{nav}</nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden md:block">
            <PreferenceControls
              language={language}
              theme={theme}
              languageControl="dropdown"
              showThemeToggle={false}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-gold/35 bg-white/5 text-champagne hover:bg-gold/15"
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-champagne hover:bg-gold/15 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="animate-slide-up border-t border-gold/15 bg-[var(--panel-solid)] px-4 py-4 md:hidden">
          <div className="container-page flex flex-col gap-4">
            {nav}
            <PreferenceControls
              language={language}
              theme={theme}
              languageControl="dropdown"
              showThemeToggle={false}
            />
          </div>
        </nav>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/78 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
          <div className="luxury-panel mx-auto max-w-2xl animate-slide-up rounded-md p-3 text-cream sm:p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gold" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                  placeholder={t("search_placeholder")}
                  className="focus-ring h-12 w-full rounded-md border border-gold/25 bg-[#0d0d0d] pl-9 pr-3 text-base text-cream placeholder:text-cream/40 md:h-11 md:text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-cream hover:bg-gold/15"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-4 max-h-[70svh] overflow-y-auto">
              {query.trim() && results.length === 0 ? (
                <p className="rounded-md border border-dashed border-gold/30 p-6 text-center text-sm text-cream/62">
                  {t("search_empty")}
                </p>
              ) : null}
              <div className="space-y-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                    className="luxury-card-hover grid grid-cols-[72px_1fr] items-center gap-3 rounded-md border border-gold/20 bg-white/[0.055] p-3 sm:grid-cols-[80px_1fr_auto]"
                  >
                    <ProductImageFrame
                      src={product.image_url || productImageFallback}
                      alt={product.name}
                      className="h-[72px] w-[72px] shrink-0 rounded-md sm:h-20 sm:w-20"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-cream">{product.name}</p>
                      <p className="mt-1 text-sm font-bold text-champagne">
                        {formatPrice(product.price, settings.currency)}
                      </p>
                    </div>
                    <span className="hidden rounded-md border border-champagne/50 bg-gold-sheen px-3 py-2 text-xs font-bold text-ink sm:inline-flex">
                      {t("order_now")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
