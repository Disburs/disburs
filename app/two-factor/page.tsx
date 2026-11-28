"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { KeyRound } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/portal/ui";
import { twoFactorApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { ME_KEY, useMe } from "@/lib/hooks/useMe";

export default function TwoFactorPage() {
  return (
    <Suspense fallback={null}>
      <Challenge />
    </Suspense>
  );
}

/**
 * The sign-in challenge: after a week away, someone with an authenticator
 * must enter a code before the rest of the app opens.
 */
function Challenge() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const nextParam = useSearchParams().get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : me?.organization
        ? "/portal"
        : "/contractor";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await twoFactorApi.verify(code.trim());
      await qc.invalidateQueries({ queryKey: ME_KEY });
      router.replace(next);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-[72px] items-center border-b border-line px-6">
        <Wordmark />
      </header>
      <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center px-6 py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-subtle">
          <KeyRound size={22} className="text-accent" />
        </div>
        <h1 className="mt-6 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
          Enter your authenticator code
        </h1>
        <p className="mt-3 text-[15.5px] leading-[1.5] text-muted">
          It has been a while since you used Disburs, so we are checking it is
          you. Open your authenticator app and type the 6-digit code for
          Disburs, or use one of your backup codes.
        </p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          <input
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label="Authenticator code"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${inputClass} tabular h-14 text-center text-[22px] tracking-[0.3em]`}
          />
          {error && (
            <p className="text-[14px] text-[#A32D1C]" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={busy || code.trim().length < 6}
            className="h-12"
          >
            {busy ? "Checking…" : "Continue"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() =>
            authClient.signOut().then(() => router.replace("/sign-in"))
          }
          className="mt-6 self-start text-[14px] text-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          Sign out instead
        </button>
      </div>
    </main>
  );
}
