"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container-page py-12">
      <div className="rounded-md border border-coral/20 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-ink">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
          The page could not load. Try again, or check your Supabase connection.
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </section>
  );
}
