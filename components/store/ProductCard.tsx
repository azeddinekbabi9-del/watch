import Link from "next/link";
import type { CSSProperties } from "react";
import { ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { formatPrice, productImageFallback } from "@/lib/utils";
import type { ProductWithCategory } from "@/types/database";

export function ProductCard({
  product,
  currency,
  index = 0
}: {
  product: ProductWithCategory;
  currency: string;
  index?: number;
}) {
  const inStock = product.stock_status === "available";
  const style = { animationDelay: `${Math.min(index, 8) * 70}ms` } as CSSProperties;

  return (
    <article
      style={style}
      className="luxury-card-hover animate-slide-up group overflow-hidden rounded-md border border-gold/20 bg-[#090909] text-cream shadow-soft"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#050505]">
          <img
            src={product.image_url || productImageFallback}
            alt={product.name}
            className="h-full w-full object-cover opacity-95 transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent opacity-85" />
          <span className="absolute left-3 top-3 rounded-full border border-gold/35 bg-black/70 px-3 py-1 text-xs font-semibold text-champagne backdrop-blur">
            {inStock ? "Available" : "Out of stock"}
          </span>
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-12 break-words text-base font-semibold leading-6 text-cream transition-colors duration-300 group-hover:text-champagne">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="gold-text text-xl font-bold">
            {formatPrice(product.price, currency)}
          </span>
          {product.old_price ? (
            <span className="text-sm text-cream/42 line-through">
              {formatPrice(product.old_price, currency)}
            </span>
          ) : null}
        </div>
        <Link
          href={`/products/${product.slug}`}
          className={buttonVariants({
            variant: "primary",
            size: "md",
            className: "mt-4 w-full"
          })}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden />
          Order Now
        </Link>
      </div>
    </article>
  );
}
