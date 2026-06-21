"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/components/store/CartProvider";
import { ProductImageFrame } from "@/components/store/ProductImageFrame";
import { formatPrice, productImageFallback } from "@/lib/utils";

export function CartClient({ currency }: { currency: string }) {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <section className="luxury-page page-transition py-12">
        <div className="relative container-page">
        <EmptyState
          title="لا توجد ساعات للطلب"
          description="اختار ساعة من WQITAK ثم أكمل الطلب."
        />
        <div className="mt-6 flex justify-center">
          <Link
            href="/products"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            كل الساعات
          </Link>
        </div>
        </div>
      </section>
    );
  }

  return (
    <section className="luxury-page page-transition py-10">
      <div className="relative container-page">
      <div className="hero-reveal mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          WQITAK
        </p>
        <h1 className="gold-text mt-2 text-3xl font-bold text-cream md:text-4xl">
          راجع الطلب
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <article
              key={item.id}
              className="luxury-card-hover animate-slide-up grid gap-4 rounded-md border border-gold/15 bg-white/[0.045] p-4 sm:grid-cols-[120px_1fr_auto]"
            >
              <ProductImageFrame
                src={item.image_url || productImageFallback}
                alt={item.name}
                className="w-full rounded-md sm:h-[120px] sm:w-[120px]"
              />
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  className="text-lg font-bold text-cream"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-cream/55">
                  {item.category_name || "Product"}
                </p>
                <p className="gold-text mt-3 font-semibold">
                  {formatPrice(item.price, currency)}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:justify-between">
                <div className="flex items-center rounded-md border border-gold/20 bg-black/25">
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

        <aside className="luxury-panel luxury-reveal h-fit rounded-md p-5">
          <h2 className="text-lg font-bold text-cream">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm text-cream/70">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{cart.count}</span>
            </div>
            <div className="flex justify-between border-t border-gold/15 pt-3 text-base font-bold text-cream">
              <span>Total</span>
              <span className="gold-text">{formatPrice(cart.total, currency)}</span>
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
            Order Now
          </Link>
        </aside>
      </div>
      </div>
    </section>
  );
}
