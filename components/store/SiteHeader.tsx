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
      <Link href="/" className="text-sm font-medium text-ink/70 transition-colors duration-300 hover:text-gold">
        Home
      </Link>
      <Link
        href="/products"
        className="text-sm font-medium text-ink/70 transition-colors duration-300 hover:text-gold"
      >
        Products
      </Link>
      <Link
        href="/#categories"
        className="text-sm font-medium text-ink/70 transition-colors duration-300 hover:text-gold"
      >
        Categories
      </Link>
      <Link
        href="/track-order"
        className="text-sm font-medium text-ink/70 transition-colors duration-300 hover:text-gold"
      >
        Track Order
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-cream/92 shadow-[0_10px_35px_rgba(17,16,14,0.06)] backdrop-blur-xl transition-all duration-500">
      <div className="container-page flex h-[72px] items-center justify-between py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Home">
          <Logo settings={settings} size="md" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">{nav}</nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="bg-white/70"
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="animate-slide-up border-t border-gold/15 bg-cream px-4 py-4 md:hidden">
          <div className="container-page flex flex-col gap-4">{nav}</div>
        </nav>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-50 bg-ink/55 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl animate-slide-up rounded-md border border-gold/20 bg-cream p-4 shadow-luxury">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink/45" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                  placeholder="Search watches by name"
                  className="focus-ring h-11 w-full rounded-md border border-gold/20 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/40"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              {query.trim() && results.length === 0 ? (
                <p className="rounded-md border border-dashed border-gold/30 p-6 text-center text-sm text-ink/60">
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
                    className="luxury-card-hover grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-md border border-gold/15 bg-white p-3"
                  >
                    <img
                      src={product.image_url || productImageFallback}
                      alt={product.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{product.name}</p>
                      <p className="mt-1 text-sm text-ink/60">
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
