import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MessageCircle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { OrderDeleteButton } from "@/components/admin/OrderDeleteButton";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { buttonVariants } from "@/components/ui/Button";
import { getOrderById, getStoreSettings } from "@/lib/data";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

export const dynamic = "force-dynamic";

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

export default async function OrderDetailsPage({
  params
}: {
  params: { id: string };
}) {
  const [order, settings] = await Promise.all([
    getOrderById(params.id),
    getStoreSettings()
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors duration-300 hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            Order
          </p>
          <h2 className="mt-2 break-words text-3xl font-bold text-ink">
            {order.customer_name}
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={`tel:${order.customer_phone}`}
            className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}
          >
            <Phone className="h-4 w-4" />
            Call
          </Link>
          <Link
            href={createWhatsAppUrl(
              order.customer_phone,
              `Hello ${order.customer_name}, your order is ${order.status}.`
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "secondary", className: "w-full sm:w-auto" })}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Link>
          <OrderDeleteButton orderId={order.id} className="w-full sm:w-auto" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-md border border-gold/20 bg-white/92 p-4 shadow-sm sm:p-5">
          <h3 className="text-lg font-bold text-ink">Order items</h3>
          <div className="mt-5 divide-y divide-ink/10">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="break-words font-semibold text-ink">{item.product_name}</p>
                  <p className="mt-1 text-sm text-ink/55">
                    {item.quantity} x{" "}
                    {formatPrice(Number(item.unit_price), settings.currency)}
                  </p>
                </div>
                <p className="shrink-0 whitespace-nowrap font-bold text-ink">
                  {formatPrice(Number(item.total_price), settings.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-md border border-gold/20 bg-white/92 p-4 shadow-sm sm:p-5">
          <h3 className="text-lg font-bold text-ink">Customer</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-ink/55">Phone</dt>
              <dd className="mt-1 text-ink">{order.customer_phone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">City</dt>
              <dd className="mt-1 text-ink">{order.customer_city}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Address</dt>
              <dd className="mt-1 text-ink">
                {order.customer_address || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Notes</dt>
              <dd className="mt-1 text-ink">{order.customer_notes || "None"}</dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-ink/10 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink/55">Status</span>
              <Badge tone={statusTone(order.status)}>{order.status}</Badge>
            </div>
            <OrderStatusSelect orderId={order.id} status={order.status} />
            <div className="mt-5 flex flex-wrap justify-between gap-2 text-lg font-bold text-ink">
              <span>Total</span>
              <span>{formatPrice(Number(order.total_amount), settings.currency)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
