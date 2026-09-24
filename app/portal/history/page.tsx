"use client";

import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Download,
  FileText,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Card, Badge, Button, Avatar, PageTitle, statusVariant } from "@/components/portal/ui";
import { payrollRuns, payrollLines } from "@/lib/mock";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

const DISPUTES = [
  {
    name: "Bola Adewale",
    initials: "BA",
    flag: "🇳🇬",
    date: "Nov 1, 2026",
    summary: "Claimed 4 hrs of unpaid overtime.",
    resolution:
      "Agent checked ticket #2847, confirmed 4 hrs logged and approved, and paid an extra $360 automatically. Closed in 3 minutes.",
    amount: 360,
  },
  {
    name: "Amara Njoroge",
    initials: "AN",
    flag: "🇰🇪",
    date: "Oct 12, 2026",
    summary: "Payment arrived to an old wallet address.",
    resolution:
      "Agent verified the new wallet via a low-risk change check, reissued the payment, and updated her record. No double payment.",
    amount: 0,
  },
];

export default function HistoryPage() {
  const [tab, setTab] = useState<"runs" | "disputes">("runs");
  const [open, setOpen] = useState<string | null>(payrollRuns[0].id);

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub="Every run and every dispute, with the transaction behind it."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download size={14} /> Export CSV
            </Button>
            <Button variant="secondary" size="sm">
              <FileText size={14} /> PDF
            </Button>
          </div>
        }
      >
        History
      </PageTitle>

      <div className="flex flex-wrap gap-2">
        {(["runs", "disputes"] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={active}
              className={`inline-flex h-9 items-center rounded-full border px-4 text-[13.5px] font-medium transition-colors ${
                active
                  ? "border-ink-deep bg-ink-deep text-white"
                  : "border-line bg-canvas text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {t === "runs" ? "Payroll runs" : "Dispute history"}
            </button>
          );
        })}
      </div>

      {tab === "runs" && (
        <Card padding={0}>
          <div className="hidden items-center border-b border-line px-5 py-3 text-[12.5px] font-medium text-muted md:flex">
            <div className="flex-[1.2_1_0%]">Run date</div>
            <div className="flex-[1_1_0%]">Contractors</div>
            <div className="flex-[1.4_1_0%]">Transaction</div>
            <div className="flex-[1_1_0%]">Status</div>
            <div className="flex-[1_1_0%] text-right">Total</div>
            <div className="w-8" />
          </div>

          <div className="divide-y divide-line">
            {payrollRuns.map((run) => {
              const isOpen = open === run.id;
              return (
                <div key={run.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : run.id)}
                    aria-expanded={isOpen}
                    className="flex w-full flex-wrap items-center gap-y-1 px-5 py-4 text-left"
                  >
                    <div className="flex-[1.2_1_120px] text-[14.5px] text-ink">{run.date}</div>
                    <div className="flex-[1_1_0%] text-[14.5px] text-muted">{run.count}</div>
                    <div className="flex flex-[1.4_1_0%] items-center gap-1.5 text-accent">
                      <span className="font-mono text-[13px]">{run.tx}</span>
                      <ExternalLink size={13} />
                    </div>
                    <div className="flex-[1_1_0%]">
                      <Badge variant={statusVariant(run.status)}>{run.status}</Badge>
                    </div>
                    <div className="tabular flex-[1_1_0%] text-right text-[15px] font-medium text-ink">
                      ${fmt(run.total)}
                    </div>
                    <span className="flex w-8 justify-end text-muted">
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="bg-subtle px-5 pb-4">
                      <ul className="divide-y divide-line">
                        {payrollLines.slice(0, run.count).map((l) => (
                          <li key={l.id} className="flex items-center justify-between gap-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar initials={l.initials} flag={l.flag} size={30} />
                              <span className="text-[14px] text-ink">{l.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[13px] text-muted">{l.country}</span>
                              <span className="tabular text-[14.5px] font-medium text-ink">${fmt(l.amount)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === "disputes" && (
        <div className="flex flex-col gap-4">
          {DISPUTES.map((d) => (
            <Card key={d.name}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={d.initials} flag={d.flag} />
                  <div>
                    <div className="text-[14.5px] text-ink">{d.name}</div>
                    <div className="text-[13px] text-muted">{d.date}</div>
                  </div>
                </div>
                <Badge variant="success" dot>
                  Resolved
                </Badge>
              </div>
              <div className="mt-4 flex items-start gap-2 text-[14.5px] text-ink">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-muted" />
                {d.summary}
              </div>
              <div className="mt-3 flex gap-2 rounded-[24px] bg-accent-soft px-4 py-3">
                <Sparkles size={15} className="mt-0.5 shrink-0 text-accent" />
                <span className="text-[14px] leading-[1.5] text-accent">{d.resolution}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
