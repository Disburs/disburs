"use client";

import { Check } from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const COMPANY_BULLETS = [
  "One-click payroll for teams of 1–500 contractors",
  "Pay in USDC, contractors receive in local currency",
  "Agent handles disputes, anomalies, and compliance",
  "Full reports for your accounting team",
];

const CONTRACTOR_BULLETS = [
  "Receive USDC in seconds after payroll runs",
  "Convert to naira, KES, GHS instantly",
  "Message the agent directly if something's wrong",
  "No crypto knowledge needed",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-3">
          <span className="mt-1 shrink-0">
            <Check size={16} color="#12FF80" strokeWidth={3} />
          </span>
          <span style={{ fontSize: "16px", color: "#1A1A1A" }}>{b}</span>
        </li>
      ))}
    </ul>
  );
}

export default function WhoWeServeSection() {
  return (
    <section
      id="who-we-serve"
      className="px-5 md:px-10"
      style={{ background: "#F5F5F5", paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>Who We Serve</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              maxWidth: "640px",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            Built for how modern teams actually work.
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Companies */}
          <FadeIn>
            <div
              className="flex h-full flex-col"
              style={{
                borderRadius: "20px",
                border: "2px solid #E8E8E8",
                background: "#FFFFFF",
                padding: "48px",
              }}
            >
              <span
                className="inline-block self-start font-medium"
                style={{
                  background: "#DEF6E9",
                  color: "#0A9200",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "12px",
                }}
              >
                For Companies
              </span>
              <h3
                className="font-medium"
                style={{ fontSize: "24px", color: "#1A1A1A", marginTop: "16px" }}
              >
                You hire the talent. We handle the payroll.
              </h3>
              <p style={{ fontSize: "16px", color: "#8A8F98", marginTop: "12px" }}>
                Startup in San Francisco, scale-up in Berlin, growing team in
                Lagos. If you hire contractors abroad, Disburs saves you time
                and money every month.
              </p>
              <div
                style={{
                  borderTop: "1px solid #E8E8E8",
                  margin: "24px 0",
                }}
              />
              <BulletList items={COMPANY_BULLETS} />
              <div className="mt-8">
                <a
                  href="#waitlist"
                  className="inline-flex items-center justify-center font-medium transition-transform hover:scale-[1.02]"
                  style={{
                    height: "48px",
                    padding: "12px 24px",
                    borderRadius: "4px",
                    background: "#12FF80",
                    color: "#1A1A1A",
                    fontSize: "16px",
                    boxShadow: "rgba(0,0,0,0.06) 0px 4px 4px 0px",
                  }}
                >
                  Join the waitlist →
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Contractors */}
          <FadeIn delay={0.1}>
            <div
              className="flex h-full flex-col"
              style={{
                borderRadius: "20px",
                border: "2px solid #DEF6E9",
                background: "#FFFFFF",
                padding: "48px",
              }}
            >
              <span
                className="inline-block self-start font-medium"
                style={{
                  background: "#F5F5F5",
                  color: "#1A1A1A",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "12px",
                }}
              >
                For Contractors
              </span>
              <h3
                className="font-medium"
                style={{ fontSize: "24px", color: "#1A1A1A", marginTop: "16px" }}
              >
                Get paid faster. In any currency.
              </h3>
              <p style={{ fontSize: "16px", color: "#8A8F98", marginTop: "12px" }}>
                No more waiting 5 days for a wire. No more PayPal restrictions. No
                more losing 4% to fees. Your employer runs Disburs, you just get
                paid.
              </p>
              <div
                style={{
                  borderTop: "1px solid #E8E8E8",
                  margin: "24px 0",
                }}
              />
              <BulletList items={CONTRACTOR_BULLETS} />
              <div className="mt-8">
                <a
                  href="#waitlist"
                  className="inline-flex items-center justify-center font-medium transition-transform hover:scale-[1.02]"
                  style={{
                    height: "48px",
                    padding: "12px 24px",
                    borderRadius: "4px",
                    background: "transparent",
                    color: "#1A1A1A",
                    border: "1px solid #E8E8E8",
                    fontSize: "16px",
                  }}
                >
                  Invite your employer →
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
