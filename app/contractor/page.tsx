"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Badge, Button, PageTitle } from "@/components/portal/ui";
import { contractor, payments, cashouts, ngn } from "@/lib/contractor";

export default function ContractorHome() {
  const localValue = contractor.balance * contractor.rate;
  const lastPayment = payments[0];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle sub={<>Here&rsquo;s your money from {contractor.employer}.</>}>Hi {contractor.firstName}</PageTitle>

      {/* Top row: balance + last payment / actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Balance hero */}
        <div className="on-dark rounded-[24px] bg-ink-deep p-7 md:p-8 lg:col-span-2">
          <div className="flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <div className="text-[13px] text-white/60">Available balance</div>
              <div className="tabular mt-2 font-display text-[44px] font-semibold leading-none tracking-[-0.03em] text-white md:text-[56px]">
                ${ngn(contractor.balance)}
                <span className="ml-2 font-sans text-[18px] font-normal tracking-normal text-white/50">USDC</span>
              </div>
              <div className="tabular mt-3 text-[15px] text-mint">
                ≈ ₦{ngn(localValue)} {contractor.currency}
              </div>
            </div>
            <Button href="/contractor/cashout">
              Convert to local currency <ArrowRight size={16} />
            </Button>
          </div>
        </div>

        {/* Last payment + message */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[24px] border border-line bg-canvas p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="text-[13px] text-muted">Last payment</div>
              <Badge variant="success" dot>
                Received
              </Badge>
            </div>
            <div className="tabular mt-2 font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-ink">
              +${ngn(lastPayment.amount)} <span className="font-sans text-[14px] font-normal tracking-normal text-muted">USDC</span>
            </div>
            <div className="mt-2 text-[13px] text-muted">{lastPayment.date}</div>
          </div>

          <Link
            href="/contractor/messages"
            className="flex flex-1 items-center justify-between gap-3 rounded-[24px] border border-line bg-subtle p-5 transition-colors hover:border-ink"
          >
            <div>
              <div className="text-[15px] font-medium text-ink">Message the agent</div>
              <div className="mt-1 text-[13px] text-muted">Something looks off? Ask in plain words.</div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-muted" />
          </Link>
        </div>
      </div>

      {/* Bottom row: payments + cashout history */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Payments received">
          {payments.map((p, i) => (
            <Row
              key={i}
              title={p.company}
              sub={p.date}
              right={
                <div className="text-right">
                  <div className="tabular text-[14.5px] font-medium text-ink">+${ngn(p.amount)}</div>
                  <div className={`text-[12.5px] ${p.status === "Received" ? "text-accent" : "text-muted"}`}>{p.status}</div>
                </div>
              }
            />
          ))}
        </Section>

        <Section title="Cash-out history">
          {cashouts.map((c, i) => (
            <Row
              key={i}
              title={`${c.usdc} USDC → ₦${ngn(c.local)}`}
              sub={`${c.method} · ${c.date}`}
              right={<Check size={16} className="text-accent" />}
            />
          ))}
          {cashouts.length === 0 && <div className="py-5 text-[13.5px] text-muted">No cash-outs yet.</div>}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-line bg-canvas px-5 pb-1 pt-5">
      <h3 className="mb-1 text-[16px] font-medium text-ink">{title}</h3>
      <div className="divide-y divide-line">{children}</div>
    </div>
  );
}

function Row({ title, sub, right }: { title: string; sub: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <div className="tabular truncate text-[14.5px] text-ink">{title}</div>
        <div className="mt-0.5 text-[13px] text-muted">{sub}</div>
      </div>
      {right}
    </div>
  );
}
