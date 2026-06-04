"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { OrderNowButton } from "@/components/store/OrderNowButton";
import { Button, buttonVariants } from "@/components/ui/Button";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import type { ProductWithCategory } from "@/types/database";

export function ProductPurchasePanel({
  product,
  whatsappPhone
}: {
  product: ProductWithCategory;
  whatsappPhone: string;
}) {
  const [quantity, setQuantity] = React.useState(1);
  const unavailable = product.stock_status === "out_of_stock";
  const message = `Hello, I want to order ${quantity} x ${product.name}.`;

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm font-semibold text-ink/70">Quantity</span>
        <div className="mt-2 flex w-fit items-center rounded-md border border-ink/15 bg-white">
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
      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          product={product}
          quantity={quantity}
          className="h-12 w-full"
        />
        <OrderNowButton
          product={product}
          quantity={quantity}
          className="h-12 w-full"
        />
      </div>
      {whatsappPhone && unavailable ? (
        <Button type="button" variant="secondary" size="lg" className="w-full" disabled>
          <MessageCircle className="h-5 w-5" aria-hidden />
          WhatsApp order
        </Button>
      ) : null}
      {whatsappPhone && !unavailable ? (
        <Link
          href={createWhatsAppUrl(whatsappPhone, message)}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "secondary",
            size: "lg",
            className: "w-full"
          })}
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          WhatsApp order
        </Link>
      ) : null}
    </div>
  );
}
