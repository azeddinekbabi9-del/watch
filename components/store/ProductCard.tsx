import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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
      className="luxury-card-hover animate-slide-up group overflow-hidden rounded-md border border-gold/15 bg-cream shadow-sm"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-mint">
          <img
            src={product.image_url || productImageFallback}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {product.categories ? (
            <Badge tone="neutral">{product.categories.name}</Badge>
          ) : null}
          <Badge tone={inStock ? "success" : "danger"}>
            {inStock ? "Available" : "Out of stock"}
          </Badge>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-ink">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-ink">
            {formatPrice(product.price, currency)}
          </span>
          {product.old_price ? (
            <span className="text-sm text-ink/45 line-through">
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
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
