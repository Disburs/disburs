"use client";

import {
  Clock,
  XCircle,
  TrendingDown,
  FileSpreadsheet,
  BarChart2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

type Pain = {
  icon: LucideIcon;
  stat: string;
  desc: string;
};

const PAINS: Pain[] = [
  {
    icon: Clock,
    stat: "$30–50",
    desc: "Per bank wire transfer. Plus 3–5 days waiting.",
  },
  {
    icon: XCircle,
    stat: "PayPal blocked",
    desc: "Heavily restricted in Nigeria. Many contractors can't receive a cent.",
  },
  {
    icon: TrendingDown,
    stat: "2–4% fees",
    desc: "Payoneer and Wise eat into your team's salaries every month.",
  },
  {
    icon: FileSpreadsheet,
    stat: "Hours wasted",
    desc: "Manual calculations, CSV uploads, and copy-paste errors every payroll cycle.",
  },
  {
    icon: BarChart2,
    stat: "Worst rate",
    desc: "Nobody monitors exchange rates. You always pay when it's most expensive.",
  },
  {
    icon: AlertTriangle,
    stat: "It breaks",
    desc: "Wrong amounts, failed transfers, changed wallets. You fix it all manually.",
  },
];

export default function ProblemSection() {
  return (
    <section
      className="px-5 md:px-10"
      style={{ background: "#F5F5F5", paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>The Problem</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              maxWidth: "560px",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            Paying African contractors is broken.
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "520px" }}
          >
            Every month, the same frustration. Every month, money left on the
            table.
          </p>
        </FadeIn>

        {/* Grid */}
        <div
          className="mt-12 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {PAINS.map((p, i) => {
            const Icon = p.icon;
            return (
              <FadeIn key={p.stat} delay={i * 0.05}>
                <div
                  className="group h-full transition-colors duration-200"
                  style={{
                    borderRadius: "20px",
                    border: "2px solid #E8E8E8",
                    background: "#FFFFFF",
                    padding: "32px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#DEF6E9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#E8E8E8")
                  }
                >
                  <Icon size={24} color="#1A1A1A" />
                  <div
                    className="font-medium"
                    style={{ fontSize: "24px", color: "#1A1A1A", marginTop: "16px" }}
                  >
                    {p.stat}
                  </div>
                  <p style={{ fontSize: "16px", color: "#8A8F98", marginTop: "8px" }}>
                    {p.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Bottom line */}
        <FadeIn>
          <p
            className="mx-auto mt-12 text-center italic"
            style={{
              fontSize: "24px",
              fontWeight: 400,
              color: "#1A1A1A",
              maxWidth: "560px",
            }}
          >
            &ldquo;The finance manager&rsquo;s Friday is ruined. Every single
            month.&rdquo;
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
