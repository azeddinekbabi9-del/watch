"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/store/Logo";
import { getSupabaseConfig } from "@/lib/config";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const configured = getSupabaseConfig().isConfigured;

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!configured) {
      setError("Add Supabase environment variables before logging in.");
      return;
    }

    setLoading(true);
    const supabase: any = createSupabaseBrowserClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    router.push(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={login}
      className="w-full max-w-md rounded-md border border-gold/20 bg-cream p-6 shadow-luxury"
    >
      <div className="mb-6">
        <div className="mb-5">
          <Logo size="lg" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Use the Supabase Auth user you create for store administration.
        </p>
      </div>

      <div className="space-y-4">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Email</span>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="admin@example.com"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="Password"
          />
        </label>
      </div>

      {!configured ? (
        <p className="mt-4 rounded-md bg-saffron/20 p-3 text-sm font-medium text-[#7b560c]">
          Supabase is not connected yet. Add `.env.local` values first.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Sign in
      </Button>
    </form>
  );
}
