"use client";

import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/store/CartProvider";
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
  const cart = useCart();
  const unavailable = product.stock_status === "out_of_stock";

  return (
    <Button
      type="button"
      className={className}
      disabled={unavailable}
      onClick={() => {
        cart.addItem(product, quantity);
        router.push("/checkout");
      }}
    >
      <Send className="h-4 w-4" aria-hidden />
      Order now
    </Button>
  );
}
