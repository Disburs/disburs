"use client";

import {
  FileText,
  Award,
  ShieldCheck,
  Bell,
  TrendingUp,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";
import CountUp from "./CountUp";

const STATS = [
  { to: 0, label: "Employer actions required" },
  { to: 11, label: "Agent decisions made" },
  { to: 4, suffix: " sec", label: "Time to execute" },
  { to: 204, prefix: "$", label: "Saved on FX" },
];

type Moment = {
  icon: LucideIcon;
  day: string;
  title: string;
  desc: string;
};

const MOMENTS: Moment[] = [
  {
    icon: FileText,
    day: "Oct 28",
    title: "Read every contract & timesheet",
    desc: "Pulled all 14 timesheets from Google Sheets and read each contract to work out what everyone was owed.",
  },
  {
    icon: Award,
    day: "Oct 28",
    title: "Caught a hidden bonus clause",
    desc: "Found Chidi's $300 milestone bonus buried in a contract PDF, verified the work was delivered, and added it.",
  },
  {
    icon: ShieldCheck,
    day: "Oct 29",
    title: "Verified a changed wallet",
    desc: "Amara's wallet address changed. Investigated the fraud risk, confirmed with her, and updated the record.",
  },
  {
    icon: Bell,
    day: "Oct 30",
    title: "Flagged a low balance early",
    desc: "Spotted the account was $2,600 short three days out and alerted the CFO in time to top up.",
  },
  {
    icon: TrendingUp,
    day: "Nov 1",
    title: "Paid at the best FX window",
    desc: "Waited for the rate to hit 1,618 NGN/USDC, then paid all 14 contractors in a single Stellar transaction.",
  },
  {
    icon: MessageCircle,
    day: "Nov 1",
    title: "Resolved a dispute on its own",
    desc: "Bola flagged missing overtime. The agent verified 4 hours on ticket #2847 and paid the extra $360 automatically.",
  },
];

export default function AgentDemoSection() {
  return (
    <section
      className="px-5 md:px-10"
      style={{ background: "#F5F5F5", paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>Real Agency</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            What true autonomy looks like.
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "560px" }}
          >
            One payroll week, start to finish. Everything below happened in the
            background while nobody was logged in.
          </p>
        </FadeIn>

        {/* KPI band */}
        <FadeIn>
          <div
            className="mt-12 grid grid-cols-2 lg:grid-cols-4"
            style={{
              borderRadius: "20px",
              border: "2px solid #E8E8E8",
              background: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="text-center"
                style={{
                  padding: "32px 24px",
                  borderRight:
                    i % 2 === 0 ? "1px solid #E8E8E8" : "none",
                  borderBottom: i < 2 ? "1px solid #E8E8E8" : "none",
                }}
              >
                <div
                  className="font-medium"
                  style={{ fontSize: "44px", color: "#1A1A1A", lineHeight: 1 }}
                >
                  <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div
                  style={{ fontSize: "14px", color: "#8A8F98", marginTop: "8px" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Moment cards */}
        <div
          className="mt-6 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {MOMENTS.map((m, i) => {
            const Icon = m.icon;
            return (
              <FadeIn key={m.title} delay={(i % 3) * 0.05}>
                <div
                  className="h-full"
                  style={{
                    borderRadius: "20px",
                    border: "2px solid #E8E8E8",
                    background: "#FFFFFF",
                    padding: "28px",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center justify-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "9999px",
                        background: "#DEF6E9",
                      }}
                    >
                      <Icon size={20} color="#0A9200" />
                    </span>
                    <span style={{ fontSize: "12px", color: "#8A8F98" }}>
                      {m.day}
                    </span>
                  </div>
                  <h3
                    className="font-medium"
                    style={{ fontSize: "18px", color: "#1A1A1A", marginTop: "16px" }}
                  >
                    {m.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#8A8F98",
                      marginTop: "8px",
                      lineHeight: 1.6,
                    }}
                  >
                    {m.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Closing line */}
        <FadeIn>
          <p
            className="mx-auto mt-12 text-center font-medium"
            style={{ fontSize: "24px", color: "#1A1A1A", maxWidth: "560px" }}
          >
            TypeScript can automate. Only an AI agent can reason
            <span style={{ color: "#12FF80" }}>.</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
