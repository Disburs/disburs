"use client";

import {
  Wallet,
  ShieldCheck,
  Lock,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

type Item = {
  icon: LucideIcon;
  title: string;
  desc: string;
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
    icon: Lock,
    title: "Encrypted data",
    desc: "Contracts and personal details are encrypted in transit and at rest, accessible only to your team.",
  },
  {
    icon: ScrollText,
    title: "Full audit trail",
    desc: "Every agent decision is logged in plain English, ready for compliance and review at any time.",
  },
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
            Your data and funds, protected.
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "520px" }}
          >
            The agent acts on your behalf, never outside the limits you set.
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
                  <h3
                    className="font-medium"
                    style={{ fontSize: "18px", color: "#1A1A1A", marginTop: "16px" }}
                  >
                    {item.title}
                  </h3>
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
      </div>
    </section>
  );
}
