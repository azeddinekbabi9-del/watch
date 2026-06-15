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
      title: "تفاصيل واضحة",
      text: "شوف الصور والوصف قبل ما تأكد الطلب."
    },
    {
      icon: MessageCircle,
      title: "تأكيد مباشر",
      text: "الطلب كيتسجل ثم كيتوجد للتأكيد عبر واتساب."
    },
    {
      icon: PackageCheck,
      title: "الدفع عند الاستلام",
      text: settings.delivery_text
    }
  ];

  return (
    <section className="luxury-page page-transition">
      <div className="relative border-b border-gold/20 py-6">
        <div className="container-page">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-champagne transition-colors duration-300 hover:text-cream"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            الرجوع للساعات
          </Link>
        </div>
      </div>

      <div className="relative container-page grid gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.82fr)] lg:gap-8">
        <div className="min-w-0 space-y-5">
          <ProductGallery
            productName={product.name}
            image={product.image_url}
            gallery={product.gallery_images}
          />

          <section className="luxury-panel luxury-reveal rounded-md p-4 sm:p-5 md:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              WQITAK
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-cream">
              وصف المنتج
            </h2>
            {product.description ? (
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-cream/70">
                {product.description}
              </p>
            ) : (
              <p className="mt-4 text-base leading-8 text-cream/70">
                ساعة فاخرة من WQITAK متوفرة للطلب المباشر مع تأكيد سريع والدفع عند الاستلام.
              </p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {productBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-md border border-gold/20 bg-white/[0.045] p-4 shadow-sm"
                  >
                    <Icon className="h-5 w-5 text-champagne" aria-hidden />
                    <h3 className="mt-3 text-sm font-semibold text-cream">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-cream/60">
                      {benefit.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="luxury-panel luxury-reveal h-fit min-w-0 rounded-md p-4 text-cream sm:p-5 md:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {product.categories ? (
              <Badge tone="neutral" className="border-gold/35 bg-gold/10 text-champagne">
                {product.categories.name}
              </Badge>
            ) : null}
            <Badge
              tone={inStock ? "success" : "danger"}
              className={inStock ? "border-gold/35 bg-white/5 text-champagne" : undefined}
            >
              {inStock ? "Available" : "Out of stock"}
            </Badge>
          </div>

          <h1 className="break-words text-3xl font-semibold tracking-[-0.03em] text-cream md:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="gold-text text-2xl font-bold sm:text-3xl">
              {formatPrice(product.price, settings.currency)}
            </span>
            {product.old_price ? (
              <span className="text-lg text-cream/40 line-through">
                {formatPrice(product.old_price, settings.currency)}
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-sm leading-7 text-cream/65">
            عمر معلوماتك باش نأكدو الطلب والتوصيل. الأداء كيكون عند الاستلام.
          </p>

          <DirectOrderForm product={product} settings={settings} />
        </div>
      </div>
    </section>
  );
}
