"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import WalletStep from "@/components/onboarding/WalletStep";
import { Button, Field, inputClass } from "@/components/portal/ui";
import { useOnboardContractor, useRequireProfile } from "@/lib/hooks/useMe";

const STEPS = ["About you", "Wallet"];
const COUNTRIES: { name: string; currency: "USDC" | "NGN" | "KES" | "GHS" | "ZAR" }[] = [
  { name: "Kenya", currency: "KES" },
  { name: "Ghana", currency: "GHS" },
  { name: "South Africa", currency: "ZAR" },
  { name: "Nigeria", currency: "NGN" },
  { name: "Other", currency: "USDC" },
];
const CURRENCIES = ["USDC", "KES", "GHS", "ZAR", "NGN"] as const;

const headingClass = "font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]";

/**
 * Contractor onboarding, as the signed-in user. Step 1 creates the payee
 * profile (individual or business); the backend provisions the personal payout
 * wallet on completion. Step 2 shows the wallet and hands off to the home.
 */
export default function ContractorOnboarding() {
  const { me, ready } = useRequireProfile({});
  const onboard = useOnboardContractor();

  const [type, setType] = useState<"INDIVIDUAL" | "BUSINESS">("INDIVIDUAL");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("KES");
  const [companyLegalName, setCompanyLegalName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  const step = me?.contractor ? 1 : 0;
  const business = type === "BUSINESS";
  const valid = name.trim() && (!business || (companyLegalName.trim() && businessAddress.trim()));

  const pickCountry = (c: string) => {
    setCountry(c);
    const match = COUNTRIES.find((x) => x.name === c);
    if (match) setCurrency(match.currency);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || onboard.isPending) return;
    onboard.mutate({
      name: name.trim(),
      country,
      payoutCurrency: currency,
      type,
      ...(business ? { companyLegalName: companyLegalName.trim(), businessAddress: businessAddress.trim() } : {}),
    });
  };

  return (
    <div>
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

      <div className="rounded-[24px] border border-line bg-canvas p-6 md:p-8">
        {!ready ? (
          <div className="flex items-center gap-3 text-[16px] text-muted">
            <Loader2 size={18} className="animate-spin text-accent" /> Loading your account…
          </div>
        ) : step === 0 ? (
          <form onSubmit={submit} className="flex flex-col gap-6">
            <div>
              <h1 className={headingClass}>Let&rsquo;s get you paid.</h1>
              <p className="mt-4 text-[16px] leading-[1.5] text-muted">
                A few details so employers can pay you. Signed in as <b className="font-medium text-ink">{me?.user.email}</b>.
              </p>
            </div>

            <fieldset>
              <legend className="mb-3 text-[14px] font-medium text-ink">I get paid as</legend>
              <div className="flex flex-wrap gap-2.5">
                {(
                  [
                    ["INDIVIDUAL", "An individual"],
                    ["BUSINESS", "A business"],
                  ] as const
                ).map(([v, label]) => {
                  const on = type === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setType(v)}
                      aria-pressed={on}
                      className={`inline-flex h-11 items-center rounded-full border px-5 text-[14.5px] font-medium transition-colors ${
                        on ? "border-ink-deep bg-ink-deep text-white" : "border-line bg-canvas text-ink hover:border-ink"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Full name">
                  <input className={inputClass} required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="Kwabena Mensah" autoFocus />
                </Field>
              </div>
              <Field label="Country">
                <select className={inputClass} value={country} onChange={(e) => pickCountry(e.target.value)}>
                  {COUNTRIES.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Payout currency" hint="You receive USDC; this is what you cash out to.">
                <select className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value as (typeof CURRENCIES)[number])}>
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              {business && (
                <>
                  <div className="sm:col-span-2">
                    <Field label="Company legal name">
                      <input className={inputClass} required maxLength={160} value={companyLegalName} onChange={(e) => setCompanyLegalName(e.target.value)} placeholder="Acme Logistics Ltd" />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Business address">
                      <input className={inputClass} required maxLength={240} value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="12 Ring Road, Accra, Ghana" />
                    </Field>
                  </div>
                </>
              )}
            </div>

            {onboard.isError && <p className="text-[14px] text-[#A32D1C]">{(onboard.error as Error).message}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={!valid || onboard.isPending}>
                {onboard.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Setting you up…
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
          <WalletStep kind="payout" wallet={me?.contractor?.wallet ?? null} network={me?.network ?? ""} />
        )}
      </div>

      {step === 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[14px] text-muted">{me?.contractor?.name}</span>
          <Button href="/contractor">
            Go to my wallet <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
