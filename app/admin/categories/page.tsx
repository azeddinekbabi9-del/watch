import { CategoryManager } from "@/components/admin/CategoryManager";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories(false);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Catalog
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Categories</h2>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
