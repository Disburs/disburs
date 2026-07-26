"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Mail,
  ArrowRight,
  ArrowLeft,
  Coins,
  Building2,
} from "lucide-react";
import { Card, Button, QrCode } from "@/components/portal/ui";
import { WALLET_ADDRESS } from "@/lib/mock";

const STEPS = ["Company", "Fund wallet", "First contractor"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "42px",
  borderRadius: "8px",
  border: "1px solid #E8E8E8",
  padding: "0 12px",
  fontSize: "14px",
  color: "#1A1A1A",
  background: "#FFFFFF",
  outline: "none",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-medium" style={{ fontSize: "13px", color: "#1A1A1A" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function UploadTile({ label }: { label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone(true)}
      className="flex w-full items-center gap-3"
      style={{
        border: done ? "1px solid #DEF6E9" : "1.5px dashed #D0D4D9",
        background: done ? "#F7FBF8" : "#FBFCFC",
        borderRadius: "10px",
        padding: "14px",
        textAlign: "left",
      }}
    >
      {done ? <Check size={18} color="#0A9200" /> : <Upload size={18} color="#8A8F98" />}
      <span style={{ fontSize: "13.5px", color: done ? "#0A7A1E" : "#1A1A1A" }}>
        {done ? `${label} uploaded` : label}
      </span>
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const next = () => (step < 2 ? setStep(step + 1) : router.push("/portal"));
  const back = () => step > 0 && setStep(step - 1);

  return (
    <main style={{ background: "#F7F8F9", minHeight: "100vh" }}>
      {/* Top bar */}
      <header
        className="flex items-center justify-between"
        style={{ height: "64px", padding: "0 24px", borderBottom: "1px solid #E8E8E8", background: "#FFFFFF" }}
      >
        <span className="font-medium" style={{ fontSize: "19px", color: "#1A1A1A" }}>
          disburs<span style={{ color: "#12FF80" }}>.</span>
        </span>
        <a href="/portal" style={{ fontSize: "13px", color: "#8A8F98" }}>
          Skip setup
        </a>
      </header>

      <div className="mx-auto" style={{ maxWidth: "680px", padding: "40px 20px 80px" }}>
        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center font-medium"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "9999px",
                    fontSize: "13px",
                    background: i <= step ? "#12FF80" : "#E8E8E8",
                    color: i <= step ? "#1A1A1A" : "#8A8F98",
                  }}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </span>
                <span
                  className="hidden sm:inline"
                  style={{ fontSize: "13px", fontWeight: i === step ? 500 : 400, color: i === step ? "#1A1A1A" : "#8A8F98" }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span style={{ width: "28px", height: "1px", background: "#D7DADF" }} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-1 text-center" style={{ fontSize: "13px", color: "#8A8F98" }}>
          Step {step + 1} of 3
        </div>

        {step === 0 && <CompanyStep />}
        {step === 1 && <FundStep />}
        {step === 2 && <ContractorStep />}

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button onClick={back} className="flex items-center gap-1.5" style={{ fontSize: "14px", color: "#8A8F98" }}>
              <ArrowLeft size={15} /> Back
            </button>
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
      <div className="text-center">
        <h1 className="font-medium" style={{ fontSize: "26px", color: "#1A1A1A" }}>
          Tell us about your company
        </h1>
        <p className="mt-1" style={{ fontSize: "14px", color: "#8A8F98" }}>
          We use this to set up your account and verify your business.
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <input style={inputStyle} placeholder="Northwind Studios" />
          </Field>
          <Field label="Registration number">
            <input style={inputStyle} placeholder="RC 1284501" />
          </Field>
          <Field label="Country of incorporation">
            <select style={inputStyle} defaultValue="Nigeria">
              <option>Nigeria</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>Kenya</option>
            </select>
          </Field>
          <Field label="Payroll currency">
            <select style={inputStyle} defaultValue="USDC">
              <option>USDC</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
          Primary contact
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Name">
            <input style={inputStyle} placeholder="Collins Christopher" />
          </Field>
          <Field label="Email">
            <input style={inputStyle} type="email" placeholder="you@company.com" />
          </Field>
          <Field label="Role">
            <input style={inputStyle} placeholder="Finance Manager" />
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
          Verification (KYC)
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <UploadTile label="Business registration" />
          <UploadTile label="Director ID" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4">
          <Field label="Require my approval for payroll runs above">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "15px", color: "#8A8F98" }}>$</span>
              <input style={{ ...inputStyle, width: "160px" }} defaultValue="10,000" />
            </div>
          </Field>
          <Field label="Default payroll schedule">
            <div className="flex flex-wrap gap-2">
              {["Monthly", "Bi-weekly", "Weekly", "Manual"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSchedule(s)}
                  style={{
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "13px",
                    fontWeight: 500,
                    background: schedule === s ? "#DEF6E9" : "#FFFFFF",
                    color: schedule === s ? "#0A7A1E" : "#5C6068",
                    border: "1px solid " + (schedule === s ? "#BFEBD0" : "#E8E8E8"),
                  }}
                >
                  {s}
                </button>
              ))}
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
      <div className="text-center">
        <h1 className="font-medium" style={{ fontSize: "26px", color: "#1A1A1A" }}>
          Fund your wallet
        </h1>
        <p className="mt-1" style={{ fontSize: "14px", color: "#8A8F98" }}>
          Add USDC so your agent can run payroll. You can also do this later.
        </p>
      </div>

      {/* live balance */}
      <Card style={{ background: "#1A1A1A", border: "none" }}>
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
              Current balance
            </div>
            <div className="mt-1 font-medium" style={{ fontSize: "34px", color: "#FFFFFF" }}>
              ${balance.toLocaleString("en-US")}
            </div>
          </div>
          {balance === 0 ? (
            <span className="flex items-center gap-2" style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
              <Loader2 size={14} className="animate-spin" /> Listening for deposits…
            </span>
          ) : (
            <span
              className="flex items-center gap-1.5 font-medium"
              style={{ fontSize: "13px", color: "#12FF80", background: "rgba(18,255,128,0.12)", padding: "6px 10px", borderRadius: "8px" }}
            >
              <Check size={14} /> Deposit detected
            </span>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Option A */}
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Coins size={16} color="#0A9200" />
            <h3 className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
              Send USDC from an exchange
            </h3>
          </div>
          <div className="flex justify-center" style={{ marginBottom: "12px" }}>
            <div style={{ border: "1px solid #E8E8E8", borderRadius: "12px", padding: "10px" }}>
              <QrCode size={120} />
            </div>
          </div>
          <div
            className="flex items-center justify-between gap-2"
            style={{ background: "#F7F8F9", border: "1px solid #E8E8E8", borderRadius: "8px", padding: "10px 12px" }}
          >
            <span className="font-mono" style={{ fontSize: "12px", color: "#1A1A1A", wordBreak: "break-all" }}>
              {WALLET_ADDRESS}
            </span>
            <button onClick={copy} aria-label="Copy">
              {copied ? <Check size={15} color="#0A9200" /> : <Copy size={15} color="#8A8F98" />}
            </button>
          </div>
          <p className="mt-2" style={{ fontSize: "12px", color: "#8A8F98" }}>
            Coinbase, Binance, or any Stellar wallet. USDC on Stellar only.
          </p>
        </Card>

        {/* Option B */}
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Building2 size={16} color="#0A9200" />
            <h3 className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
              Bank transfer via anchor
            </h3>
          </div>
          <ol className="flex flex-col gap-2.5">
            {[
              "Transfer from your business bank to the Cowrie anchor.",
              "Use reference DSB-4821 so we can match it.",
              "The anchor converts to USDC and credits your wallet.",
            ].map((s, i) => (
              <li key={i} className="flex gap-2.5" style={{ fontSize: "13.5px", color: "#1A1A1A" }}>
                <span
                  className="flex shrink-0 items-center justify-center font-medium"
                  style={{ width: "20px", height: "20px", borderRadius: "9999px", background: "#DEF6E9", color: "#0A9200", fontSize: "11px" }}
                >
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Recommendation */}
      <div
        className="flex items-start gap-2"
        style={{ background: "#F7FBF8", border: "1px solid #DEF6E9", borderRadius: "12px", padding: "14px 16px" }}
      >
        <Sparkles size={16} color="#0A9200" className="mt-0.5 shrink-0" />
        <span style={{ fontSize: "13.5px", color: "#1A5028", lineHeight: 1.5 }}>
          Your team of <strong>9</strong> will need roughly <strong>$12,180</strong>{" "}
          for the first run. Fund at least that to let the agent run automatically.
        </span>
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
      <div className="text-center">
        <h1 className="font-medium" style={{ fontSize: "26px", color: "#1A1A1A" }}>
          Add your first contractor
        </h1>
        <p className="mt-1" style={{ fontSize: "14px", color: "#8A8F98" }}>
          Upload their contract and watch the agent do the rest.
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input style={inputStyle} placeholder="Laycon Okonkwo" />
          </Field>
          <Field label="Email">
            <input style={inputStyle} placeholder="Laycon@company.com" />
          </Field>
          <Field label="Country">
            <select style={inputStyle} defaultValue="Nigeria">
              <option>Nigeria</option>
              <option>Kenya</option>
              <option>Ghana</option>
              <option>South Africa</option>
            </select>
          </Field>
          <Field label="Monthly salary (USD)">
            <input style={inputStyle} placeholder="900" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Stellar wallet address">
            <input style={inputStyle} className="font-mono" placeholder="G…" />
          </Field>
          <div className="mt-2">
            <Button variant="secondary" size="sm">
              <Mail size={14} /> Invite to create a wallet
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
          Contract &amp; timesheet
        </h3>
        {state === "empty" ? (
          <button
            type="button"
            onClick={upload}
            className="flex w-full flex-col items-center gap-2"
            style={{ border: "1.5px dashed #D0D4D9", borderRadius: "12px", padding: "26px", background: "#FBFCFC" }}
          >
            <Upload size={20} color="#8A8F98" />
            <span style={{ fontSize: "14px", color: "#1A1A1A" }}>
              Upload PDF or paste a Google Drive / Notion link
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3" style={{ border: "1px solid #E8E8E8", borderRadius: "10px", padding: "12px 14px" }}>
            <FileText size={18} color="#0A9200" />
            <span style={{ fontSize: "14px", color: "#1A1A1A" }}>Laycon-contract.pdf</span>
          </div>
        )}

        {state === "reading" && (
          <div className="mt-3 flex items-center gap-2" style={{ fontSize: "13px", color: "#0A9200" }}>
            <Loader2 size={15} className="animate-spin" /> Agent is reading the contract…
          </div>
        )}

        {state === "done" && (
          <div className="mt-3" style={{ background: "#F7FBF8", border: "1px solid #DEF6E9", borderRadius: "12px", padding: "16px" }}>
            <div className="mb-2 flex items-center gap-1.5 font-medium" style={{ fontSize: "13px", color: "#0A7A1E" }}>
              <Sparkles size={14} color="#0A9200" /> I found the following terms
            </div>
            <ul className="flex flex-col gap-1.5">
              {[
                "Monthly salary of $900, paid on the 1st",
                "$300 milestone bonus on delivery",
                "Overtime at 1.25× above 40 hrs/week",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2" style={{ fontSize: "13.5px", color: "#1A1A1A" }}>
                  <Check size={15} color="#0A9200" className="mt-0.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-3">
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
