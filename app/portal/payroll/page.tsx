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
import { Card, Badge, Button, Avatar, PageTitle, statusVariant } from "@/components/portal/ui";
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
      <div className="mx-auto flex max-w-[520px] flex-col items-center pt-10 text-center">
        <Check size={36} className="text-accent" />
        <h2 className="mt-5 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[40px]">
          {payrollLines.length} contractors paid.
        </h2>
        <p className="mt-3 text-[15px] text-muted">
          ${fmt(total)} USDC sent in a single Stellar transaction. Settled in 4 seconds.
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2">
          <span className="font-mono text-[13px] text-ink">tx GADT…K39P</span>
          <ExternalLink size={14} className="text-accent" />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/portal/history">View in history <ArrowRight size={16} /></Button>
          <Button href="/portal" variant="secondary">Back to dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <PageTitle
        sub={<>Period Dec 1 – Dec 31 · run date {nextPayroll.date}</>}
        action={
          <Badge variant={statusVariant(nextPayroll.status)} dot>
            {nextPayroll.status}
          </Badge>
        }
      >
        December payroll
      </PageTitle>

      {/* Agent summary */}
      <div className="flex gap-3 rounded-[24px] bg-accent-soft px-5 py-4">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-accent" />
        <p className="text-[14.5px] leading-[1.55] text-accent">
          I read all {payrollLines.length} contracts and timesheets. One bonus
          triggered, one overtime claim verified, and two amounts capped or
          carried over. Two flags need your eyes before I send.
        </p>
      </div>

      {/* Table */}
      <Card padding={0}>
        <div className="hidden items-center border-b border-line px-5 py-3 text-[12.5px] font-medium text-muted md:flex">
          <div className="flex-[2_1_0%]">Contractor</div>
          <div className="flex-[1.4_1_0%]">Basis</div>
          <div className="flex-[1_1_0%]">Wallet</div>
          <div className="flex-[1_1_0%] text-right">Amount</div>
          <div className="w-10" />
        </div>

        <div className="divide-y divide-line">
          {payrollLines.map((l) => (
            <div key={l.id}>
              <div className="flex flex-wrap items-center gap-y-2 px-5 py-4">
                <div className="flex flex-[2_1_200px] items-center gap-3">
                  <Avatar initials={l.initials} flag={l.flag} />
                  <div>
                    <div className="text-[14.5px] text-ink">{l.name}</div>
                    <div className="text-[13px] text-muted">{l.country}</div>
                  </div>
                </div>
                <div className="flex-[1.4_1_0%] text-[13.5px] text-muted">{l.basis}</div>
                <div className="flex-[1_1_0%]">
                  <Badge variant={statusVariant(l.wallet)}>{l.wallet}</Badge>
                </div>
                <div className="tabular flex-[1_1_0%] text-right text-[15px] font-medium text-ink">
                  ${fmt(l.amount)}
                </div>
                <button
                  className="flex w-10 justify-end text-faint hover:text-ink"
                  aria-label="Edit line"
                >
                  <Pencil size={15} />
                </button>
              </div>
              {l.flag_note && (
                <div className="px-5 pb-4 md:pl-[68px]">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-medium ${
                      l.flag_note.type === "warn"
                        ? "bg-[#FBF1DC] text-[#8A5A00]"
                        : "bg-accent-soft text-accent"
                    }`}
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
        </div>
      </Card>

      {/* FX + total */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-[16px] font-medium text-ink">FX selected by agent</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {Object.entries(fxRates).map(([country, r]) => (
              <div key={country}>
                <div className="text-[13px] text-muted">
                  {r.flag} {r.code}
                </div>
                <div className="tabular mt-1 font-display text-[22px] font-semibold tracking-[-0.03em] text-ink">
                  {fmt(r.rate)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-muted">
            Best available window today. Locks at execution.
          </p>
        </Card>

        <Card tone="dark" className="flex flex-col justify-between">
          <div>
            <div className="text-[13.5px] text-white/60">Total payout</div>
            <div className="tabular mt-3 font-display text-[36px] font-semibold leading-none tracking-[-0.03em] text-white">
              ${fmt(total)}
            </div>
            <div className="mt-3 text-[13px] text-white/55">
              USDC · {payrollLines.length} contractors · 0.5% fee ${fmt(Math.round(total * 0.005))}
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-line bg-canvas px-5 py-4">
        <div className="text-[14.5px] text-muted">
          Paying <strong className="font-medium text-ink">${fmt(total)} USDC</strong> to{" "}
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
