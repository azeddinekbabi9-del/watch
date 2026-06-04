"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/components/store/CartProvider";
import { formatPrice, productImageFallback } from "@/lib/utils";

export function CartClient({ currency }: { currency: string }) {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <section className="container-page page-transition py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add products to your cart, then come back here to review your order."
        />
        <div className="mt-6 flex justify-center">
          <Link
            href="/products"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page page-transition py-10">
      <div className="hero-reveal mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Cart
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink md:text-4xl">
          Review your order
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <article
              key={item.id}
              className="luxury-card-hover animate-slide-up grid gap-4 rounded-md border border-gold/15 bg-cream p-4 sm:grid-cols-[120px_1fr_auto]"
            >
              <img
                src={item.image_url || productImageFallback}
                alt={item.name}
                className="aspect-square w-full rounded-md object-cover sm:w-[120px]"
              />
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  className="text-lg font-bold text-ink"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-ink/55">
                  {item.category_name || "Product"}
                </p>
                <p className="mt-3 font-semibold text-ink">
                  {formatPrice(item.price, currency)}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:justify-between">
                <div className="flex items-center rounded-md border border-ink/15">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="flex h-10 min-w-10 items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => cart.removeItem(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4 text-coral" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        <aside className="luxury-reveal h-fit rounded-md border border-gold/15 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{cart.count}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-bold text-ink">
              <span>Total</span>
              <span>{formatPrice(cart.total, currency)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className={buttonVariants({
              variant: "primary",
              size: "lg",
              className: "mt-6 w-full"
            })}
          >
            Go to checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
