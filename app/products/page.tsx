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
    <section className="container-page page-transition py-10">
      <div className="hero-reveal mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Catalog
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink md:text-5xl">
          Watch collection
        </h1>
      </div>

      <div className="luxury-reveal mb-7 flex gap-2 overflow-x-auto pb-2">
        <Link
          href="/products"
          className={cn(
            "rounded-md border px-4 py-2 text-sm font-semibold transition-all duration-300",
            !categorySlug
              ? "border-gold bg-gold text-cream"
              : "border-ink/10 bg-cream text-ink/65 hover:border-gold/60 hover:text-ink"
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
                ? "border-gold bg-gold text-cream"
                : "border-ink/10 bg-cream text-ink/65 hover:border-gold/60 hover:text-ink"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}
