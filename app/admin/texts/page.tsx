import { AllTextsManager } from "@/components/admin/AllTextsManager";
import { getStoreTextRows } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminTextsPage() {
  const rows = await getStoreTextRows();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Content
        </p>
        <h2 className="mt-2 text-3xl font-bold theme-text">All Texts</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 theme-muted">
          Manage the public store copy in English and Arabic Fusha.
        </p>
      </div>
      <AllTextsManager rows={rows} />
    </div>
  );
}
