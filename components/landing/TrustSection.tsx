"use client";

import { Zap, DollarSign, Globe, Check, type LucideIcon } from "lucide-react";
import FadeIn from "./FadeIn";

type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
};

const STELLAR_STATS: Stat[] = [
  { icon: Zap, value: "3–5 seconds", label: "Transaction finality on Stellar" },
  { icon: DollarSign, value: "< $0.01", label: "Average cost per payment" },
  { icon: Globe, value: "50+ anchors", label: "Local currency offramp partners" },
];

const COMPARISONS: [string, string][] = [
  ["Executes when told", "Acts proactively"],
  ["Needs human input", "Reasons autonomously"],
  ["Fails on edge cases", "Adapts and resolves"],
];

export default function TrustSection() {
  return (
    <section
      className="px-5 md:px-10"
      style={{ background: "#F5F5F5", paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <h2
            className="text-center font-medium"
            style={{
              color: "#1A1A1A",
              fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
              lineHeight: 1.1,
            }}
          >
            Why Stellar. And why an agent.
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Why Stellar */}
          <FadeIn>
            <div
              className="h-full"
              style={{
                borderRadius: "20px",
                border: "2px solid #E8E8E8",
                background: "#FFFFFF",
                padding: "40px",
              }}
            >
              <h3
                className="font-medium"
                style={{ fontSize: "20px", color: "#1A1A1A", marginBottom: "24px" }}
              >
                Why Stellar?
              </h3>
              <div className="flex flex-col gap-5">
                {STELLAR_STATS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.value} className="flex items-center gap-4">
                      <span
                        className="flex shrink-0 items-center justify-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "9999px",
                          background: "#DEF6E9",
                        }}
                      >
                        <Icon size={20} color="#0A9200" />
                      </span>
                      <div>
                        <div
                          className="font-medium"
                          style={{ fontSize: "18px", color: "#1A1A1A" }}
                        >
                          {s.value}
                        </div>
                        <div style={{ fontSize: "14px", color: "#8A8F98" }}>
                          {s.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "14px", color: "#8A8F98", marginTop: "24px" }}>
                We chose Stellar because it was built for exactly this: fast,
                cheap, cross-border payments with a native offramp network across
                Africa.
              </p>
            </div>
          </FadeIn>

          {/* Why AI */}
          <FadeIn delay={0.1}>
            <div
              className="h-full"
              style={{
                borderRadius: "20px",
                border: "2px solid #E8E8E8",
                background: "#FFFFFF",
                padding: "40px",
              }}
            >
              <h3
                className="font-medium"
                style={{ fontSize: "20px", color: "#1A1A1A", marginBottom: "24px" }}
              >
                Why AI?
              </h3>

              {/* Header row */}
              <div className="grid grid-cols-2 gap-4 pb-3">
                <span style={{ fontSize: "13px", color: "#8A8F98" }}>
                  Traditional payroll tool
                </span>
                <span
                  className="font-medium"
                  style={{ fontSize: "13px", color: "#1A1A1A" }}
                >
                  Disburs agent
                </span>
              </div>

              <div className="flex flex-col">
                {COMPARISONS.map(([trad, ai], i) => (
                  <div
                    key={trad}
                    className="grid grid-cols-2 gap-4 py-3"
                    style={{
                      borderTop: i === 0 ? "1px solid #E8E8E8" : "none",
                      borderBottom: "1px solid #E8E8E8",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "#8A8F98" }}>
                      {trad}
                    </span>
                    <span className="flex items-center gap-2">
                      <Check size={16} color="#12FF80" strokeWidth={3} />
                      <span
                        className="font-medium"
                        style={{ fontSize: "14px", color: "#12FF80" }}
                      >
                        {ai}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "14px", color: "#8A8F98", marginTop: "24px" }}>
                The agent reads your contracts, monitors your balance,
                investigates anomalies, and resolves disputes, all without a
                script.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
