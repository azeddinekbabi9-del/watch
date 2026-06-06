import Link from "next/link";
import { CheckCircle2, MessageCircle, PackageCheck, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { getStoreSettings, getTrackedOrderById } from "@/lib/data";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import type { Json, OrderStatus } from "@/types/database";

export const dynamic = "force-dynamic";

function statusTone(status: OrderStatus | "pending_confirmation") {
  if (status === "delivered") {
    return "success" as const;
  }
  if (status === "cancelled") {
    return "danger" as const;
  }
  if (status === "pending" || status === "pending_confirmation") {
    return "warning" as const;
  }
  return "info" as const;
}

interface ParsedOrderItem {
  product_name: string;
  quantity: number;
  total_price: number;
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
        total_price: Number(record.total_price ?? 0)
      };
    })
    .filter((item): item is ParsedOrderItem => Boolean(item?.product_name));
}

export default async function ThankYouPage({
  searchParams
}: {
  searchParams?: { orderId?: string };
}) {
  const settings = await getStoreSettings();
  const orderId = searchParams?.orderId?.trim() ?? "";
  const order = orderId ? await getTrackedOrderById(orderId) : null;
  const orderItems = order ? parseItems(order.order_items) : [];
  const displayStatus = order?.status ?? "pending_confirmation";
  const whatsappUrl = settings.admin_whatsapp_phone
    ? createWhatsAppUrl(
        settings.admin_whatsapp_phone,
        orderId
          ? `Hello, I want to ask about my order ${orderId}.`
          : "Hello, I want to ask about my order."
      )
    : "";

  return (
    <section className="page-transition py-6 sm:py-10 md:py-14">
      <div className="container-page mx-auto max-w-4xl overflow-hidden rounded-md border border-gold/25 bg-cream shadow-luxury">
        <div className="luxury-dark-surface relative px-4 py-9 text-cream sm:px-5 sm:py-10 md:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(203,160,82,0.28),transparent_34rem)]" />
          <div className="relative text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/45 bg-gold-sheen text-ink shadow-soft">
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-gold">
              Order received
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Thank you for your order
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-cream/75 md:text-base">
              Your request has been received. The admin will contact you soon to
              confirm availability, delivery details, and the final handoff.
            </p>
            <div className="gold-divider mx-auto mt-6 w-36" />
          </div>
        </div>

        <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)] md:p-8">
          <div className="min-w-0 rounded-md border border-gold/20 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold text-ink/55">Order ID</p>
                <h2 className="mt-2 break-all text-lg font-bold text-ink">
                  {orderId || "Not available"}
                </h2>
              </div>
              <Badge tone={statusTone(displayStatus)}>
                {order?.status ?? "Pending confirmation"}
              </Badge>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-gold/15 bg-luxury-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Customer phone
                </p>
                <p className="mt-2 font-semibold text-ink">
                  {order?.customer_phone ?? "Available after confirmation"}
                </p>
              </div>
              <div className="rounded-md border border-gold/15 bg-luxury-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Status
                </p>
                <p className="mt-2 font-semibold capitalize text-ink">
                  {(order?.status ?? "pending confirmation").replace(/_/g, " ")}
                </p>
              </div>
            </div>

            {order ? (
              <div className="mt-5 rounded-md border border-gold/15 bg-luxury-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Order summary
                </p>
                <div className="mt-3 space-y-3">
                  {orderItems.map((item, index) => (
                    <div
                      key={`${item.product_name}-${item.quantity}-${index}`}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-ink">{item.product_name}</p>
                        <p className="text-ink/55">Quantity: {item.quantity}</p>
                      </div>
                      <p className="shrink-0 whitespace-nowrap font-semibold text-ink">
                        {formatPrice(Number(item.total_price), settings.currency)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                  <span className="text-sm font-semibold text-ink/60">Total</span>
                  <span className="text-lg font-bold text-ink">
                    {formatPrice(Number(order.total_amount), settings.currency)}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="rounded-md border border-gold/25 bg-ink p-5 text-cream shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-gold/10">
              <PackageCheck className="h-6 w-6 text-gold" aria-hidden />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-cream">What happens next?</h2>
            <p className="mt-3 text-sm leading-7 text-cream/65">
              Keep your order ID for tracking. You can return to the catalog any
              time, or contact the store directly on WhatsApp if you need a quick
              update.
            </p>

            <div className="mt-6 grid gap-3">
              <Link
                href={orderId ? `/track-order?orderId=${orderId}` : "/track-order"}
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                <Search className="h-4 w-4" aria-hidden />
                Track Order
              </Link>
              <Link
                href="/products"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Continue Shopping
              </Link>
              {whatsappUrl ? (
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className: "bg-[#25D366] text-white hover:bg-[#1fb957] hover:text-white"
                  })}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </Link>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
