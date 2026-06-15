"use client";

import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ProductWithCategory } from "@/types/database";

export function OrderNowButton({
  product,
  quantity = 1,
  className
}: {
  product: ProductWithCategory;
  quantity?: number;
  className?: string;
}) {
  const router = useRouter();
  const unavailable = product.stock_status === "out_of_stock";

  return (
    <Button
      type="button"
      className={className}
      disabled={unavailable}
      onClick={() => {
        router.push(`/products/${product.slug}`);
      }}
    >
      <Send className="h-4 w-4" aria-hidden />
      Order Now
    </Button>
  );
}
