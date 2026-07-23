"use client";

import {
  Wallet,
  ShieldCheck,
  ScrollText,
  EyeOff,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

type Item = {
  icon: LucideIcon;
  title: string;
  desc: string;
  soon?: boolean;
};

const ITEMS: Item[] = [
  {
    icon: Wallet,
    title: "Non-custodial funds",
    desc: "Money moves directly on Stellar from your wallet to your contractors. Disburs never holds your funds.",
  },
  {
    icon: ShieldCheck,
    title: "You stay in control",
    desc: "Require one-click approval on every run and set spending limits the agent can never exceed.",
  },
  {
    icon: EyeOff,
    title: "Private by default",
    desc: "Zero-knowledge proofs let the network verify a payroll is valid without revealing what anyone earns.",
    soon: true,
  },
  {
    icon: ScrollText,
    title: "Full audit trail",
    desc: "Every agent decision is logged in plain English, ready for compliance and review at any time.",
  },
];

const ROLES: { who: string; sees: string }[] = [
  { who: "You", sees: "See every payment, amount, and decision in full detail." },
  { who: "Your contractors", sees: "See only their own pay, never what anyone else earns." },
  { who: "Auditors & regulators", sees: "Verify every run is correct and compliant, without seeing a single salary." },
];

export default function SecuritySection() {
  return (
    <section
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>Security</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              maxWidth: "560px",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            Secure by design.
            <br />
            Compliant by default<span style={{ color: "#12FF80" }}>.</span>
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "520px" }}
          >
            Your funds never leave your wallet, your data stays encrypted, and
            your payroll stays private.
          </p>
        </FadeIn>

        <div
          className="mt-12 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={(i % 4) * 0.05}>
                <div
                  className="h-full"
                  style={{
                    borderRadius: "20px",
                    border: "2px solid #E8E8E8",
                    background: "#FFFFFF",
                    padding: "32px",
                  }}
                >
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
                  <div
                    className="flex flex-wrap items-center gap-2"
                    style={{ marginTop: "16px" }}
                  >
                    <h3
                      className="font-medium"
                      style={{ fontSize: "18px", color: "#1A1A1A" }}
                    >
                      {item.title}
                    </h3>
                    {item.soon && (
                      <span
                        className="font-medium"
                        style={{
                          background: "#DEF6E9",
                          color: "#0A9200",
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "11px",
                        }}
                      >
                        Soon
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#8A8F98",
                      marginTop: "8px",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Role-based visibility strip */}
        <FadeIn>
          <div
            className="mt-6 flex flex-col divide-y divide-[#E8E8E8] overflow-hidden md:flex-row md:divide-x md:divide-y-0"
            style={{ borderRadius: "20px", border: "2px solid #E8E8E8", background: "#FFFFFF" }}
          >
            {ROLES.map((r) => (
              <div key={r.who} className="flex-1" style={{ padding: "28px 32px" }}>
                <div className="font-medium" style={{ fontSize: "13px", color: "#0A9200" }}>
                  {r.who}
                </div>
                <div style={{ fontSize: "16px", color: "#1A1A1A", marginTop: "8px", lineHeight: 1.5 }}>
                  {r.sees}
                </div>
              </div>
            ))}
          </div>
          <p
            className="mt-4 text-center"
            style={{ fontSize: "14px", color: "#8A8F98" }}
          >
            The same run, different views. Everyone sees exactly what they should,
            and nothing more.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
