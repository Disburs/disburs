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
import { Card, Badge, Button, Avatar, statusVariant } from "@/components/portal/ui";
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1" style={{ background: "#F0F1F3", borderRadius: "10px", padding: "4px" }}>
          {(["runs", "disputes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                borderRadius: "8px",
                padding: "7px 16px",
                fontSize: "13px",
                fontWeight: 500,
                background: tab === t ? "#FFFFFF" : "transparent",
                color: tab === t ? "#1A1A1A" : "#8A8F98",
                boxShadow: tab === t ? "rgba(0,0,0,0.05) 0px 1px 2px" : "none",
              }}
            >
              {t === "runs" ? "Payroll runs" : "Dispute history"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="secondary" size="sm">
            <FileText size={14} /> PDF
          </Button>
        </div>
      </div>

      {tab === "runs" && (
        <Card padding={0}>
          <div
            className="hidden items-center md:flex"
            style={{ padding: "12px 20px", borderBottom: "1px solid #F0F1F3", fontSize: "12px", color: "#8A8F98" }}
          >
            <div style={{ flex: "1.2 1 0" }}>Run date</div>
            <div style={{ flex: "1 1 0" }}>Contractors</div>
            <div style={{ flex: "1.4 1 0" }}>Transaction</div>
            <div style={{ flex: "1 1 0" }}>Status</div>
            <div style={{ flex: "1 1 0", textAlign: "right" }}>Total</div>
            <div style={{ width: "32px" }} />
          </div>

          {payrollRuns.map((run, i) => {
            const isOpen = open === run.id;
            return (
              <div key={run.id} style={{ borderBottom: i < payrollRuns.length - 1 ? "1px solid #F0F1F3" : "none" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : run.id)}
                  className="flex w-full flex-wrap items-center gap-y-1 text-left"
                  style={{ padding: "14px 20px" }}
                >
                  <div style={{ flex: "1.2 1 120px", fontSize: "14px", color: "#1A1A1A" }}>
                    {run.date}
                  </div>
                  <div style={{ flex: "1 1 0", fontSize: "14px", color: "#5C6068" }}>
                    {run.count}
                  </div>
                  <div style={{ flex: "1.4 1 0" }} className="flex items-center gap-1.5">
                    <span className="font-mono" style={{ fontSize: "13px", color: "#0550AE" }}>
                      {run.tx}
                    </span>
                    <ExternalLink size={13} color="#0550AE" />
                  </div>
                  <div style={{ flex: "1 1 0" }}>
                    <Badge variant={statusVariant(run.status)}>{run.status}</Badge>
                  </div>
                  <div
                    style={{ flex: "1 1 0", textAlign: "right", fontSize: "15px", color: "#1A1A1A" }}
                    className="font-medium"
                  >
                    ${fmt(run.total)}
                  </div>
                  <span style={{ width: "32px" }} className="flex justify-end">
                    <ChevronDown
                      size={18}
                      color="#8A8F98"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 20px 16px", background: "#FBFCFC" }}>
                    {payrollLines.slice(0, run.count).map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between"
                        style={{ padding: "10px 0", borderBottom: "1px solid #F0F1F3" }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar initials={l.initials} flag={l.flag} size={30} />
                          <span style={{ fontSize: "13.5px", color: "#1A1A1A" }}>{l.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span style={{ fontSize: "13px", color: "#8A8F98" }}>{l.country}</span>
                          <span className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
                            ${fmt(l.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
                    <div style={{ fontSize: "14px", color: "#1A1A1A" }}>{d.name}</div>
                    <div style={{ fontSize: "12px", color: "#8A8F98" }}>{d.date}</div>
                  </div>
                </div>
                <Badge variant="success" dot>
                  Resolved
                </Badge>
              </div>
              <div className="mt-3 flex items-start gap-2" style={{ fontSize: "14px", color: "#1A1A1A" }}>
                <MessageCircle size={16} color="#8A8F98" className="mt-0.5 shrink-0" />
                {d.summary}
              </div>
              <div
                className="mt-3 flex gap-2"
                style={{ background: "#F7FBF8", border: "1px solid #DEF6E9", borderRadius: "10px", padding: "12px 14px" }}
              >
                <Sparkles size={15} color="#0A9200" className="mt-0.5 shrink-0" />
                <span style={{ fontSize: "13.5px", color: "#1A5028", lineHeight: 1.5 }}>
                  {d.resolution}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
