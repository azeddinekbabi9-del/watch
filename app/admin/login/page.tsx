import { Suspense } from "react";
import { PreferenceControls } from "@/components/PreferenceControls";
import { LoginForm } from "@/components/admin/LoginForm";
import { getServerLanguage, getServerTheme } from "@/lib/preferences";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const language = getServerLanguage();
  const theme = getServerTheme();

  return (
    <main className="luxury-dark-surface flex min-h-screen min-h-[100svh] items-center justify-center px-4 py-10">
      <div className="fixed right-4 top-4 z-10">
        <PreferenceControls language={language} theme={theme} />
      </div>
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-md bg-white" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
