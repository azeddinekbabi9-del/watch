"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { OrderNowButton } from "@/components/store/OrderNowButton";
import { Button } from "@/components/ui/Button";
import type { ProductWithCategory } from "@/types/database";

export function ProductPurchasePanel({
  product,
  whatsappPhone
}: {
  product: ProductWithCategory;
  whatsappPhone: string;
}) {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm font-semibold text-cream/70">Quantity</span>
        <div className="mt-2 flex w-fit items-center rounded-md border border-gold/25 bg-[#0d0d0d]">
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
      <OrderNowButton
        product={product}
        quantity={quantity}
        className="h-12 w-full"
      />
    </div>
  );
}
