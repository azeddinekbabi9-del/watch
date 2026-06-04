import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories(false);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Catalog
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">New product</h2>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
