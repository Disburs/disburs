"use client";

import Link from "next/link";
import {
  CheckCircle2,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Bell,
  FileText,
  Wallet as WalletIcon,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Card, Badge, Button, statusVariant } from "@/components/portal/ui";
import {
  activityFeed,
  nextPayroll,
  payrollRuns,
  company,
  type Activity,
} from "@/lib/mock";

const ICONS: Record<Activity["icon"], LucideIcon> = {
  check: CheckCircle2,
  dispute: MessageCircle,
  fx: TrendingUp,
  shield: ShieldCheck,
  bell: Bell,
  file: FileText,
  wallet: WalletIcon,
};

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-medium" style={{ fontSize: "22px", color: "#1A1A1A" }}>
            Good morning, {company.contact.split(" ")[0]}.
          </h2>
          <p style={{ fontSize: "14px", color: "#8A8F98", marginTop: "2px" }}>
            Here&rsquo;s what your agent has been doing.
          </p>
        </div>
        <Button href="/portal/chat" variant="secondary">
          <Sparkles size={16} color="#0A9200" /> Talk to agent
        </Button>
      </div>

      {/* Alert banner */}
      <div
        className="flex flex-wrap items-center justify-between gap-3"
        style={{
          background: "#FBEFD6",
          border: "1px solid #F2DDA8",
          borderRadius: "12px",
          padding: "14px 18px",
        }}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle size={18} color="#A66A00" />
          <span style={{ fontSize: "14px", color: "#7A5200" }}>
            Balance is <strong>${fmt(company.balance)}</strong>. The Dec 1 run
            needs <strong>${fmt(nextPayroll.total)}</strong>. Top up{" "}
            <strong>$2,600</strong> to stay covered.
          </span>
        </div>
        <Button href="/portal/wallet" size="sm">
          Top up wallet
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: next payroll + stats + history */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Next payroll */}
          <Card padding={0}>
            <div
              className="flex flex-wrap items-center justify-between gap-3"
              style={{ padding: "20px 24px", borderBottom: "1px solid #F0F1F3" }}
            >
              <div>
                <div style={{ fontSize: "13px", color: "#8A8F98" }}>
                  Next payroll
                </div>
                <div
                  className="mt-1 font-medium"
                  style={{ fontSize: "20px", color: "#1A1A1A" }}
                >
                  {nextPayroll.date}
                </div>
              </div>
              <Badge variant={statusVariant(nextPayroll.status)} dot>
                {nextPayroll.status}
              </Badge>
            </div>
            <div className="grid grid-cols-3" style={{ padding: "20px 24px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#8A8F98" }}>
                  Estimated total
                </div>
                <div
                  className="mt-1 font-medium"
                  style={{ fontSize: "22px", color: "#1A1A1A" }}
                >
                  ${fmt(nextPayroll.total)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#8A8F98" }}>
                  Contractors
                </div>
                <div
                  className="mt-1 font-medium"
                  style={{ fontSize: "22px", color: "#1A1A1A" }}
                >
                  {nextPayroll.count}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#8A8F98" }}>
                  Settles in
                </div>
                <div
                  className="mt-1 font-medium"
                  style={{ fontSize: "22px", color: "#1A1A1A" }}
                >
                  ~4s
                </div>
              </div>
            </div>
            <div
              className="flex items-center gap-3"
              style={{ padding: "0 24px 20px" }}
            >
              <Button href="/portal/payroll">
                Review payroll <ArrowRight size={16} />
              </Button>
              <Button href="/portal/payroll" variant="ghost">
                View breakdown
              </Button>
            </div>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { label: "Active contractors", value: "9", sub: "across 4 countries" },
              { label: "Paid this month", value: "$7,180", sub: "7 contractors" },
              { label: "Avg. FX achieved", value: "1,618", sub: "NGN / USDC" },
            ].map((s) => (
              <Card key={s.label}>
                <div style={{ fontSize: "13px", color: "#8A8F98" }}>
                  {s.label}
                </div>
                <div
                  className="mt-2 font-medium"
                  style={{ fontSize: "26px", color: "#1A1A1A" }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: "12px", color: "#8A8F98", marginTop: "2px" }}>
                  {s.sub}
                </div>
              </Card>
            ))}
          </div>

          {/* Recent runs */}
          <Card padding={0}>
            <div
              className="flex items-center justify-between"
              style={{ padding: "18px 24px", borderBottom: "1px solid #F0F1F3" }}
            >
              <h3
                className="font-medium"
                style={{ fontSize: "15px", color: "#1A1A1A" }}
              >
                Recent payroll runs
              </h3>
              <Link
                href="/portal/history"
                className="flex items-center gap-1"
                style={{ fontSize: "13px", color: "#0550AE" }}
              >
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            <div>
              {payrollRuns.slice(0, 3).map((run, i) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: "14px 24px",
                    borderBottom:
                      i < 2 ? "1px solid #F0F1F3" : "none",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", color: "#1A1A1A" }}>
                      {run.date}
                    </div>
                    <div style={{ fontSize: "12px", color: "#8A8F98" }}>
                      {run.count} contractors · tx {run.tx}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className="font-medium"
                      style={{ fontSize: "14px", color: "#1A1A1A" }}
                    >
                      ${fmt(run.total)}
                    </span>
                    <Badge variant={statusVariant(run.status)}>
                      {run.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: agent activity feed */}
        <div className="lg:col-span-1">
          <Card padding={0} style={{ height: "100%" }}>
            <div
              className="flex items-center gap-2"
              style={{ padding: "18px 22px", borderBottom: "1px solid #F0F1F3" }}
            >
              <Sparkles size={16} color="#0A9200" />
              <h3
                className="font-medium"
                style={{ fontSize: "15px", color: "#1A1A1A" }}
              >
                Agent activity
              </h3>
            </div>
            <div style={{ padding: "8px 22px 18px" }}>
              {activityFeed.map((a, i) => {
                const Icon = ICONS[a.icon];
                return (
                  <div key={i} className="flex gap-3" style={{ padding: "12px 0" }}>
                    <div className="flex flex-col items-center">
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "9999px",
                          background: "#DEF6E9",
                        }}
                      >
                        <Icon size={15} color="#0A9200" />
                      </span>
                      {i < activityFeed.length - 1 && (
                        <span
                          style={{
                            flex: 1,
                            width: 0,
                            borderLeft: "1px solid #E8E8E8",
                            marginTop: "4px",
                          }}
                        />
                      )}
                    </div>
                    <div className="pb-1">
                      <div
                        style={{ fontSize: "13.5px", color: "#1A1A1A", lineHeight: 1.5 }}
                      >
                        {a.text}
                      </div>
                      <div style={{ fontSize: "12px", color: "#8A8F98", marginTop: "2px" }}>
                        {a.time}
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link
                href="/portal/chat"
                className="mt-2 flex items-center gap-1 font-medium"
                style={{ fontSize: "13px", color: "#0550AE" }}
              >
                Open agent chat <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
