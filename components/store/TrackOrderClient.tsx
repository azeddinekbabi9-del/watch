"use client";

import * as React from "react";
import Link from "next/link";
import { Hash, Loader2, Phone, Search } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { getSupabaseConfig } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { cn, formatPrice } from "@/lib/utils";
import type { Json, OrderStatus, TrackOrderResult } from "@/types/database";

type TrackMode = "phone" | "orderId";

const phoneTrackSchema = z.object({
  phone: z.string().trim().min(6, "Enter a valid phone number.")
});

const orderIdTrackSchema = z.object({
  orderId: z.string().trim().uuid("Enter a valid order ID.")
});

interface ParsedOrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

function statusTone(status: OrderStatus) {
  if (status === "delivered") {
    return "success" as const;
  }
  if (status === "cancelled") {
    return "danger" as const;
  }
  if (status === "pending") {
    return "warning" as const;
  }
  return "info" as const;
}

function parseItems(value: Json): ParsedOrderItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }
      const record = item as Record<string, Json | undefined>;

      return {
        product_name: String(record.product_name ?? ""),
        quantity: Number(record.quantity ?? 0),
        unit_price: Number(record.unit_price ?? 0),
        total_price: Number(record.total_price ?? 0)
      };
    })
    .filter((item): item is ParsedOrderItem => Boolean(item?.product_name));
}

export function TrackOrderClient({
  initialOrderId,
  currency,
  adminWhatsappPhone
}: {
  initialOrderId?: string;
  currency: string;
  adminWhatsappPhone: string;
}) {
  const [mode, setMode] = React.useState<TrackMode>(
    initialOrderId ? "orderId" : "phone"
  );
  const [orderId, setOrderId] = React.useState(initialOrderId ?? "");
  const [phone, setPhone] = React.useState("");
  const [results, setResults] = React.useState<TrackOrderResult[]>([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function selectMode(nextMode: TrackMode) {
    setMode(nextMode);
    setError("");
    setResults([]);
  }

  async function track(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResults([]);

    const parsed =
      mode === "phone"
        ? phoneTrackSchema.safeParse({ phone })
        : orderIdTrackSchema.safeParse({ orderId: orderId.trim() });

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Check your order details.");
      return;
    }

    if (!getSupabaseConfig().isConfigured) {
      setError("Connect Supabase to track real orders.");
      return;
    }

    setLoading(true);
    const supabase: any = createSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      setError("Supabase is not configured. Check your environment variables.");
      return;
    }

    const { data, error: trackError } = await supabase.rpc("track_order", {
      lookup_order_id: mode === "orderId" ? orderId.trim() : undefined,
      lookup_customer_phone: mode === "phone" ? phone.trim() : undefined
    });
    setLoading(false);

    if (trackError) {
      setError(trackError.message);
      return;
    }

    const trackedOrders = data ?? [];
    if (trackedOrders.length === 0) {
      setError(
        mode === "phone"
          ? "No orders were found for that phone number."
          : "Order not found."
      );
      return;
    }

    setResults(trackedOrders);
  }
  const contactUrl = adminWhatsappPhone
    ? createWhatsAppUrl(adminWhatsappPhone, "Hello, I need help tracking my order.")
    : "";

  return (
    <section className="page-transition">
      <div className="luxury-dark-surface border-b border-gold/20 py-10 text-cream sm:py-12 md:py-16">
        <div className="container-page hero-reveal mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
            Track Order
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-cream sm:text-5xl md:text-6xl">
            Follow your timepiece
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-cream/68 md:text-base">
            Choose one tracking method, then enter the matching detail from your order.
          </p>
          <div className="gold-divider mx-auto mt-6 w-36" />
        </div>
      </div>

      <div className="container-page grid gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
        <form
          onSubmit={track}
          className="luxury-reveal h-fit rounded-md border border-gold/25 bg-ink p-4 text-cream shadow-luxury sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              {
                value: "phone" as const,
                label: "Track by Phone",
                description: "Show all orders using one phone number.",
                icon: Phone
              },
              {
                value: "orderId" as const,
                label: "Track by Order ID",
                description: "Show one specific order.",
                icon: Hash
              }
            ].map((option) => {
              const Icon = option.icon;
              const active = mode === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectMode(option.value)}
                  className={cn(
                    "focus-ring rounded-md border p-4 text-left transition-all duration-300",
                    active
                      ? "border-gold bg-gold-sheen text-ink shadow-soft"
                      : "border-gold/20 bg-white/6 text-cream hover:border-gold/60 hover:bg-white/10"
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <Icon className={cn("h-4 w-4", active ? "text-ink" : "text-gold")} aria-hidden />
                    {option.label}
                  </span>
                  <span className={cn("mt-2 block text-xs leading-5", active ? "text-ink/65" : "text-cream/58")}>
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-4">
            {mode === "phone" ? (
              <label className="space-y-2">
                <span className="text-sm font-semibold text-cream">Phone number</span>
                <Input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+212 6..."
                  autoComplete="tel"
                />
              </label>
            ) : (
              <label className="space-y-2">
                <span className="text-sm font-semibold text-cream">Order ID</span>
                <Input
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </label>
            )}
          </div>

          {error ? (
            <div className="mt-4 break-words rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
              <p>{error}</p>
              {(error === "Order not found." ||
                error === "No orders were found for that phone number.") &&
              contactUrl ? (
                <Link
                  href={contactUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex rounded-md bg-[#25D366] px-3 py-2 text-sm font-bold text-white"
                >
                  Contact on WhatsApp
                </Link>
              ) : null}
            </div>
          ) : null}

          <Button type="submit" className="mt-5 w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Track order
          </Button>
        </form>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => {
              const items = parseItems(result.order_items);
              const shortId = result.id.slice(0, 8).toUpperCase();

              return (
                <article
                  key={result.id}
                  className="luxury-reveal rounded-md border border-gold/20 bg-white/94 p-5 shadow-soft"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm text-ink/55">Order #{shortId}</p>
                      <h2 className="mt-1 break-all text-sm font-semibold text-ink sm:text-lg">
                        {result.id}
                      </h2>
                      <p className="mt-2 text-sm text-ink/60">
                        Placed {new Date(result.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge tone={statusTone(result.status)}>{result.status}</Badge>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-gold/15 bg-luxury-surface p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                        Customer
                      </p>
                      <p className="mt-2 font-semibold text-ink">
                        {result.customer_name}
                      </p>
                      <p className="text-sm text-ink/60">{result.customer_phone}</p>
                      <p className="text-sm text-ink/60">{result.customer_city}</p>
                      {result.customer_address ? (
                        <p className="text-sm text-ink/60">{result.customer_address}</p>
                      ) : null}
                    </div>
                    <div className="rounded-md border border-gold/15 bg-luxury-surface p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                        Total
                      </p>
                      <p className="mt-2 text-xl font-semibold text-ink">
                        {formatPrice(Number(result.total_amount), currency)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 divide-y divide-gold/15">
                    {items.map((item) => (
                      <div
                        key={`${result.id}-${item.product_name}-${item.quantity}`}
                        className="flex items-start justify-between gap-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-ink">{item.product_name}</p>
                          <p className="text-sm text-ink/55">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="shrink-0 whitespace-nowrap font-semibold text-ink">
                          {formatPrice(item.total_price, currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Order status will appear here"
            description="Your order details stay private. We only show matching orders for the order ID or phone number you enter."
            className="luxury-reveal bg-white/88 shadow-soft"
          />
        )}
      </div>
    </section>
  );
}
