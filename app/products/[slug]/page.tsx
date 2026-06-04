import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DirectOrderForm } from "@/components/store/DirectOrderForm";
import { ProductGallery } from "@/components/store/ProductGallery";
import { getProductBySlug, getStoreSettings } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  const [settings, product] = await Promise.all([
    getStoreSettings(),
    getProductBySlug(params.slug)
  ]);

  if (!product || !product.is_active) {
    notFound();
  }

  const inStock = product.stock_status === "available";

  return (
    <section className="container-page page-transition py-10">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors duration-300 hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <ProductGallery
          productName={product.name}
          image={product.image_url}
          gallery={product.gallery_images}
        />

        <div className="luxury-reveal rounded-md border border-gold/15 bg-cream p-5 shadow-soft md:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {product.categories ? (
              <Badge tone="neutral">{product.categories.name}</Badge>
            ) : null}
            <Badge tone={inStock ? "success" : "danger"}>
              {inStock ? "Available" : "Out of stock"}
            </Badge>
          </div>

          <h1 className="text-3xl font-semibold text-ink md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink">
              {formatPrice(product.price, settings.currency)}
            </span>
            {product.old_price ? (
              <span className="text-lg text-ink/45 line-through">
                {formatPrice(product.old_price, settings.currency)}
              </span>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-5 whitespace-pre-line text-base leading-8 text-ink/68">
              {product.description}
            </p>
          ) : null}

          <DirectOrderForm product={product} settings={settings} />
        </div>
      </div>
    </section>
  );
}
