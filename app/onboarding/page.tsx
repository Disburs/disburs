"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import WalletStep from "@/components/onboarding/WalletStep";
import { Button, Card, Field, inputClass } from "@/components/portal/ui";
import { authClient } from "@/lib/auth-client";
import { useOnboardClient, useRequireProfile } from "@/lib/hooks/useMe";

const STEPS = ["Company", "Treasury"];
const COUNTRIES = ["Kenya", "Ghana", "South Africa", "Nigeria", "United Kingdom", "United States", "Other"];

const headingClass = "font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]";

/**
 * Employer onboarding, as the signed-in user. Step 1 creates the organization
 * (the backend provisions its treasury wallet on completion); step 2 shows
 * the treasury and its activation state, then hands off to the dashboard.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { me, ready } = useRequireProfile({});
  const onboard = useOnboardClient();

  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [teamSize, setTeamSize] = useState("");

  const hasOrg = Boolean(me?.organization);
  const step = hasOrg ? 1 : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || onboard.isPending) return;
    onboard.mutate({
      company: company.trim(),
      country,
      ...(teamSize ? { teamSize: Number(teamSize) } : {}),
    });
  };

  const signOut = async () => {
    await authClient.signOut();
    router.replace("/sign-in");
  };

  return (
    <main className="min-h-screen bg-canvas">
      <header className="flex h-[72px] items-center justify-between border-b border-line px-5 md:px-8">
        <Wordmark className="text-[22px] font-semibold tracking-[-0.03em] text-ink" />
        <button type="button" onClick={signOut} className="text-[14px] text-muted hover:text-ink">
          Log out
        </button>
      </header>

      <div className="mx-auto max-w-[680px] px-5 pb-20 pt-10">
        <ol className="mb-10 flex border-b border-line" aria-label="Setup steps">
          {STEPS.map((s, i) => (
            <li
              key={s}
              aria-current={i === step ? "step" : undefined}
              className={`-mb-px flex flex-1 items-center gap-2 border-b-2 pb-3 text-[13.5px] ${
                i === step ? "border-ink font-medium text-ink" : "border-transparent text-muted"
              }`}
            >
              <span className="font-mono text-[12.5px]">{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
              {i < step && <Check size={13} className="text-accent" />}
            </li>
          ))}
        </ol>

        {!ready ? (
          <div className="flex items-center gap-3 text-[16px] text-muted">
            <Loader2 size={18} className="animate-spin text-accent" /> Loading your account…
          </div>
        ) : step === 0 ? (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="mb-2">
              <h1 className={headingClass}>Tell us about your company</h1>
              <p className="mt-3 text-[16px] text-muted">
                This creates your organization. Signed in as <b className="font-medium text-ink">{me?.user.email}</b>.
              </p>
            </div>
            <Card>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Company name">
                    <input className={inputClass} required maxLength={120} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Northwind Studios" autoFocus />
                  </Field>
                </div>
                <Field label="Country">
                  <select className={inputClass} value={country} onChange={(e) => setCountry(e.target.value)}>
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Team size" hint="How many people you expect to pay. Optional.">
                  <input className={inputClass} type="number" min={1} inputMode="numeric" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="12" />
                </Field>
              </div>
            </Card>
            {onboard.isError && <p className="text-[14px] text-[#A32D1C]">{(onboard.error as Error).message}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={!company.trim() || onboard.isPending}>
                {onboard.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Creating your organization…
                  </>
                ) : (
                  <>
                    Continue <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="rounded-[24px] border border-line bg-canvas p-6 md:p-8">
              <WalletStep kind="treasury" wallet={me?.organization?.treasuryWallet ?? null} network={me?.network ?? ""} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-muted">{me?.organization?.name}</span>
              <Button href="/portal">
                Go to dashboard <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
