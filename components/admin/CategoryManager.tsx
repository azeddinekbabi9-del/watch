"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Edit3, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types/database";

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  image_url: "",
  is_active: true
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = React.useState(emptyForm);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const editing = Boolean(form.id);

  function edit(category: Category) {
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image_url: category.image_url ?? "",
      is_active: category.is_active
    });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: any = {
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      is_active: form.is_active
    };

    if (!payload.name || !payload.slug) {
      setError("Name and slug are required.");
      setSaving(false);
      return;
    }

   const supabaseClient: any = createSupabaseBrowserClient();

if (supabaseClient === null) {
  setError("Supabase is not configured. Check your environment variables.");
  setSaving(false);
  return;
}

const request = editing
  ? supabaseClient.from("categories").update(payload).eq("id", form.id)
  : supabaseClient.from("categories").insert(payload);
    const { error: saveError } = await request;
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setForm(emptyForm);
    router.refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this category? Products keep working without it.")) {
      return;
    }

   const supabase: any = createSupabaseBrowserClient();
    await supabase.from("categories").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form
        onSubmit={save}
        className="h-fit rounded-md border border-ink/10 bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-bold text-ink">
          {editing ? "Edit category" : "New category"}
        </h2>
        <div className="mt-4 space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Name</span>
            <Input
              value={form.name}
              onChange={(event) =>
                setForm((value) => ({ ...value, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Slug</span>
            <Input
              value={form.slug}
              onChange={(event) =>
                setForm((value) => ({
                  ...value,
                  slug: slugify(event.target.value)
                }))
              }
              placeholder="auto-created-from-name"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Image URL</span>
            <Input
              value={form.image_url}
              onChange={(event) =>
                setForm((value) => ({ ...value, image_url: event.target.value }))
              }
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Description</span>
            <Textarea
              value={form.description}
              onChange={(event) =>
                setForm((value) => ({ ...value, description: event.target.value }))
              }
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((value) => ({ ...value, is_active: event.target.checked }))
              }
              className="h-4 w-4 accent-[var(--store-main)]"
            />
            Show category
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
          {editing ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm(emptyForm)}
            >
              <Plus className="h-4 w-4" />
              New
            </Button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="border-b border-ink/10 p-4">
          <h2 className="text-lg font-bold text-ink">Categories</h2>
        </div>
        <div className="divide-y divide-ink/10">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-ink">{category.name}</p>
                <p className="text-sm text-ink/55">/{category.slug}</p>
                <p className="mt-1 text-sm text-ink/55">
                  {category.is_active ? "Visible" : "Hidden"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => edit(category)}>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <Button type="button" variant="danger" size="sm" onClick={() => remove(category.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {categories.length === 0 ? (
            <p className="p-6 text-center text-sm text-ink/55">
              No categories yet.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
