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
import CountUp from "./CountUp";

const STATS = [
  { to: 0, label: "Employer actions required" },
  { to: 11, label: "Agent decisions made" },
  { to: 4, suffix: " sec", label: "Time to execute" },
  { to: 204, prefix: "$", label: "Saved on FX" },
];

type Moment = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const MOMENTS: Moment[] = [
  {
    icon: FileText,
    title: "Read",
    desc: "Pulled all 14 timesheets from Google Sheets and read every contract to work out what each person was owed.",
  },
  {
    icon: Award,
    title: "Interpret",
    desc: "Found Chidi's $300 milestone bonus buried in a contract PDF, verified the work was delivered, and added it.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    desc: "Amara's wallet address changed. Investigated the fraud risk, confirmed with her, and updated the record.",
  },
  {
    icon: Bell,
    title: "Anticipate",
    desc: "Spotted the account was $2,600 short three days out and alerted the CFO in time to top up.",
  },
  {
    icon: TrendingUp,
    title: "Execute",
    desc: "Waited for the rate to hit 1,618 NGN/USDC, then paid all 14 contractors in a single Stellar transaction.",
  },
  {
    icon: MessageCircle,
    title: "Resolve",
    desc: "Bola flagged missing overtime. The agent verified 4 hours on ticket #2847 and paid the extra $360 automatically.",
  },
];

// Chunk into rows of two so each divider spans the full column
const ROWS: Moment[][] = [
  MOMENTS.slice(0, 2),
  MOMENTS.slice(2, 4),
  MOMENTS.slice(4, 6),
];

export default function AgentDemoSection() {
  return (
    <section
      className="px-5 md:px-10"
      style={{ background: "#F5F5F5", paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left: label + oversized headline + proof stats */}
          <FadeIn className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <span
                className="block font-medium uppercase"
                style={{
                  fontSize: "12px",
                  color: "#12FF80",
                  letterSpacing: "0.1em",
                }}
              >
                Real Agency
              </span>

              <h2
                className="font-semibold"
                style={{
                  color: "#1A1A1A",
                  fontSize: "clamp(34px, 4.6vw, 54px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  marginTop: "20px",
                }}
              >
                What true autonomy looks like
              </h2>

              <p
                style={{
                  fontSize: "17px",
                  color: "#8A8F98",
                  marginTop: "20px",
                  lineHeight: 1.6,
                  maxWidth: "380px",
                }}
              >
                One payroll week, start to finish. Everything alongside happens in
                the background while nobody is logged in.
              </p>

              <div
                className="grid grid-cols-2 gap-x-8 gap-y-7"
                style={{ marginTop: "44px", maxWidth: "380px" }}
              >
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div
                      className="font-semibold"
                      style={{ fontSize: "32px", color: "#1A1A1A", lineHeight: 1 }}
                    >
                      <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#8A8F98",
                        marginTop: "6px",
                        lineHeight: 1.4,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right: divided 2-up item grid */}
          <div className="lg:col-span-3">
            {ROWS.map((row, ri) => (
              <div key={ri}>
                {ri > 0 && (
                  <div
                    style={{
                      borderTop: "1px solid #E1E1E1",
                      marginTop: "44px",
                      marginBottom: "44px",
                    }}
                  />
                )}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-12">
                  {row.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <FadeIn key={m.title} delay={i * 0.05}>
                        <div>
                          <Icon size={30} color="#1A1A1A" strokeWidth={1.5} />
                          <h3
                            className="font-semibold"
                            style={{
                              fontSize: "20px",
                              color: "#1A1A1A",
                              marginTop: "20px",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {m.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "15px",
                              color: "#8A8F98",
                              marginTop: "12px",
                              lineHeight: 1.65,
                            }}
                          >
                            {m.desc}
                          </p>
                        </div>
                      </FadeIn>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing line */}
        <FadeIn>
          <p
            className="mt-20 text-center font-medium"
            style={{ fontSize: "24px", color: "#1A1A1A" }}
          >
            Software follows rules. An agent uses judgment
            <span style={{ color: "#12FF80" }}>.</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
