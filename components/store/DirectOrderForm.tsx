"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, Send } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSupabaseConfig } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { createClientUuid, createOrderAccessToken, formatPrice } from "@/lib/utils";
import type { ProductWithCategory, StoreSettings } from "@/types/database";

const directOrderSchema = z.object({
  customer_name: z.string().trim().min(2, "Full name is required."),
  customer_phone: z.string().trim().min(6, "Phone number is required."),
  customer_city: z.string().trim().min(2, "City is required."),
  customer_address: z.string().trim().optional()
});

type DirectOrderFormState = z.infer<typeof directOrderSchema>;

const initialForm: DirectOrderFormState = {
  customer_name: "",
  customer_phone: "",
  customer_city: "",
  customer_address: ""
};

function buildDirectOrderMessage({
  storeName,
  orderId,
  productName,
  quantity,
  price,
  total,
  currency,
  customer
}: {
  storeName: string;
  orderId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  currency: string;
  customer: DirectOrderFormState;
}) {
  return [
    `${storeName} order`,
    `Order ID: ${orderId}`,
    "",
    `Product: ${productName}`,
    `Quantity: ${quantity}`,
    `Price: ${price} ${currency}`,
    `Total: ${total} ${currency}`,
    "",
    `Customer: ${customer.customer_name}`,
    `Phone: ${customer.customer_phone}`,
    `City: ${customer.customer_city}`,
    customer.customer_address ? `Address: ${customer.customer_address}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

export function DirectOrderForm({
  product,
  settings
}: {
  product: ProductWithCategory;
  settings: StoreSettings;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const [form, setForm] = React.useState<DirectOrderFormState>(initialForm);
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const unavailable = product.stock_status === "out_of_stock";
  const total = product.price * quantity;

  function update<K extends keyof DirectOrderFormState>(
    key: K,
    value: DirectOrderFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (unavailable) {
      setError("This product is currently out of stock.");
      return;
    }

    const parsed = directOrderSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Please complete the form.");
      return;
    }

    setSubmitting(true);

    try {
      const config = getSupabaseConfig();
      const nextOrderId = createClientUuid();
      let currentProductName = product.name;
      let currentPrice = product.price;

      if (config.isConfigured) {
        const supabase: any = createSupabaseBrowserClient();
        const { data: currentProduct, error: productError } = await supabase
          .from("products")
          .select("id, name, price, stock_status, is_active")
          .eq("id", product.id)
          .maybeSingle();

        if (productError) {
          throw new Error(productError.message);
        }

        if (
          !currentProduct ||
          !currentProduct.is_active ||
          currentProduct.stock_status !== "available"
        ) {
          throw new Error("This product is no longer available.");
        }

        currentProductName = currentProduct.name;
        currentPrice = Number(currentProduct.price);
        const orderAccessToken = createOrderAccessToken();
        const nextTotal = currentPrice * quantity;

        const { error: orderError } = await supabase.from("orders").insert({
          id: nextOrderId,
          order_access_token: orderAccessToken,
          customer_name: parsed.data.customer_name,
          customer_phone: parsed.data.customer_phone,
          customer_city: parsed.data.customer_city,
          customer_address: parsed.data.customer_address || "",
          customer_notes: null,
          total_amount: nextTotal,
          status: "pending"
        });

        if (orderError) {
          throw new Error(orderError.message);
        }

        const { error: itemError } = await supabase.from("order_items").insert({
          order_id: nextOrderId,
          order_access_token: orderAccessToken,
          product_id: product.id,
          product_name: currentProductName,
          quantity,
          unit_price: currentPrice,
          total_price: nextTotal
        });

        if (itemError) {
          throw new Error(itemError.message);
        }
      }

      const nextTotal = currentPrice * quantity;
      const message = buildDirectOrderMessage({
        storeName: settings.store_name,
        orderId: nextOrderId,
        productName: currentProductName,
        quantity,
        price: currentPrice,
        total: nextTotal,
        currency: settings.currency,
        customer: parsed.data
      });
      const nextWhatsappUrl = settings.admin_whatsapp_phone
        ? createWhatsAppUrl(settings.admin_whatsapp_phone, message)
        : "";

      if (nextWhatsappUrl) {
        window.open(nextWhatsappUrl, "_blank", "noopener,noreferrer");
      }

      router.push(`/thank-you?orderId=${encodeURIComponent(nextOrderId)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Order submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 rounded-md border border-gold/20 bg-white p-5">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Direct Order
        </p>
        <h2 className="mt-2 text-xl font-semibold text-ink">
          Order this watch now
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Full name</span>
          <Input
            value={form.customer_name}
            onChange={(event) => update("customer_name", event.target.value)}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Phone number</span>
          <Input
            value={form.customer_phone}
            onChange={(event) => update("customer_phone", event.target.value)}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">City</span>
          <Input
            value={form.customer_city}
            onChange={(event) => update("customer_city", event.target.value)}
            required
          />
        </label>
        <div>
          <span className="text-sm font-semibold text-ink">Quantity</span>
          <div className="mt-2 flex w-fit items-center rounded-md border border-ink/15 bg-cream">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="flex h-10 min-w-12 items-center justify-center font-bold">
              {quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((value) => value + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Address</span>
          <Input
            value={form.customer_address}
            onChange={(event) => update("customer_address", event.target.value)}
            placeholder="Optional"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-md bg-cloud p-3 text-sm">
        <span className="font-semibold text-ink/65">Total</span>
        <span className="text-lg font-bold text-ink">
          {formatPrice(total, settings.currency)}
        </span>
      </div>

      {error ? (
        <p className="mt-4 rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        className="mt-5 w-full"
        disabled={submitting || unavailable}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {unavailable ? "Out of stock" : "Submit order"}
      </Button>
    </form>
  );
}
