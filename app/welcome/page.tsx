"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { Card, Field, inputClass } from "@/components/portal/ui";
import { useMe, useRequireProfile, useUpdateName } from "@/lib/hooks/useMe";
import { joinName, splitName } from "@/lib/name";

/**
 * The one step an invited teammate is missing: their name. Accepting an
 * invitation creates the account and the membership, but nothing asks who
 * they are. The portal gate sends anyone without a display name here, and
 * `?next=` takes them back to where they were going.
 */
function Welcome() {
  const router = useRouter();
  const params = useSearchParams();
  const { me, ready } = useRequireProfile({});
  const { data: fresh } = useMe();
  const update = useUpdateName();
  const initial = splitName(fresh?.user.name ?? me?.user.name);
  const [first, setFirst] = useState(initial.first);
  const [last, setLast] = useState(initial.last);

  const rawNext = params.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/portal";
  const org = fresh?.organization ?? me?.organization ?? null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!first.trim() || update.isPending) return;
    update.mutate(joinName(first, last), { onSuccess: () => router.replace(next) });
  };

  if (!ready) return <div className="min-h-screen bg-canvas" aria-busy="true" />;

  return (
    <main className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-[72px] items-center border-b border-line px-5 md:px-8">
        <Link href="/" className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
          <Wordmark />
        </Link>
      </header>
      <div className="flex flex-1 items-start justify-center px-5 py-16">
        <div className="w-full max-w-[520px]">
          <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
            {org ? (
              <>
                Welcome to <em className="font-medium italic">{org.name}.</em>
              </>
            ) : (
              "Welcome."
            )}
          </h1>
          <p className="mt-4 text-[16px] leading-[1.5] text-muted md:text-[17px]">
            One thing before you go in: your name, so your teammates know who approved what.
          </p>
          <Card className="mt-8">
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input className={inputClass} required maxLength={60} value={first} onChange={(e) => setFirst(e.target.value)} autoFocus placeholder="Ama" />
              </Field>
              <Field label="Last name">
                <input className={inputClass} maxLength={60} value={last} onChange={(e) => setLast(e.target.value)} placeholder="Serwaa" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Email">
                  <input className={inputClass} value={me?.user.email ?? ""} disabled readOnly />
                </Field>
              </div>
              {update.isError && <p className="text-[13.5px] text-[#A32D1C] sm:col-span-2">{(update.error as Error).message}</p>}
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="w-full" disabled={!first.trim() || update.isPending}>
                  {update.isPending ? <Loader2 size={18} className="animate-spin" /> : null} Continue <ArrowRight size={16} />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" aria-busy="true" />}>
      <Welcome />
    </Suspense>
  );
}
