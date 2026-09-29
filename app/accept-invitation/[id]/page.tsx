"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { authClient } from "@/lib/auth-client";

type Invitation = { id: string; email: string; role: string; status: string; expiresAt: string; organizationName: string; inviterEmail: string };

/**
 * Where an invitation email lands. Signed out → sign in and come back.
 * Signed in → show who invited you to what, accept or decline. Accepting makes
 * the org active and goes to the portal.
 */
export default function AcceptInvitationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [state, setState] = useState<"loading" | "signed-out" | "ready" | "accepting" | "done" | "error">("loading");
  const [invite, setInvite] = useState<Invitation | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: session } = await authClient.getSession();
      if (cancelled) return;
      if (!session) return setState("signed-out");
      const { data, error } = await authClient.organization.getInvitation({ query: { id } });
      if (cancelled) return;
      if (error || !data) {
        setMessage(error?.message ?? "This invitation is no longer valid.");
        return setState("error");
      }
      setInvite(data as unknown as Invitation);
      setState("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const accept = async () => {
    setState("accepting");
    const { error } = await authClient.organization.acceptInvitation({ invitationId: id });
    if (error) {
      setMessage(error.message ?? "Could not accept the invitation.");
      return setState("error");
    }
    qc.invalidateQueries();
    setState("done");
    window.setTimeout(() => router.replace("/portal"), 900);
  };

  const decline = async () => {
    await authClient.organization.rejectInvitation({ invitationId: id }).catch(() => {});
    router.replace("/");
  };

  const signInHref = `/sign-in?next=${encodeURIComponent(`/accept-invitation/${id}`)}`;

  return (
    <main className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-[72px] items-center border-b border-line px-5 md:px-8">
        <Link href="/" className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
          <Wordmark />
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-[520px]">
          {state === "loading" && (
            <div className="flex items-center gap-3 text-[17px] text-muted">
              <Loader2 size={20} className="animate-spin text-accent" /> Checking your invitation…
            </div>
          )}
          {state === "signed-out" && (
            <>
              <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">You&rsquo;ve been invited.</h1>
              <p className="mt-5 text-[17px] leading-[1.5] text-muted">Sign in with the email the invitation was sent to, and you&rsquo;ll come straight back here.</p>
              <Link href={signInHref} className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-ink-deep text-[17px] font-medium text-white transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.98]">
                Sign in to continue
              </Link>
            </>
          )}
          {(state === "ready" || state === "accepting") && invite && (
            <>
              <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
                Join <em className="font-medium italic">{invite.organizationName}</em>.
              </h1>
              <p className="mt-5 text-[17px] leading-[1.5] text-muted">
                <b className="font-medium text-ink">{invite.inviterEmail}</b> invited you as{" "}
                <b className="font-medium text-ink">{invite.role}</b>. {invite.role === "admin" ? "You'll be able to fund, pay and manage the team." : "You'll be able to view the treasury and history."}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={accept} disabled={state === "accepting"} className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-mint text-[17px] font-medium text-ink-deep transition-[opacity,transform] duration-150 enabled:hover:opacity-[0.88] enabled:active:scale-[0.98] disabled:opacity-50">
                  {state === "accepting" ? <Loader2 size={20} className="animate-spin" /> : null} Accept invitation
                </button>
                <button type="button" onClick={decline} disabled={state === "accepting"} className="inline-flex h-14 items-center justify-center rounded-full border border-ink px-8 text-[17px] font-medium text-ink disabled:opacity-50">
                  Decline
                </button>
              </div>
            </>
          )}
          {state === "done" && (
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink-deep">
                <Check size={26} strokeWidth={2.5} />
              </span>
              <h1 className="mt-7 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">You&rsquo;re in.</h1>
              <p className="mt-4 text-[17px] text-muted">Taking you to the dashboard…</p>
            </div>
          )}
          {state === "error" && (
            <>
              <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">That invitation didn&rsquo;t work.</h1>
              <p className="mt-5 text-[17px] leading-[1.5] text-muted">{message}</p>
              <Link href="/" className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-ink-deep text-[17px] font-medium text-white">
                Back to home
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
