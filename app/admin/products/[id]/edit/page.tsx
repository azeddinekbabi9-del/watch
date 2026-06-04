import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories, getProductById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: { id: string };
}) {
  const [categories, product] = await Promise.all([
    getCategories(false),
    getProductById(params.id)
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Catalog
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Edit product</h2>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
