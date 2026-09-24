"use client";

import { useEffect, useState } from "react";
import Wordmark from "@/components/Wordmark";
import { useRouter } from "next/navigation";
import {
  Check,
  Upload,
  FileText,
  Loader2,
  Copy,
  Mail,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Card, Button, QrCode, Field, inputClass } from "@/components/portal/ui";
import { WALLET_ADDRESS } from "@/lib/mock";

const STEPS = ["Company", "Fund wallet", "First contractor"];

const headingClass = "font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]";

function UploadTile({ label }: { label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone(true)}
      className={`flex w-full items-center gap-3 rounded-[16px] border p-4 text-left text-[14px] transition-colors ${
        done ? "border-solid border-accent bg-accent-soft text-accent" : "border-dashed border-line bg-canvas text-ink hover:border-ink"
      }`}
    >
      {done ? <Check size={18} className="text-accent" /> : <Upload size={18} className="text-muted" />}
      <span>{done ? `${label} uploaded` : label}</span>
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const next = () => (step < 2 ? setStep(step + 1) : router.push("/portal"));
  const back = () => step > 0 && setStep(step - 1);

  return (
    <main className="min-h-screen bg-canvas">
      {/* Top bar */}
      <header className="flex h-[72px] items-center justify-between border-b border-line px-5 md:px-8">
        <Wordmark className="text-[22px] font-semibold tracking-[-0.03em] text-ink" />
        <a href="/portal" className="text-[14px] text-muted hover:text-ink">
          Skip setup
        </a>
      </header>

      <div className="mx-auto max-w-[680px] px-5 pb-20 pt-10">
        {/* Stepper */}
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
              <span className="hidden sm:inline">{s}</span>
              {i < step && <Check size={13} className="text-accent" />}
            </li>
          ))}
        </ol>

        {step === 0 && <CompanyStep />}
        {step === 1 && <FundStep />}
        {step === 2 && <ContractorStep />}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <Button variant="ghost" onClick={back}>
              <ArrowLeft size={15} /> Back
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={next}>
            {step < 2 ? (
              <>
                Continue <ArrowRight size={16} />
              </>
            ) : (
              <>
                Finish setup <Check size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

/* ---------- Step 1 ---------- */
function CompanyStep() {
  const [schedule, setSchedule] = useState("Monthly");
  return (
    <div className="flex flex-col gap-5">
      <div className="mb-2">
        <h1 className={headingClass}>Tell us about your company</h1>
        <p className="mt-3 text-[16px] text-muted">We use this to set up your account and verify your business.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <input className={inputClass} placeholder="Northwind Studios" />
          </Field>
          <Field label="Registration number">
            <input className={inputClass} placeholder="RC 1284501" />
          </Field>
          <Field label="Country of incorporation">
            <select className={inputClass} defaultValue="Nigeria">
              <option>Nigeria</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>Kenya</option>
            </select>
          </Field>
          <Field label="Payroll currency">
            <select className={inputClass} defaultValue="USDC">
              <option>USDC</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-[16px] font-medium text-ink">Primary contact</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Name">
            <input className={inputClass} placeholder="Collins Christopher" />
          </Field>
          <Field label="Email">
            <input className={inputClass} type="email" placeholder="you@company.com" />
          </Field>
          <Field label="Role">
            <input className={inputClass} placeholder="Finance Manager" />
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-[16px] font-medium text-ink">Verification (KYC)</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <UploadTile label="Business registration" />
          <UploadTile label="Director ID" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-5">
          <Field label="Require my approval for payroll runs above">
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-muted">$</span>
              <input className={`${inputClass} max-w-[160px]`} defaultValue="10,000" />
            </div>
          </Field>
          <Field label="Default payroll schedule">
            <div className="flex flex-wrap gap-2">
              {["Monthly", "Bi-weekly", "Weekly", "Manual"].map((s) => {
                const on = schedule === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSchedule(s)}
                    aria-pressed={on}
                    className={`inline-flex h-10 items-center rounded-full border px-4 text-[13.5px] font-medium transition-colors ${
                      on ? "border-ink-deep bg-ink-deep text-white" : "border-line bg-canvas text-ink hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Step 2 ---------- */
function FundStep() {
  const [balance, setBalance] = useState(0);
  const [copied, setCopied] = useState(false);

  // simulate a deposit landing
  useEffect(() => {
    const t = window.setTimeout(() => setBalance(5000), 2600);
    return () => window.clearTimeout(t);
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(WALLET_ADDRESS).catch(() => { });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-2">
        <h1 className={headingClass}>Fund your wallet</h1>
        <p className="mt-3 text-[16px] text-muted">Add USDC so your agent can run payroll. You can also do this later.</p>
      </div>

      {/* live balance */}
      <Card tone="dark" padding={28}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] text-white/60">Current balance</div>
            <div className="tabular mt-2 font-display text-[40px] font-semibold leading-none tracking-[-0.03em] text-white">
              ${balance.toLocaleString("en-US")}
            </div>
          </div>
          {balance === 0 ? (
            <span className="flex items-center gap-2 text-[13px] text-white/60">
              <Loader2 size={14} className="animate-spin" /> Listening for deposits…
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-mint">
              <Check size={14} /> Deposit detected
            </span>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Option A */}
        <Card>
          <h3 className="mb-4 text-[16px] font-medium text-ink">Send USDC from an exchange</h3>
          <div className="mb-4 flex justify-center">
            <div className="rounded-[16px] border border-line p-2.5">
              <QrCode size={120} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border border-line bg-subtle px-3 py-2.5">
            <span className="break-all font-mono text-[12px] text-ink">{WALLET_ADDRESS}</span>
            <button type="button" onClick={copy} aria-label="Copy" className="shrink-0 text-muted hover:text-ink">
              {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
            </button>
          </div>
          <p className="mt-3 text-[13px] text-muted">Coinbase, Binance, or any Stellar wallet. USDC on Stellar only.</p>
        </Card>

        {/* Option B */}
        <Card>
          <h3 className="mb-4 text-[16px] font-medium text-ink">Bank transfer via anchor</h3>
          <ol className="divide-y divide-line">
            {[
              "Transfer from your business bank to the Cowrie anchor.",
              "Use reference DSB-4821 so we can match it.",
              "The anchor converts to USDC and credits your wallet.",
            ].map((s, i) => (
              <li key={i} className="flex gap-3 py-3 text-[14px] text-ink first:pt-0 last:pb-0">
                <span className="shrink-0 font-mono text-[12.5px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Recommendation */}
      <div className="rounded-[16px] bg-accent-soft px-5 py-4 text-[14px] leading-[1.5] text-accent">
        Your team of <strong className="font-medium">9</strong> will need roughly <strong className="font-medium">$12,180</strong>{" "}
        for the first run. Fund at least that to let the agent run automatically.
      </div>
    </div>
  );
}

/* ---------- Step 3 ---------- */
function ContractorStep() {
  const [state, setState] = useState<"empty" | "reading" | "done">("empty");
  const upload = () => {
    setState("reading");
    window.setTimeout(() => setState("done"), 1600);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-2">
        <h1 className={headingClass}>Add your first contractor</h1>
        <p className="mt-3 text-[16px] text-muted">Upload their contract and watch the agent do the rest.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input className={inputClass} placeholder="Laycon Okonkwo" />
          </Field>
          <Field label="Email">
            <input className={inputClass} placeholder="Laycon@company.com" />
          </Field>
          <Field label="Country">
            <select className={inputClass} defaultValue="Nigeria">
              <option>Nigeria</option>
              <option>Kenya</option>
              <option>Ghana</option>
              <option>South Africa</option>
            </select>
          </Field>
          <Field label="Monthly salary (USD)">
            <input className={inputClass} placeholder="900" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Stellar wallet address">
            <input className={`${inputClass} font-mono`} placeholder="G…" />
          </Field>
          <div className="mt-3">
            <Button variant="secondary" size="sm">
              <Mail size={14} /> Invite to create a wallet
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-[16px] font-medium text-ink">Contract &amp; timesheet</h3>
        {state === "empty" ? (
          <button
            type="button"
            onClick={upload}
            className="flex w-full flex-col items-center gap-2 rounded-[16px] border border-dashed border-line bg-canvas px-4 py-7 text-[14px] text-ink transition-colors hover:border-ink"
          >
            <Upload size={20} className="text-muted" />
            <span>Upload PDF or paste a Google Drive / Notion link</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-[16px] border border-solid border-accent bg-accent-soft px-4 py-3.5 text-[14px] text-accent">
            <FileText size={18} />
            <span>Laycon-contract.pdf</span>
          </div>
        )}

        {state === "reading" && (
          <div className="mt-4 flex items-center gap-2 text-[13.5px] text-muted">
            <Loader2 size={15} className="animate-spin" /> Agent is reading the contract…
          </div>
        )}

        {state === "done" && (
          <div className="mt-4 border-t border-line pt-4">
            <div className="mb-2 text-[13px] text-muted">I found the following terms</div>
            <ul className="divide-y divide-line">
              {[
                "Monthly salary of $900, paid on the 1st",
                "$300 milestone bonus on delivery",
                "Overtime at 1.25× above 40 hrs/week",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 py-2.5 text-[14px] text-ink">
                  <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Button size="sm">
                <Check size={14} /> Confirm terms
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
