"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useCart } from "@/components/store/CartProvider";
import { getCartTotal } from "@/lib/cart";
import { getSupabaseConfig } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { buildOrderMessage, createWhatsAppUrl } from "@/lib/whatsapp";
import { createClientUuid, createOrderAccessToken, formatPrice } from "@/lib/utils";
import type { StoreSettings } from "@/types/database";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Full name is required."),
  customer_phone: z.string().min(6, "Phone number is required."),
  customer_city: z.string().min(2, "City is required."),
  customer_address: z.string().min(6, "Full address is required."),
  customer_notes: z.string().optional()
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const initialForm: CheckoutForm = {
  customer_name: "",
  customer_phone: "",
  customer_city: "",
  customer_address: "",
  customer_notes: ""
};

export function CheckoutClient({ settings }: { settings: StoreSettings }) {
  const cart = useCart();
  const [form, setForm] = React.useState<CheckoutForm>(initialForm);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [whatsappUrl, setWhatsappUrl] = React.useState("");
  const [trackingOrderId, setTrackingOrderId] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setWhatsappUrl("");
    setTrackingOrderId("");

    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Please complete the form.");
      return;
    }

    if (cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const config = getSupabaseConfig();
      let orderItems: any[] = cart.items;
      let orderTotal = cart.total;
      const orderId = createClientUuid();

      if (config.isConfigured) {
        const supabase: any = createSupabaseBrowserClient();

        if (!supabase) {
          throw new Error("Supabase is not configured. Check your environment variables.");
        }

        const productIds = cart.items.map((item: any) => item.id);

        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, price, stock_status")
          .in("id", productIds)
          .eq("is_active", true);

        if (productsError) {
          throw new Error(productsError.message);
        }

        const productsById = new Map(
          (products ?? []).map((item: any) => [item.id, item])
        );

        const unavailableItem = cart.items.find((item: any) => {
          const product: any = productsById.get(item.id);
          return !product || product.stock_status !== "available";
        });

        if (unavailableItem) {
          throw new Error(
            `${unavailableItem.name} is no longer available. Remove it from your cart and try again.`
          );
        }

        orderItems = cart.items.map((item: any) => {
          const product: any = productsById.get(item.id);

          return {
            ...item,
            name: product?.name ?? item.name,
            price: Number(product?.price ?? item.price),
            stock_status: product?.stock_status ?? item.stock_status
          };
        });

        orderTotal = getCartTotal(orderItems);

        const orderAccessToken = createOrderAccessToken();

        const { error: orderError } = await supabase.from("orders").insert({
          id: orderId,
          order_access_token: orderAccessToken,
          customer_name: parsed.data.customer_name,
          customer_phone: parsed.data.customer_phone,
          customer_city: parsed.data.customer_city,
          customer_address: parsed.data.customer_address,
          customer_notes: parsed.data.customer_notes || null,
          total_amount: orderTotal,
          status: "pending"
        });

        if (orderError) {
          throw new Error(orderError.message || "Could not create order.");
        }

        const { error: itemsError } = await supabase.from("order_items").insert(
          orderItems.map((item: any) => ({
            order_id: orderId,
            order_access_token: orderAccessToken,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity
          }))
        );

        if (itemsError) {
          throw new Error(itemsError.message);
        }
      }

      const message = buildOrderMessage({
        orderId,
        customer: parsed.data,
        items: orderItems,
        total: orderTotal,
        currency: settings.currency
      });

      cart.clearCart();
      setForm(initialForm);
      setTrackingOrderId(orderId);

      const nextWhatsappUrl = settings.admin_whatsapp_phone
        ? createWhatsAppUrl(settings.admin_whatsapp_phone, message)
        : "";

      setWhatsappUrl(nextWhatsappUrl);
      setSuccess(
        config.isConfigured
          ? "Order saved. WhatsApp is opening with the full order details."
          : "Demo order ready. Configure Supabase to save real orders."
      );

      if (nextWhatsappUrl) {
        window.open(nextWhatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Order submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.items.length === 0 && !success) {
    return (
      <section className="container-page page-transition py-12">
        <EmptyState
          title="No products to checkout"
          description="Add products to your cart before submitting an order."
        />
        <div className="mt-6 flex justify-center">
          <Link
            href="/products"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  if (cart.items.length === 0 && success) {
    return (
      <section className="container-page page-transition py-12">
        <div className="luxury-reveal mx-auto max-w-xl rounded-md border border-gold/20 bg-cream p-8 text-center shadow-luxury">
          <CheckCircle2 className="mx-auto h-12 w-12 text-gold" aria-hidden />
          <h1 className="mt-4 text-2xl font-bold text-ink">Order submitted</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">{success}</p>

          {trackingOrderId ? (
            <p className="mt-3 rounded-md bg-gold/10 px-3 py-2 text-sm font-semibold text-ink">
              Order ID: {trackingOrderId}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {whatsappUrl ? (
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Open WhatsApp
              </Link>
            ) : null}

            <Link
              href={`/track-order?orderId=${trackingOrderId}`}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Track order
            </Link>

            <Link
              href="/products"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page page-transition py-10">
      <div className="hero-reveal mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Checkout
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink md:text-5xl">
          Complete your order
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={submitOrder}
          className="luxury-reveal rounded-md border border-gold/15 bg-cream p-5 shadow-soft"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">Full name</span>
              <Input
                value={form.customer_name}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    customer_name: event.target.value
                  }))
                }
                placeholder="Your name"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">Phone number</span>
              <Input
                value={form.customer_phone}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    customer_phone: event.target.value
                  }))
                }
                placeholder="+212 6..."
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">City</span>
              <Input
                value={form.customer_city}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    customer_city: event.target.value
                  }))
                }
                placeholder="Casablanca"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-ink">Full address</span>
              <Input
                value={form.customer_address}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    customer_address: event.target.value
                  }))
                }
                placeholder="Street, building, floor..."
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-ink">Notes</span>
              <Textarea
                value={form.customer_notes}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    customer_notes: event.target.value
                  }))
                }
                placeholder="Delivery time, color preference, or extra details"
              />
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
              {error}
            </p>
          ) : null}

          {success ? (
            <div className="mt-4 rounded-md bg-mint p-3 text-sm font-medium text-moss">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </p>

              {whatsappUrl ? (
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex font-bold underline"
                >
                  Open WhatsApp
                </Link>
              ) : null}
            </div>
          ) : null}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit order
          </Button>
        </form>

        <aside className="luxury-reveal h-fit rounded-md border border-gold/15 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Products summary</h2>

          <div className="mt-5 space-y-4">
            {cart.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-ink/10 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="mt-1 text-sm text-ink/55">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="text-sm font-bold text-ink">
                  {formatPrice(item.price * item.quantity, settings.currency)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-between border-t border-ink/10 pt-4 text-lg font-bold text-ink">
            <span>Total</span>
            <span>{formatPrice(cart.total, settings.currency)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}