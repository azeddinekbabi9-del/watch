"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="luxury-page py-12">
      <div className="luxury-panel relative container-page rounded-md p-8 text-center">
        <h1 className="text-2xl font-bold text-cream">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-cream/60">
          The page could not load. Try again, or check your Supabase connection.
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </section>
  );
}
