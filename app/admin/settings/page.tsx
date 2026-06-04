import { SettingsForm } from "@/components/admin/SettingsForm";
import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Store
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Settings</h2>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
