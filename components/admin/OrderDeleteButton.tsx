"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function OrderDeleteButton({
  orderId,
  className
}: {
  orderId: string;
  className?: string;
}) {
  const router = useRouter();

  async function remove() {
    if (!window.confirm("Delete this order?")) {
      return;
    }

    const supabase: any = createSupabaseBrowserClient();
    await supabase.from("orders").delete().eq("id", orderId);
    router.push("/admin/orders");
    router.refresh();
  }

  return (
    <Button type="button" variant="danger" className={className} onClick={remove}>
      <Trash2 className="h-4 w-4" aria-hidden />
      Delete order
    </Button>
  );
}
