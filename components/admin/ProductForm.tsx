"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { parseGalleryImages, slugify } from "@/lib/utils";
import type { Category, ProductWithCategory, StockStatus } from "@/types/database";

interface ProductFormProps {
  categories: Category[];
  product?: ProductWithCategory | null;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    old_price: product?.old_price?.toString() ?? "",
    image_url: product?.image_url ?? "",
    gallery_images: product?.gallery_images?.join("\n") ?? "",
    category_id: product?.category_id ?? "",
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
    stock_status: product?.stock_status ?? "available"
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      image_url: form.image_url.trim() || null,
      gallery_images: parseGalleryImages(form.gallery_images),
      category_id: form.category_id || null,
      is_featured: form.is_featured,
      is_active: form.is_active,
      stock_status: form.stock_status as StockStatus
    };

    if (
      !payload.name ||
      !payload.slug ||
      Number.isNaN(payload.price) ||
      payload.price < 0 ||
      (payload.old_price !== null && payload.old_price < 0)
    ) {
      setError("Name, slug, and a valid non-negative price are required.");
      setSaving(false);
      return;
    }

    const supabase: any = createSupabaseBrowserClient();
    const request = product
      ? supabase.from("products").update(payload).eq("id", product.id)
      : supabase.from("products").insert(payload);

    const { error: saveError } = await request;
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form
      onSubmit={save}
      className="max-w-4xl rounded-md border border-ink/10 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Product name</span>
          <Input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Slug</span>
          <Input
            value={form.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
            placeholder="auto-created-from-name"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Price</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(event) => update("price", event.target.value)}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Old price</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.old_price}
            onChange={(event) => update("old_price", event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Category</span>
          <Select
            value={form.category_id}
            onChange={(event) => update("category_id", event.target.value)}
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Stock status</span>
          <Select
            value={form.stock_status}
            onChange={(event) => update("stock_status", event.target.value as StockStatus)}
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of stock</option>
          </Select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-ink">Image URL</span>
          <Input
            value={form.image_url}
            onChange={(event) => update("image_url", event.target.value)}
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-ink">Gallery images</span>
          <Textarea
            value={form.gallery_images}
            onChange={(event) => update("gallery_images", event.target.value)}
            placeholder="One image URL per line"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-ink">Description</span>
          <Textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => update("is_active", event.target.checked)}
            className="h-4 w-4 accent-[var(--store-main)]"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(event) => update("is_featured", event.target.checked)}
            className="h-4 w-4 accent-[var(--store-main)]"
          />
          Featured
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="mt-6" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save product
      </Button>
    </form>
  );
}
