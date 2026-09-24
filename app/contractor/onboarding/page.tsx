"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, Camera } from "lucide-react";
import { Badge, Button, Field, inputClass } from "@/components/portal/ui";
import { contractor } from "@/lib/contractor";

const STEPS = ["Welcome", "Wallet", "Currency", "Identity"];

const headingClass = "font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]";

const COUNTRIES = [
  { name: "Nigeria", flag: "🇳🇬", cur: "NGN" },
  { name: "Kenya", flag: "🇰🇪", cur: "KES" },
  { name: "Ghana", flag: "🇬🇭", cur: "GHS" },
  { name: "South Africa", flag: "🇿🇦", cur: "ZAR" },
];

export default function ContractorOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const total = STEPS.length;

  const next = () => (step < total - 1 ? setStep(step + 1) : router.push("/contractor"));

  return (
    <div>
      {/* progress */}
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

      <div className="rounded-[24px] border border-line bg-canvas p-6 md:p-8">
        {step === 0 && <Welcome />}
        {step === 1 && <WalletStep />}
        {step === 2 && <CountryStep />}
        {step === 3 && <KycStep />}
      </div>

      {/* nav */}
      <div className="mt-6 flex items-center justify-between">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={16} /> Back
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={next}>
          {step < total - 1 ? (
            <>
              Continue <ArrowRight size={16} />
            </>
          ) : (
            <>
              Go to my wallet <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div className="flex flex-col">
      <h1 className={headingClass}>Welcome, {contractor.firstName}.</h1>
      <p className="mt-4 text-[16px] leading-[1.5] text-muted">
        <strong className="font-medium text-ink">{contractor.employer}</strong> is now
        sending your payments through Disburs. You&rsquo;ll get paid in seconds and
        can cash out to your bank or mobile money anytime. No crypto knowledge
        needed.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <Field label="Confirm your name">
          <input className={inputClass} defaultValue={contractor.name} />
        </Field>
        <Field label="Confirm your email">
          <input className={inputClass} defaultValue={contractor.email} />
        </Field>
      </div>

      <div className="mt-6 rounded-[16px] bg-accent-soft px-5 py-4 text-[14px] leading-[1.5] text-accent">
        You can message the Disburs agent anytime if a payment looks off. It replies in plain language.
      </div>
    </div>
  );
}

function WalletStep() {
  const [choice, setChoice] = useState<"create" | "connect">("create");
  const tile = (on: boolean) =>
    `flex w-full flex-col items-start gap-1 rounded-[16px] border p-5 text-left transition-colors ${
      on ? "border-ink bg-subtle" : "border-line bg-canvas hover:border-ink"
    }`;
  return (
    <div className="flex flex-col">
      <h1 className={headingClass}>Where should we send your pay?</h1>
      <p className="mt-4 text-[16px] leading-[1.5] text-muted">
        Pick a wallet to receive your USDC. Most people create a Disburs wallet.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <button type="button" onClick={() => setChoice("create")} aria-pressed={choice === "create"} className={tile(choice === "create")}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-medium text-ink">Create a Disburs wallet</span>
            <Badge variant="success">Recommended</Badge>
          </div>
          <p className="text-[13.5px] leading-[1.45] text-muted">
            We set it up for you in one tap. Nothing to install, nothing to remember.
          </p>
        </button>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setChoice("connect")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setChoice("connect");
            }
          }}
          aria-pressed={choice === "connect"}
          className={`${tile(choice === "connect")} cursor-pointer`}
        >
          <span className="text-[15px] font-medium text-ink">Connect an existing Stellar wallet</span>
          <p className="text-[13.5px] leading-[1.45] text-muted">Already use Lobstr or Freighter? Paste your address.</p>
          {choice === "connect" && (
            <input
              className={`${inputClass} mt-3 font-mono`}
              placeholder="G…"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CountryStep() {
  const [country, setCountry] = useState("Nigeria");
  return (
    <div className="flex flex-col">
      <h1 className={headingClass}>Your local currency</h1>
      <p className="mt-4 text-[16px] leading-[1.5] text-muted">
        So we can show what your pay is worth and where to cash out.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {COUNTRIES.map((c) => {
          const on = country === c.name;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setCountry(c.name)}
              aria-pressed={on}
              className={`flex items-center gap-3 rounded-[16px] border p-4 text-left transition-colors ${
                on ? "border-ink bg-subtle" : "border-line bg-canvas hover:border-ink"
              }`}
            >
              <span className="text-[22px] leading-none">{c.flag}</span>
              <div>
                <div className="text-[14.5px] text-ink">{c.name}</div>
                <div className="text-[13px] text-muted">{c.cur}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <Field label="Phone number (for SMS payment alerts)" hint="We text you the moment a payment lands.">
          <input className={inputClass} defaultValue="+234 802 1234 41" />
        </Field>
      </div>
    </div>
  );
}

function KycTile({
  done,
  onClick,
  title,
  sub,
}: {
  done: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[16px] border p-5 text-left transition-colors ${
        done ? "border-solid border-accent bg-accent-soft" : "border-dashed border-line bg-canvas hover:border-ink"
      }`}
    >
      {done ? <Check size={20} className="shrink-0 text-accent" /> : <Camera size={20} className="shrink-0 text-muted" />}
      <div>
        <div className={`text-[15px] font-medium ${done ? "text-accent" : "text-ink"}`}>{done ? `${title} captured` : title}</div>
        <div className={`text-[13px] ${done ? "text-accent" : "text-muted"}`}>{done ? "Looks good" : sub}</div>
      </div>
    </button>
  );
}

function KycStep() {
  const [id, setId] = useState(false);
  const [addr, setAddr] = useState(false);

  return (
    <div className="flex flex-col">
      <h1 className={headingClass}>Quick identity check</h1>
      <p className="mt-4 text-[16px] leading-[1.5] text-muted">
        A legal requirement to receive payments. Takes about a minute.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <KycTile done={id} onClick={() => setId(true)} title="Government ID" sub="Tap to take a photo of your ID" />
        <KycTile done={addr} onClick={() => setAddr(true)} title="Proof of address" sub="Utility bill or bank statement" />
      </div>

      {id && addr && (
        <div className="mt-6 flex items-center gap-2 text-[14px] font-medium text-accent">
          <Check size={16} /> All set. Your documents are encrypted and secure.
        </div>
      )}
    </div>
  );
}
