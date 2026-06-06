import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
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
    <section className="page-transition">
      <div className="luxury-dark-surface border-b border-gold/20 py-10 text-cream sm:py-12 md:py-16">
        <div className="container-page hero-reveal mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
            Catalog
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-cream sm:text-5xl md:text-6xl">
            Watch collection
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-cream/68 md:text-base">
            Explore refined pieces with direct ordering, clear availability, and
            personal confirmation.
          </p>
          <div className="gold-divider mx-auto mt-6 w-36" />
        </div>
      </div>

      <div className="container-page py-8 sm:py-10">

      <div className="luxury-reveal mb-8 flex gap-2 overflow-x-auto rounded-md border border-gold/15 bg-white/78 p-2 shadow-soft">
        <Link
          href="/products"
          className={cn(
            "whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition-all duration-300",
            !categorySlug
              ? "border-gold bg-gold-sheen text-ink shadow-sm"
              : "border-gold/20 bg-cream text-ink/65 hover:border-gold/60 hover:text-ink"
          )}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className={cn(
              "whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition-all duration-300",
              categorySlug === category.slug
                ? "border-gold bg-gold-sheen text-ink shadow-sm"
                : "border-gold/20 bg-cream text-ink/65 hover:border-gold/60 hover:text-ink"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

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
        <EmptyState
          title="No products found"
          description="Try another category or add active products from the admin dashboard."
        />
      )}
      </div>
    </section>
  );
}
