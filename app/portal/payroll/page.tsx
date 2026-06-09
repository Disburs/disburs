"use client";

import { useState } from "react";
import {
  Sparkles,
  TriangleAlert,
  Gift,
  Check,
  Loader2,
  ExternalLink,
  CalendarClock,
  Pencil,
  ArrowRight,
} from "lucide-react";
import { Card, Badge, Button, Avatar, statusVariant } from "@/components/portal/ui";
import { payrollLines, fxRates, nextPayroll } from "@/lib/mock";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

const total = payrollLines.reduce((s, l) => s + l.amount, 0);

export default function PayrollPage() {
  const [phase, setPhase] = useState<"review" | "running" | "done">("review");

  const execute = () => {
    setPhase("running");
    window.setTimeout(() => setPhase("done"), 2400);
  };

  if (phase === "done") {
    return (
      <div className="mx-auto flex flex-col items-center text-center" style={{ maxWidth: "520px", paddingTop: "40px" }}>
        <span
          className="flex items-center justify-center"
          style={{ width: "64px", height: "64px", borderRadius: "9999px", background: "#DEF6E9" }}
        >
          <Check size={30} color="#0A9200" />
        </span>
        <h2 className="mt-5 font-medium" style={{ fontSize: "24px", color: "#1A1A1A" }}>
          {payrollLines.length} contractors paid.
        </h2>
        <p className="mt-2" style={{ fontSize: "15px", color: "#8A8F98" }}>
          ${fmt(total)} USDC sent in a single Stellar transaction. Settled in 4 seconds.
        </p>
        <div
          className="mt-5 flex items-center gap-2"
          style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "10px", padding: "10px 14px" }}
        >
          <span className="font-mono" style={{ fontSize: "13px", color: "#1A1A1A" }}>
            tx GADT…K39P
          </span>
          <ExternalLink size={14} color="#0550AE" />
        </div>
        <div className="mt-6 flex gap-3">
          <Button href="/portal/history">View in history <ArrowRight size={16} /></Button>
          <Button href="/portal" variant="secondary">Back to dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-medium" style={{ fontSize: "20px", color: "#1A1A1A" }}>
            December payroll
          </h2>
          <p style={{ fontSize: "13px", color: "#8A8F98", marginTop: "2px" }}>
            Period Dec 1 – Dec 31 · run date {nextPayroll.date}
          </p>
        </div>
        <Badge variant={statusVariant(nextPayroll.status)} dot>
          {nextPayroll.status}
        </Badge>
      </div>

      {/* Agent summary */}
      <div
        className="flex gap-3"
        style={{ background: "#F7FBF8", border: "1px solid #DEF6E9", borderRadius: "12px", padding: "16px 18px" }}
      >
        <Sparkles size={18} color="#0A9200" className="mt-0.5 shrink-0" />
        <p style={{ fontSize: "14px", color: "#1A5028", lineHeight: 1.55 }}>
          I read all {payrollLines.length} contracts and timesheets. One bonus
          triggered, one overtime claim verified, and two amounts capped or
          carried over. Two flags need your eyes before I send.
        </p>
      </div>

      {/* Table */}
      <Card padding={0}>
        <div
          className="hidden items-center md:flex"
          style={{ padding: "12px 20px", borderBottom: "1px solid #F0F1F3", fontSize: "12px", color: "#8A8F98" }}
        >
          <div style={{ flex: "2 1 0" }}>Contractor</div>
          <div style={{ flex: "1.4 1 0" }}>Basis</div>
          <div style={{ flex: "1 1 0" }}>Wallet</div>
          <div style={{ flex: "1 1 0", textAlign: "right" }}>Amount</div>
          <div style={{ width: "40px" }} />
        </div>

        {payrollLines.map((l, i) => (
          <div key={l.id} style={{ borderBottom: i < payrollLines.length - 1 ? "1px solid #F0F1F3" : "none" }}>
            <div className="flex flex-wrap items-center gap-y-2" style={{ padding: "14px 20px" }}>
              <div style={{ flex: "2 1 200px" }} className="flex items-center gap-3">
                <Avatar initials={l.initials} flag={l.flag} />
                <div>
                  <div style={{ fontSize: "14px", color: "#1A1A1A" }}>{l.name}</div>
                  <div style={{ fontSize: "12px", color: "#8A8F98" }}>{l.country}</div>
                </div>
              </div>
              <div style={{ flex: "1.4 1 0", fontSize: "13px", color: "#5C6068" }}>
                {l.basis}
              </div>
              <div style={{ flex: "1 1 0" }}>
                <Badge variant={statusVariant(l.wallet)}>{l.wallet}</Badge>
              </div>
              <div
                style={{ flex: "1 1 0", textAlign: "right", fontSize: "15px", color: "#1A1A1A" }}
                className="font-medium"
              >
                ${fmt(l.amount)}
              </div>
              <button style={{ width: "40px", textAlign: "right" }} aria-label="Edit line">
                <Pencil size={15} color="#8A8F98" />
              </button>
            </div>
            {l.flag_note && (
              <div style={{ padding: "0 20px 14px 71px" }}>
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{
                    background: l.flag_note.type === "warn" ? "#FBEFD6" : "#DEF6E9",
                    color: l.flag_note.type === "warn" ? "#A66A00" : "#0A7A1E",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    fontSize: "12.5px",
                  }}
                >
                  {l.flag_note.type === "warn" ? (
                    <TriangleAlert size={13} />
                  ) : (
                    <Gift size={13} />
                  )}
                  {l.flag_note.text}
                </span>
              </div>
            )}
          </div>
        ))}
      </Card>

      {/* FX + total */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-3 font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
            FX selected by agent
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {Object.entries(fxRates).map(([country, r]) => (
              <div key={country}>
                <div style={{ fontSize: "12px", color: "#8A8F98" }}>
                  {r.flag} {r.code}
                </div>
                <div className="mt-0.5 font-medium" style={{ fontSize: "16px", color: "#1A1A1A" }}>
                  {fmt(r.rate)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3" style={{ fontSize: "12px", color: "#8A8F98" }}>
            Best available window today. Locks at execution.
          </p>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div style={{ fontSize: "13px", color: "#8A8F98" }}>Total payout</div>
            <div className="mt-1 font-medium" style={{ fontSize: "30px", color: "#1A1A1A" }}>
              ${fmt(total)}
            </div>
            <div style={{ fontSize: "12px", color: "#8A8F98", marginTop: "2px" }}>
              USDC · {payrollLines.length} contractors · 0.5% fee ${fmt(Math.round(total * 0.005))}
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky action bar */}
      <div
        className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E8E8",
          borderRadius: "14px",
          padding: "14px 18px",
          boxShadow: "rgba(0,0,0,0.06) 0px 6px 20px 0px",
        }}
      >
        <div style={{ fontSize: "14px", color: "#5C6068" }}>
          Paying <strong style={{ color: "#1A1A1A" }}>${fmt(total)} USDC</strong> to{" "}
          {payrollLines.length} contractors
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            <Pencil size={14} /> Edit manually
          </Button>
          <Button variant="secondary" size="sm">
            <CalendarClock size={14} /> Schedule for later
          </Button>
          <Button onClick={execute} disabled={phase === "running"}>
            {phase === "running" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Executing…
              </>
            ) : (
              <>
                <Check size={16} /> Approve &amp; Execute
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
