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
import { Card, Badge, Button, PageTitle, StatTile, statusVariant } from "@/components/portal/ui";
import { activityFeed, nextPayroll, payrollRuns, company, type Activity } from "@/lib/mock";

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
      <PageTitle
        sub={<>Here&rsquo;s what your agent has been doing.</>}
        action={
          <Button href="/portal/chat" variant="secondary">
            <Sparkles size={16} className="text-accent" /> Talk to agent
          </Button>
        }
      >
        Good morning, {company.contact.split(" ")[0]}.
      </PageTitle>

      {/* Alert banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-[#FBF1DC] px-5 py-4 text-[#8A5A00]">
        <div className="flex items-center gap-3">
          <AlertTriangle size={18} className="shrink-0" />
          <span className="text-[14.5px]">
            Balance is <strong className="font-semibold">${fmt(company.balance)}</strong>. The Dec 1 run
            needs <strong className="font-semibold">${fmt(nextPayroll.total)}</strong>. Top up{" "}
            <strong className="font-semibold">$2,600</strong> to stay covered.
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
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
              <div>
                <div className="text-[13px] text-muted">Next payroll</div>
                <div className="mt-1 text-[20px] font-medium text-ink">{nextPayroll.date}</div>
              </div>
              <Badge variant={statusVariant(nextPayroll.status)} dot>
                {nextPayroll.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-5 px-6 py-5 sm:grid-cols-3 sm:gap-0">
              {[
                ["Estimated total", `$${fmt(nextPayroll.total)}`],
                ["Contractors", String(nextPayroll.count)],
                ["Settles in", "~4s"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-[13px] text-muted">{label}</div>
                  <div className="tabular mt-2 font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-ink">{value}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 px-6 pb-5">
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
              <StatTile key={s.label} label={s.label} value={s.value} sub={s.sub} />
            ))}
          </div>

          {/* Recent runs */}
          <Card padding={0}>
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="text-[16px] font-medium text-ink">Recent payroll runs</h3>
              <Link href="/portal/history" className="flex items-center gap-1 text-[13px] font-medium text-accent">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {payrollRuns.slice(0, 3).map((run) => (
                <li key={run.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div>
                    <div className="text-[14.5px] text-ink">{run.date}</div>
                    <div className="text-[13px] text-muted">
                      {run.count} contractors · tx {run.tx}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="tabular text-[14.5px] font-medium text-ink">${fmt(run.total)}</span>
                    <Badge variant={statusVariant(run.status)}>{run.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right: agent activity feed */}
        <div className="lg:col-span-1">
          <Card padding={0} className="h-full">
            <div className="flex items-center gap-2 border-b border-line px-6 py-4">
              <Sparkles size={16} className="text-accent" />
              <h3 className="text-[16px] font-medium text-ink">Agent activity</h3>
            </div>
            <div className="px-6 pb-5">
              <ul className="divide-y divide-line">
                {activityFeed.map((a, i) => {
                  const Icon = ICONS[a.icon];
                  return (
                    <li key={i} className="flex gap-3 py-4">
                      <Icon size={16} className="mt-0.5 shrink-0 text-accent" />
                      <div>
                        <div className="text-[14px] leading-[1.5] text-ink">{a.text}</div>
                        <div className="mt-0.5 text-[13px] text-muted">{a.time}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link href="/portal/chat" className="mt-2 flex items-center gap-1 text-[13px] font-medium text-accent">
                Open agent chat <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
