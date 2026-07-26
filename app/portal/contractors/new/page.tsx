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
import { Card, Button } from "@/components/portal/ui";

const COUNTRIES = ["Nigeria", "Kenya", "Ghana", "South Africa"];
const TIMESHEETS = ["Google Sheets", "Notion", "CSV upload", "Manual"];
const RATE_TYPES = ["Monthly flat", "Hourly", "Milestone-based"];
const CHANNELS = ["Contractor portal", "Email", "WhatsApp"];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block font-medium"
        style={{ fontSize: "13px", color: "#1A1A1A" }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block" style={{ fontSize: "12px", color: "#8A8F98" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

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
    <div className="mx-auto" style={{ maxWidth: "820px" }}>
      <Link
        href="/portal/contractors"
        className="mb-4 inline-flex items-center gap-1.5"
        style={{ fontSize: "13px", color: "#8A8F98" }}
      >
        <ArrowLeft size={15} /> Back to contractors
      </Link>

      <h2 className="font-medium" style={{ fontSize: "20px", color: "#1A1A1A" }}>
        Add contractor
      </h2>
      <p style={{ fontSize: "13px", color: "#8A8F98", marginTop: "2px" }}>
        The agent will read the contract and work out the terms for you.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2500);
        }}
        className="mt-6 flex flex-col gap-5"
      >
        {/* Identity */}
        <Card>
          <h3
            className="mb-4 font-medium"
            style={{ fontSize: "15px", color: "#1A1A1A" }}
          >
            Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input style={inputStyle} placeholder="Laycon Okonkwo" />
            </Field>
            <Field label="Email">
              <input style={inputStyle} type="email" placeholder="Laycon@company.com" />
            </Field>
            <Field label="Country">
              <select style={inputStyle} defaultValue="Nigeria">
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Role / title">
              <input style={inputStyle} placeholder="Product Designer" />
            </Field>
          </div>
        </Card>

        {/* Wallet */}
        <Card>
          <h3
            className="mb-4 font-medium"
            style={{ fontSize: "15px", color: "#1A1A1A" }}
          >
            Payout wallet
          </h3>
          <Field
            label="Stellar wallet address"
            hint="New to crypto? Invite them to create a wallet and the agent walks them through it."
          >
            <input style={inputStyle} placeholder="G…" className="font-mono" />
          </Field>
          <div className="mt-3">
            <Button variant="secondary" size="sm">
              <Mail size={14} /> Invite to create wallet
            </Button>
          </div>
        </Card>

        {/* Pay */}
        <Card>
          <h3
            className="mb-4 font-medium"
            style={{ fontSize: "15px", color: "#1A1A1A" }}
          >
            Payment
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Rate type">
              <div className="flex flex-wrap gap-2">
                {RATE_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRateType(t)}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontWeight: 500,
                      background: rateType === t ? "#DEF6E9" : "#FFFFFF",
                      color: rateType === t ? "#0A7A1E" : "#5C6068",
                      border:
                        "1px solid " + (rateType === t ? "#BFEBD0" : "#E8E8E8"),
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={rateType === "Hourly" ? "Hourly rate (USD)" : "Amount (USD)"}>
              <input style={inputStyle} placeholder={rateType === "Hourly" ? "32" : "900"} />
            </Field>
            <Field label="Payout currency">
              <select style={inputStyle} defaultValue="USDC → Local">
                <option>USDC → Local currency</option>
                <option>USDC (hold)</option>
              </select>
            </Field>
            <Field label="Offramp preference">
              <select style={inputStyle}>
                <option>Auto (best rate)</option>
                <option>Cowrie</option>
                <option>Bank transfer</option>
              </select>
            </Field>
          </div>
        </Card>

        {/* Contract + agent interpretation */}
        <Card>
          <h3
            className="mb-4 font-medium"
            style={{ fontSize: "15px", color: "#1A1A1A" }}
          >
            Contract
          </h3>

          {contractState === "empty" && (
            <button
              type="button"
              onClick={uploadContract}
              className="flex w-full flex-col items-center justify-center gap-2"
              style={{
                border: "1.5px dashed #D0D4D9",
                borderRadius: "12px",
                padding: "28px",
                background: "#FBFCFC",
              }}
            >
              <Upload size={22} color="#8A8F98" />
              <span style={{ fontSize: "14px", color: "#1A1A1A" }}>
                Upload PDF, Word, or paste a Google Drive / Notion link
              </span>
              <span style={{ fontSize: "12px", color: "#8A8F98" }}>
                The agent reads it and extracts the terms
              </span>
            </button>
          )}

          {contractState !== "empty" && (
            <div
              className="flex items-center gap-3"
              style={{
                border: "1px solid #E8E8E8",
                borderRadius: "10px",
                padding: "12px 14px",
              }}
            >
              <FileText size={18} color="#0A9200" />
              <span style={{ fontSize: "14px", color: "#1A1A1A" }}>
                Laycon-okonkwo-contract.pdf
              </span>
            </div>
          )}

          {contractState === "reading" && (
            <div
              className="mt-3 flex items-center gap-2"
              style={{ fontSize: "13px", color: "#0A9200" }}
            >
              <Loader2 size={15} className="animate-spin" /> Agent is reading the
              contract…
            </div>
          )}

          {contractState === "done" && (
            <div
              className="mt-3"
              style={{
                background: "#F7FBF8",
                border: "1px solid #DEF6E9",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div
                className="mb-2 flex items-center gap-1.5 font-medium"
                style={{ fontSize: "13px", color: "#0A7A1E" }}
              >
                <Sparkles size={14} color="#0A9200" /> I found the following terms
              </div>
              <ul className="flex flex-col gap-1.5">
                {[
                  "Monthly salary of $900, paid on the 1st",
                  "$300 milestone bonus on delivery of the design system",
                  "Overtime billed at 1.25× above 40 hrs/week",
                  "30-day notice period",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2"
                    style={{ fontSize: "13.5px", color: "#1A1A1A" }}
                  >
                    <Check size={15} color="#0A9200" className="mt-0.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <Button size="sm">
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
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimesheet(t)}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontWeight: 500,
                      background: timesheet === t ? "#1A1A1A" : "#FFFFFF",
                      color: timesheet === t ? "#FFFFFF" : "#5C6068",
                      border:
                        "1px solid " + (timesheet === t ? "#1A1A1A" : "#E8E8E8"),
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Dispute contact channel">
              <select
                style={inputStyle}
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
            style={{ fontSize: "14px", color: "#8A8F98" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
