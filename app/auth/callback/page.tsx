"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { authClient, type RoleIntent } from "@/lib/auth-client";
import { getMe } from "@/lib/api";

/**
 * Where the magic link lands after the backend verifies it and sets the
 * session cookie. Confirms the session, then routes by what the account
 * already has: an org → the portal, a contractor profile → the contractor
 * home, neither → the onboarding the visitor asked for when signing in.
 */
function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const role = (params.get("role") === "CONTRACTOR" ? "CONTRACTOR" : "CLIENT") as RoleIntent;
      const errorParam = params.get("error");
      if (errorParam) {
        setFailed(errorParam === "INVALID_TOKEN" || errorParam === "EXPIRED_TOKEN" ? "That link has expired or was already used." : "We couldn't sign you in.");
        return;
      }
      const { data: session } = await authClient.getSession();
      if (cancelled) return;
      if (!session) {
        setFailed("We couldn't find a session. The link may have expired.");
        return;
      }
      const me = await getMe().catch(() => null);
      if (cancelled) return;
      if (me?.organization && role === "CLIENT") return router.replace("/portal");
      if (me?.contractor && role === "CONTRACTOR") return router.replace("/contractor");
      if (me?.organization) return router.replace("/portal");
      if (me?.contractor) return router.replace("/contractor");
      router.replace(role === "CONTRACTOR" ? "/contractor/onboarding" : "/onboarding");
    })();
    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <div className="w-full max-w-[520px]">
      {failed ? (
        <>
          <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
            That link didn&rsquo;t work.
          </h1>
          <p className="mt-5 text-[17px] leading-[1.5] text-muted">{failed}</p>
          <Link
            href="/sign-in"
            className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-ink-deep text-[17px] font-medium text-white transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.98]"
          >
            Request a new link
          </Link>
        </>
      ) : (
        <div className="flex items-center gap-3 text-[17px] text-muted">
          <Loader2 size={20} className="animate-spin text-accent" />
          Signing you in…
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-[72px] items-center border-b border-line px-5 md:px-8">
        <Link href="/" className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
          <Wordmark />
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <Suspense fallback={null}>
          <Callback />
        </Suspense>
      </div>
    </main>
  );
}
