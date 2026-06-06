"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/store/Logo";
import { formatPrice, productImageFallback } from "@/lib/utils";
import type { ProductWithCategory, StoreSettings } from "@/types/database";

export function SiteHeader({
  settings,
  products
}: {
  settings: StoreSettings;
  products: ProductWithCategory[];
}) {
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
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
      <Link href="/" className="rounded-md px-2 py-2 text-base font-medium text-cream/72 transition-colors duration-300 hover:text-gold md:px-0 md:py-0 md:text-sm">
        Home
      </Link>
      <Link
        href="/products"
        className="rounded-md px-2 py-2 text-base font-medium text-cream/72 transition-colors duration-300 hover:text-gold md:px-0 md:py-0 md:text-sm"
      >
        Products
      </Link>
      <Link
        href="/#categories"
        className="rounded-md px-2 py-2 text-base font-medium text-cream/72 transition-colors duration-300 hover:text-gold md:px-0 md:py-0 md:text-sm"
      >
        Categories
      </Link>
      <Link
        href="/track-order"
        className="rounded-md px-2 py-2 text-base font-medium text-cream/72 transition-colors duration-300 hover:text-gold md:px-0 md:py-0 md:text-sm"
      >
        Track Order
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-ink/94 shadow-[0_18px_42px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-all duration-500">
      <div className="container-page flex h-[68px] items-center justify-between gap-3 py-2 sm:h-[72px] sm:py-3">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 md:flex-none" aria-label="Home">
          <Logo settings={settings} size="md" textClassName="text-cream" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">{nav}</nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-gold/35 bg-white/8 text-cream hover:bg-gold/15"
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-cream hover:bg-gold/15 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="animate-slide-up border-t border-gold/15 bg-ink px-4 py-4 md:hidden">
          <div className="container-page flex flex-col gap-4">{nav}</div>
        </nav>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
          <div className="mx-auto max-w-2xl animate-slide-up rounded-md border border-gold/25 bg-ink p-3 text-cream shadow-luxury sm:p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gold" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                  placeholder="Search watches by name"
                  className="focus-ring h-12 w-full rounded-md border border-gold/25 bg-white pl-9 pr-3 text-base text-ink placeholder:text-ink/40 md:h-11 md:text-sm"
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
                  No product found.
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
                    className="luxury-card-hover grid grid-cols-[64px_1fr] items-center gap-3 rounded-md border border-gold/20 bg-white/8 p-3 sm:grid-cols-[72px_1fr_auto]"
                  >
                    <img
                      src={product.image_url || productImageFallback}
                      alt={product.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-cream">{product.name}</p>
                      <p className="mt-1 text-sm text-cream/60">
                        {formatPrice(product.price, settings.currency)}
                      </p>
                    </div>
                    <span className="hidden rounded-md bg-gold px-3 py-2 text-xs font-bold text-ink sm:inline-flex">
                      View
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
