"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Select } from "@/components/ui/Select";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { OrderStatus } from "@/types/database";

export const orderStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled"
];

export function OrderStatusSelect({
  orderId,
  status
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState<OrderStatus>(status);
  const [saving, setSaving] = React.useState(false);

  async function update(nextStatus: OrderStatus) {
    setValue(nextStatus);
    setSaving(true);
    const supabase: any = createSupabaseBrowserClient();
    await supabase.from("orders").update({ status: nextStatus }).eq("id", orderId);
    setSaving(false);
    router.refresh();
  }

  return (
    <Select
      value={value}
      disabled={saving}
      onChange={(event) => update(event.target.value as OrderStatus)}
      className="min-w-36"
      aria-label="Update order status"
    >
      {orderStatuses.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </Select>
  );
}
