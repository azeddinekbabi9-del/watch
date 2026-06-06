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
    <section className="page-transition">
      <div className="luxury-dark-surface border-b border-gold/20 py-6">
        <div className="container-page">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors duration-300 hover:text-cream"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to products
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:gap-8">
        <div className="min-w-0 space-y-5">
          <ProductGallery
            productName={product.name}
            image={product.image_url}
            gallery={product.gallery_images}
          />

          <section className="luxury-reveal rounded-md border border-gold/20 bg-white/92 p-4 shadow-soft sm:p-5 md:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              Product Information
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink">
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
                    className="rounded-md border border-gold/20 bg-luxury-surface p-4 shadow-sm"
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

        <div className="luxury-reveal min-w-0 rounded-md border border-gold/25 bg-ink p-4 text-cream shadow-luxury sm:p-5 md:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {product.categories ? (
              <Badge tone="neutral">{product.categories.name}</Badge>
            ) : null}
            <Badge tone={inStock ? "success" : "danger"}>
              {inStock ? "Available" : "Out of stock"}
            </Badge>
          </div>

          <h1 className="break-words text-3xl font-semibold tracking-[-0.04em] text-cream md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-bold text-gold sm:text-3xl">
              {formatPrice(product.price, settings.currency)}
            </span>
            {product.old_price ? (
              <span className="text-lg text-cream/45 line-through">
                {formatPrice(product.old_price, settings.currency)}
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-sm leading-7 text-cream/65">
            Complete the direct order form below. We will confirm availability and
            delivery details with you shortly.
          </p>

          <DirectOrderForm product={product} settings={settings} />
        </div>
      </div>
    </section>
  );
}
