"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/store/CartProvider";
import type { ProductWithCategory } from "@/types/database";

export function AddToCartButton({
  product,
  quantity = 1,
  className
}: {
  product: ProductWithCategory;
  quantity?: number;
  className?: string;
}) {
  const cart = useCart();
  const [added, setAdded] = React.useState(false);
  const unavailable = product.stock_status === "out_of_stock";

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={unavailable}
      onClick={() => {
        cart.addItem(product, quantity);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />
      {unavailable ? "Out of stock" : added ? "Added" : "Add to cart"}
    </Button>
  );
}
