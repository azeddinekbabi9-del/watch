"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function ProductDeleteButton({ productId }: { productId: string }) {
  const router = useRouter();

  async function remove() {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    const supabase: any = createSupabaseBrowserClient();
    await supabase.from("products").delete().eq("id", productId);
    router.refresh();
  }

  return (
    <Button type="button" variant="danger" size="sm" onClick={remove}>
      <Trash2 className="h-4 w-4" aria-hidden />
      Delete
    </Button>
  );
}
