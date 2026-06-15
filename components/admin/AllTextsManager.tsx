"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { StoreText } from "@/types/database";

export function AllTextsManager({ rows }: { rows: StoreText[] }) {
  const router = useRouter();
  const [localRows, setLocalRows] = React.useState(rows);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  function update(index: number, key: "en_text" | "ar_text", value: string) {
    setLocalRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      )
    );
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const supabase: any = createSupabaseBrowserClient();
    if (!supabase) {
      setSaving(false);
      setError("Supabase is not configured. Check your environment variables.");
      return;
    }

    const payload = localRows.map((row) => ({
      text_key: row.text_key,
      section: row.section,
      label: row.label,
      en_text: row.en_text.trim(),
      ar_text: row.ar_text.trim()
    }));

    const { error: saveError } = await supabase
      .from("store_texts")
      .upsert(payload, { onConflict: "text_key" });

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setMessage("Texts saved.");
    router.refresh();
  }

  const groupedRows = localRows.reduce((groups, row, index) => {
    const existing = groups.get(row.section) ?? [];
    existing.push({ row, index });
    groups.set(row.section, existing);
    return groups;
  }, new Map<string, { row: StoreText; index: number }[]>());

  return (
    <form onSubmit={save} className="space-y-5">
      {Array.from(groupedRows.entries()).map(([section, items]) => (
        <section
          key={section}
          className="admin-theme-card rounded-md border border-gold/20 p-4 shadow-sm sm:p-5"
        >
          <h3 className="text-lg font-bold theme-text">{section}</h3>
          <div className="mt-4 space-y-5">
            {items.map(({ row, index }) => (
              <div
                key={row.text_key}
                className="grid gap-3 border-t border-gold/15 pt-4 first:border-t-0 first:pt-0 lg:grid-cols-[220px_1fr_1fr]"
              >
                <div>
                  <p className="font-semibold theme-text">{row.label}</p>
                  <p className="mt-1 break-all text-xs theme-muted">{row.text_key}</p>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-semibold theme-text">English</span>
                  <Textarea
                    value={row.en_text}
                    onChange={(event) => update(index, "en_text", event.target.value)}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold theme-text">Arabic Fusha</span>
                  <Textarea
                    value={row.ar_text}
                    dir="rtl"
                    onChange={(event) => update(index, "ar_text", event.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
      ))}

      {message ? (
        <p className="rounded-md bg-mint p-3 text-sm font-medium text-moss">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save all texts
      </Button>
    </form>
  );
}
