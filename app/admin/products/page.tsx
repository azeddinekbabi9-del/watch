import Link from "next/link";
import { Edit3, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";
import { buttonVariants } from "@/components/ui/Button";
import { getProducts, getStoreSettings } from "@/lib/data";
import { formatPrice, productImageFallback } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, settings] = await Promise.all([
    getProducts({ activeOnly: false }),
    getStoreSettings()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            Catalog
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Products</h2>
        </div>
        <Link
          href="/admin/products/new"
          className={buttonVariants({ variant: "primary" })}
        >
          <Plus className="h-4 w-4" />
          New product
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-ink/5 text-xs uppercase tracking-[0.12em] text-ink/55">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url || productImageFallback}
                        alt={product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-bold text-ink">{product.name}</p>
                        <p className="text-xs text-ink/50">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/65">
                    {product.categories?.name || "None"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {formatPrice(Number(product.price), settings.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={product.is_active ? "success" : "danger"}>
                        {product.is_active ? "Active" : "Hidden"}
                      </Badge>
                      {product.is_featured ? <Badge tone="info">Featured</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        product.stock_status === "available" ? "success" : "danger"
                      }
                    >
                      {product.stock_status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm"
                        })}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Link>
                      <ProductDeleteButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 ? (
            <p className="p-6 text-center text-sm text-ink/55">No products yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
