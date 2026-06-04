"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusSelect, orderStatuses } from "@/components/admin/OrderStatusSelect";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/database";

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

export function OrdersManager({
  orders,
  currency
}: {
  orders: Order[];
  currency: string;
}) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<OrderStatus | "all">("all");
  const [localOrders, setLocalOrders] = React.useState(orders);

  React.useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const filtered = localOrders.filter((order) => {
    const matchesSearch = `${order.customer_name} ${order.customer_phone}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status === "all" || order.status === status;
    return matchesSearch && matchesStatus;
  });

  async function remove(id: string) {
    if (!window.confirm("Delete this order?")) {
      return;
    }

    const supabase: any = createSupabaseBrowserClient();
    await supabase.from("orders").delete().eq("id", id);
    setLocalOrders((current) => current.filter((order) => order.id !== id));
  }

  return (
    <div className="rounded-md border border-ink/10 bg-white shadow-sm">
      <div className="grid gap-3 border-b border-ink/10 p-4 md:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink/40" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer or phone"
            className="pl-9"
          />
        </label>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus | "all")}
        >
          <option value="all">All statuses</option>
          {orderStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-ink/5 text-xs uppercase tracking-[0.12em] text-ink/55">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-semibold text-ink">
                  <Link href={`/admin/orders/${order.id}`}>{order.customer_name}</Link>
                </td>
                <td className="px-4 py-3 text-ink/65">{order.customer_phone}</td>
                <td className="px-4 py-3 text-ink/65">{order.customer_city}</td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {formatPrice(Number(order.total_amount), currency)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/55">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`tel:${order.customer_phone}`}
                      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink/10 text-ink/65"
                      aria-label="Call customer"
                    >
                      <Phone className="h-4 w-4" />
                    </Link>
                    <Link
                      href={createWhatsAppUrl(
                        order.customer_phone,
                        `Hello ${order.customer_name}, your order is ${order.status}.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink/10 text-ink/65"
                      aria-label="WhatsApp customer"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => remove(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink/55">No orders found.</p>
        ) : null}
      </div>
    </div>
  );
}
