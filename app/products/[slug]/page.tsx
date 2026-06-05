import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronLeft, MessageCircle, PackageCheck } from "lucide-react";
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
  const productBenefits = [
    {
      icon: BadgeCheck,
      title: "Curated details",
      text: "Review the image gallery and product description before placing your order."
    },
    {
      icon: MessageCircle,
      title: "Direct confirmation",
      text: "Your order is saved and prepared for WhatsApp confirmation with the store admin."
    },
    {
      icon: PackageCheck,
      title: "Careful delivery",
      text: settings.delivery_text
    }
  ];

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
        <div className="space-y-5">
          <ProductGallery
            productName={product.name}
            image={product.image_url}
            gallery={product.gallery_images}
          />

          <section className="luxury-reveal rounded-md border border-gold/15 bg-white p-5 shadow-soft md:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              Product Information
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Details and benefits
            </h2>
            {product.description ? (
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-ink/68">
                {product.description}
              </p>
            ) : (
              <p className="mt-4 text-base leading-8 text-ink/68">
                A refined selection from {settings.store_name}, available through
                direct order with personal confirmation.
              </p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {productBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-md border border-gold/15 bg-cream p-4"
                  >
                    <Icon className="h-5 w-5 text-gold" aria-hidden />
                    <h3 className="mt-3 text-sm font-semibold text-ink">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-ink/60">
                      {benefit.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

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

          <p className="mt-5 text-sm leading-7 text-ink/65">
            Complete the direct order form below. We will confirm availability and
            delivery details with you shortly.
          </p>

          <DirectOrderForm product={product} settings={settings} />
        </div>
      </div>
    </section>
  );
}
