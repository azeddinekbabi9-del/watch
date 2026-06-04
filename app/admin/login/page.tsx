import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud px-4 py-10">
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
