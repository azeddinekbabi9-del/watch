"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { StoreSettings } from "@/types/database";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    store_name: settings.store_name,
    logo_url: settings.logo_url ?? "",
    main_color: settings.main_color,
    currency: settings.currency,
    store_phone: settings.store_phone ?? "",
    store_description: settings.store_description ?? "",
    admin_whatsapp_phone: settings.admin_whatsapp_phone,
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    hero_image_url: settings.hero_image_url ?? "",
    delivery_text: settings.delivery_text,
    facebook_url: settings.facebook_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    tiktok_url: settings.tiktok_url ?? "",
    show_featured_products: settings.show_featured_products,
    show_categories: settings.show_categories,
    show_benefits: settings.show_benefits
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const visibilityFields = [
    { key: "show_featured_products", label: "Show featured products" },
    { key: "show_categories", label: "Show categories" },
    { key: "show_benefits", label: "Show benefits" }
  ] as const;

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      store_name: form.store_name.trim(),
      logo_url: form.logo_url.trim() || null,
      main_color: form.main_color,
      currency: form.currency.trim().toUpperCase(),
      store_phone: form.store_phone.trim() || null,
      store_description: form.store_description.trim() || null,
      admin_whatsapp_phone: form.admin_whatsapp_phone.trim(),
      hero_title: form.hero_title.trim(),
      hero_subtitle: form.hero_subtitle.trim(),
      hero_image_url: form.hero_image_url.trim() || null,
      delivery_text: form.delivery_text.trim(),
      facebook_url: form.facebook_url.trim() || null,
      instagram_url: form.instagram_url.trim() || null,
      tiktok_url: form.tiktok_url.trim() || null,
      show_featured_products: form.show_featured_products,
      show_categories: form.show_categories,
      show_benefits: form.show_benefits
    };

    const supabase: any = createSupabaseBrowserClient();
    if (!supabase) {
      setSaving(false);
      setError("Supabase is not configured. Check your environment variables.");
      return;
    }

    const { error: saveError } = await supabase
      .from("store_settings")
      .upsert({ id: settings.id, ...payload });

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setMessage("Settings saved.");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="w-full max-w-6xl space-y-5">
      <section className="admin-theme-card rounded-md border border-gold/20 p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-bold theme-text">Brand</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Store name</span>
            <Input
              value={form.store_name}
              onChange={(event) => update("store_name", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Logo URL</span>
            <Input
              value={form.logo_url}
              onChange={(event) => update("logo_url", event.target.value)}
            />
            <p className="text-xs leading-5 theme-muted">
              Use a clean transparent PNG, SVG, or square logo image.
            </p>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Main color</span>
            <Input
              type="color"
              value={form.main_color}
              onChange={(event) => update("main_color", event.target.value)}
              className="h-12 p-1"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Currency</span>
            <Input
              value={form.currency}
              onChange={(event) => update("currency", event.target.value.toUpperCase())}
              required
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold theme-text">Store description</span>
            <Textarea
              value={form.store_description}
              onChange={(event) => update("store_description", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="admin-theme-card rounded-md border border-gold/20 p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-bold theme-text">Contact and Ordering</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Store phone</span>
            <Input
              value={form.store_phone}
              onChange={(event) => update("store_phone", event.target.value)}
              placeholder="+212 600 000 000"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Admin WhatsApp phone</span>
            <Input
              value={form.admin_whatsapp_phone}
              onChange={(event) =>
                update("admin_whatsapp_phone", event.target.value)
              }
              placeholder="212600000000"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold theme-text">Delivery text</span>
            <Textarea
              value={form.delivery_text}
              onChange={(event) => update("delivery_text", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="admin-theme-card rounded-md border border-gold/20 p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-bold theme-text">Hero and Banner</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Hero title</span>
            <Input
              value={form.hero_title}
              onChange={(event) => update("hero_title", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Hero image URL</span>
            <Input
              value={form.hero_image_url}
              onChange={(event) => update("hero_image_url", event.target.value)}
            />
            <p className="text-xs leading-5 theme-muted">
              Desktop banner: 1600x500px. Mobile banner: 500x250px.
            </p>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold theme-text">Hero subtitle</span>
            <Textarea
              value={form.hero_subtitle}
              onChange={(event) => update("hero_subtitle", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="admin-theme-card rounded-md border border-gold/20 p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-bold theme-text">Social Links</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Facebook URL</span>
            <Input
              value={form.facebook_url}
              onChange={(event) => update("facebook_url", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">Instagram URL</span>
            <Input
              value={form.instagram_url}
              onChange={(event) => update("instagram_url", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold theme-text">TikTok URL</span>
            <Input
              value={form.tiktok_url}
              onChange={(event) => update("tiktok_url", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="admin-theme-card rounded-md border border-gold/20 p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-bold theme-text">Homepage Visibility</h3>
        <div className="mt-4 flex flex-wrap gap-4">
          {visibilityFields.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm font-semibold theme-text">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(event) => update(key, event.target.checked)}
                className="h-4 w-4 accent-[var(--store-main)]"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      {message ? (
        <p className="rounded-md bg-mint p-3 text-sm font-medium text-moss">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save settings
      </Button>
    </form>
  );
}
