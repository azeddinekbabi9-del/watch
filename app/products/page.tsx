import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { getCategories, getProducts, getStoreSettings } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: { category?: string };
}) {
  const categorySlug = searchParams?.category;
  const [settings, categories, products] = await Promise.all([
    getStoreSettings(),
    getCategories(true),
    getProducts({ categorySlug })
  ]);

  return (
    <section className="luxury-page page-transition">
      <div className="relative border-b border-gold/20 py-12 text-cream sm:py-14 md:py-16">
        <div className="container-page hero-reveal mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
            WQITAK Watches
          </p>
          <h1 className="gold-text mt-3 text-4xl font-semibold tracking-[0.04em] sm:text-5xl md:text-6xl">
            ساعات فاخرة
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-cream/68 md:text-base">
            اختار ساعتك المفضلة واطلب مباشرة مع الدفع عند الاستلام.
          </p>
          <div className="gold-divider mx-auto mt-6 w-36" />
        </div>
      </div>

      <div className="relative container-page py-8 sm:py-10 lg:py-12">
        {categories.length > 0 ? (
          <div className="luxury-reveal mb-8 flex gap-2 overflow-x-auto rounded-md border border-gold/20 bg-white/[0.045] p-2 shadow-soft">
            <Link
              href="/products"
              className={cn(
                "whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition-all duration-300",
                !categorySlug
                  ? "border-champagne bg-gold-sheen text-ink shadow-sm"
                  : "border-gold/20 bg-black/30 text-cream/70 hover:border-gold/60 hover:text-champagne"
              )}
            >
              كل الساعات
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={cn(
                  "whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition-all duration-300",
                  categorySlug === category.slug
                    ? "border-champagne bg-gold-sheen text-ink shadow-sm"
                    : "border-gold/20 bg-black/30 text-cream/70 hover:border-gold/60 hover:text-champagne"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={settings.currency}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="luxury-panel rounded-md p-8 text-center">
            <h2 className="text-xl font-semibold text-cream">
              لا توجد ساعات متاحة حاليا
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cream/62">
              جرب تصنيف آخر أو أضف منتجات نشطة من لوحة الإدارة.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
