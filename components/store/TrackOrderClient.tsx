"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { getSupabaseConfig } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import type { Json, OrderStatus, TrackOrderResult } from "@/types/database";

const trackSchema = z.object({
  orderId: z.string().trim(),
  phone: z.string().trim()
}).superRefine((value, context) => {
  if (!value.orderId && !value.phone) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter an order ID or phone number."
    });
  }

  if (value.orderId && !z.string().uuid().safeParse(value.orderId).success) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter a valid order ID.",
      path: ["orderId"]
    });
  }

  if (value.phone && value.phone.length < 6) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter a valid phone number.",
      path: ["phone"]
    });
  }
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
  const [orderId, setOrderId] = React.useState(initialOrderId ?? "");
  const [phone, setPhone] = React.useState("");
  const [results, setResults] = React.useState<TrackOrderResult[]>([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function track(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResults([]);

    const parsed = trackSchema.safeParse({ orderId: orderId.trim(), phone });
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
    const { data, error: trackError } = await supabase.rpc("track_order", {
      lookup_order_id: parsed.data.orderId || undefined,
      lookup_customer_phone: parsed.data.phone || undefined
    });
    setLoading(false);

    if (trackError) {
      setError(trackError.message);
      return;
    }

    const trackedOrders = data ?? [];
    if (trackedOrders.length === 0) {
      setError("Order not found.");
      return;
    }

    setResults(trackedOrders);
  }
  const contactUrl = adminWhatsappPhone
    ? createWhatsAppUrl(adminWhatsappPhone, "Hello, I need help tracking my order.")
    : "";

  return (
    <section className="container-page page-transition py-10">
      <div className="hero-reveal mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Track Order
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink md:text-5xl">
          Follow your timepiece
        </h1>
        <p className="mt-4 text-sm leading-7 text-ink/65">
          Enter your order ID or the phone number used for your order.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form
          onSubmit={track}
          className="luxury-reveal h-fit rounded-md border border-gold/20 bg-cream p-5 shadow-soft"
        >
          <div className="space-y-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">Order ID</span>
              <Input
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">Phone number</span>
              <Input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+212 6..."
              />
            </label>
          </div>

          {error ? (
            <div className="mt-4 rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
              <p>{error}</p>
              {error === "Order not found." && contactUrl ? (
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
                  className="luxury-reveal rounded-md border border-gold/20 bg-white p-5 shadow-soft"
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
                    <div className="rounded-md bg-cloud p-4">
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
                    <div className="rounded-md bg-cloud p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                        Total
                      </p>
                      <p className="mt-2 text-xl font-semibold text-ink">
                        {formatPrice(Number(result.total_amount), currency)}
                      </p>
                      {result.customer_notes ? (
                        <p className="mt-2 text-sm text-ink/60">
                          Notes: {result.customer_notes}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 divide-y divide-ink/10">
                    {items.map((item) => (
                      <div
                        key={`${result.id}-${item.product_name}-${item.quantity}`}
                        className="flex items-start justify-between gap-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-ink">{item.product_name}</p>
                          <p className="text-sm text-ink/55">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-ink">
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
            className="luxury-reveal bg-cream"
          />
        )}
      </div>
    </section>
  );
}
