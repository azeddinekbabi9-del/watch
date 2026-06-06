import Link from "next/link";
import { Facebook, Instagram, Music2, Phone } from "lucide-react";
import { Logo } from "@/components/store/Logo";
import type { StoreSettings } from "@/types/database";

export function SiteFooter({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="luxury-dark-surface border-t border-gold/20 text-cream">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo settings={settings} size="sm" textClassName="text-cream" />
          <p className="mt-4 max-w-md text-sm leading-6 text-cream/65">
            {settings.store_description || settings.delivery_text}
          </p>
          {settings.store_phone ? (
            <Link
              href={`tel:${settings.store_phone}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors duration-300 hover:text-cream"
            >
              <Phone className="h-4 w-4" />
              {settings.store_phone}
            </Link>
          ) : null}
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Shop</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-cream/65">
            <Link href="/products" className="transition-colors duration-300 hover:text-gold">All products</Link>
            <Link href="/track-order" className="transition-colors duration-300 hover:text-gold">Track Order</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Social</h3>
          <div className="mt-3 flex items-center gap-2">
            {settings.facebook_url ? (
              <Link
                href={settings.facebook_url}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-md bg-cream/10 text-cream/70 transition-colors duration-300 hover:bg-gold hover:text-ink"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            ) : null}
            {settings.instagram_url ? (
              <Link
                href={settings.instagram_url}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-md bg-cream/10 text-cream/70 transition-colors duration-300 hover:bg-gold hover:text-ink"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            ) : null}
            {settings.tiktok_url ? (
              <Link
                href={settings.tiktok_url}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-md bg-cream/10 text-cream/70 transition-colors duration-300 hover:bg-gold hover:text-ink"
                aria-label="TikTok"
              >
                <Music2 className="h-5 w-5" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
