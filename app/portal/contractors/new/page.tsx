"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Check,
  Loader2,
  Mail,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Card, Button, Field, PageTitle, SectionHeading, inputClass } from "@/components/portal/ui";

const COUNTRIES = ["Nigeria", "Kenya", "Ghana", "South Africa"];
const TIMESHEETS = ["Google Sheets", "Notion", "CSV upload", "Manual"];
const RATE_TYPES = ["Monthly flat", "Hourly", "Milestone-based"];
const CHANNELS = ["Contractor portal", "Email", "WhatsApp"];

export default function AddContractorPage() {
  const [rateType, setRateType] = useState(RATE_TYPES[0]);
  const [timesheet, setTimesheet] = useState(TIMESHEETS[0]);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [contractState, setContractState] = useState<
    "empty" | "reading" | "done"
  >("empty");
  const [saved, setSaved] = useState(false);

  const uploadContract = () => {
    setContractState("reading");
    window.setTimeout(() => setContractState("done"), 1600);
  };

  return (
    <div className="mx-auto max-w-[820px]">
      <Link
        href="/portal/contractors"
        className="mb-6 inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Back to contractors
      </Link>

      <PageTitle sub="The agent will read the contract and work out the terms for you.">
        Add contractor
      </PageTitle>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2500);
        }}
        className="flex flex-col gap-5"
      >
        {/* Identity */}
        <Card>
          <SectionHeading title="Details" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input className={inputClass} placeholder="Laycon Okonkwo" />
            </Field>
            <Field label="Email">
              <input className={inputClass} type="email" placeholder="Laycon@company.com" />
            </Field>
            <Field label="Country">
              <select className={inputClass} defaultValue="Nigeria">
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Role / title">
              <input className={inputClass} placeholder="Product Designer" />
            </Field>
          </div>
        </Card>

        {/* Wallet */}
        <Card>
          <SectionHeading title="Payout wallet" />
          <Field
            label="Stellar wallet address"
            hint="New to crypto? Invite them to create a wallet and the agent walks them through it."
          >
            <input className={`${inputClass} font-mono`} placeholder="G…" />
          </Field>
          <div className="mt-3">
            <Button variant="secondary" size="sm">
              <Mail size={14} /> Invite to create wallet
            </Button>
          </div>
        </Card>

        {/* Pay */}
        <Card>
          <SectionHeading title="Payment" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Rate type">
              <div className="flex flex-wrap gap-2">
                {RATE_TYPES.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={rateType === t ? "ink" : "secondary"}
                    onClick={() => setRateType(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </Field>
            <Field label={rateType === "Hourly" ? "Hourly rate (USD)" : "Amount (USD)"}>
              <input className={inputClass} placeholder={rateType === "Hourly" ? "32" : "900"} />
            </Field>
            <Field label="Payout currency">
              <select className={inputClass} defaultValue="USDC → Local">
                <option>USDC → Local currency</option>
                <option>USDC (hold)</option>
              </select>
            </Field>
            <Field label="Offramp preference">
              <select className={inputClass}>
                <option>Auto (best rate)</option>
                <option>Cowrie</option>
                <option>Bank transfer</option>
              </select>
            </Field>
          </div>
        </Card>

        {/* Contract + agent interpretation */}
        <Card>
          <SectionHeading title="Contract" />

          {contractState === "empty" && (
            <button
              type="button"
              onClick={uploadContract}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-line bg-subtle px-6 py-8 transition-colors hover:border-ink"
            >
              <Upload size={22} className="text-muted" />
              <span className="text-[14.5px] text-ink">
                Upload PDF, Word, or paste a Google Drive / Notion link
              </span>
              <span className="text-[13px] text-muted">
                The agent reads it and extracts the terms
              </span>
            </button>
          )}

          {contractState !== "empty" && (
            <div className="flex items-center gap-3 rounded-[20px] border border-line bg-canvas px-4 py-3">
              <FileText size={18} className="text-accent" />
              <span className="text-[14.5px] text-ink">Laycon-okonkwo-contract.pdf</span>
            </div>
          )}

          {contractState === "reading" && (
            <div className="mt-3 flex items-center gap-2 text-[13px] text-accent">
              <Loader2 size={15} className="animate-spin" /> Agent is reading the
              contract…
            </div>
          )}

          {contractState === "done" && (
            <div className="mt-3 rounded-[20px] bg-accent-soft p-5">
              <div className="mb-2 flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
                <Sparkles size={14} /> I found the following terms
              </div>
              <ul className="flex flex-col gap-1.5">
                {[
                  "Monthly salary of $900, paid on the 1st",
                  "$300 milestone bonus on delivery of the design system",
                  "Overtime billed at 1.25× above 40 hrs/week",
                  "30-day notice period",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[14px] text-ink">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="ink">
                  <Check size={14} /> Confirm terms
                </Button>
                <Button size="sm" variant="ghost">
                  Edit manually
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Timesheet + dispute */}
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Timesheet source">
              <div className="flex flex-wrap gap-2">
                {TIMESHEETS.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={timesheet === t ? "ink" : "secondary"}
                    onClick={() => setTimesheet(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </Field>
            <Field label="Dispute contact channel">
              <select
                className={inputClass}
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                {CHANNELS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit">
            {saved ? (
              <>
                <Check size={16} /> Saved
              </>
            ) : (
              "Save contractor"
            )}
          </Button>
          <Button variant="secondary">Save &amp; add another</Button>
          <Link
            href="/portal/contractors"
            className="text-[14.5px] text-muted hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
