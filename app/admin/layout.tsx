import { AdminShell } from "@/components/admin/AdminShell";
import { getServerLanguage, getServerTheme } from "@/lib/preferences";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell language={getServerLanguage()} theme={getServerTheme()}>
      {children}
    </AdminShell>
  );
}
