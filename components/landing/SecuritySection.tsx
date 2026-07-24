"use client";

import { useEffect, useState } from "react";
import { Wallet, ShieldCheck, EyeOff, ScrollText, type LucideIcon } from "lucide-react";
import FadeIn from "./FadeIn";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  soon?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: Wallet,
    title: "Non-custodial funds",
    desc: "Money moves wallet-to-wallet on Stellar. Disburs never holds it.",
  },
  {
    icon: ShieldCheck,
    title: "You set the limits",
    desc: "Approval thresholds and spending caps the agent can never exceed.",
  },
  {
    icon: EyeOff,
    title: "Private by default",
    desc: "Zero-knowledge proofs keep every amount off the public chain.",
    soon: true,
  },
  {
    icon: ScrollText,
    title: "Full audit trail",
    desc: "Every agent decision logged in plain English, ready for review.",
  },
];

// Honest posture, not certifications we don't hold
const BADGES = ["Non-custodial", "Encrypted", "Audit trail", "GDPR-ready"];

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export default function SecuritySection() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((p) => (p + 1) % FEATURES.length), 3000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section
      id="security"
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        {/* Header */}
        <FadeIn>
          <div className="mb-16" style={{ maxWidth: "820px" }}>
            <span
              className="mb-7 inline-flex items-center gap-4 uppercase"
              style={{ fontFamily: MONO, fontSize: "12px", letterSpacing: "0.16em", color: "#8A8F98" }}
            >
              <span style={{ width: "48px", height: "1px", background: "#C2C6CC" }} />
              Security &amp; Compliance
            </span>
            <h2
              className="font-semibold"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                color: "#1A1A1A",
              }}
            >
              Autonomous,
              <br />
              <span style={{ color: "#B4B9C2" }}>not unchecked.</span>
            </h2>
            <p style={{ fontSize: "20px", color: "#8A8F98", marginTop: "24px", maxWidth: "620px", lineHeight: 1.6 }}>
              The agent is powerful, but bounded. It only ever does what you allow,
              on funds it never holds, with every decision on the record.
            </p>
          </div>
        </FadeIn>

        {/* Main content */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Big visual card */}
          <FadeIn className="lg:col-span-7">
            <div
              className="relative h-full overflow-hidden"
              style={{ border: "1px solid #E8E8E8", borderRadius: "20px", minHeight: "420px", padding: "40px" }}
            >
              {/* Cross-fading icon reflecting the active feature */}
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center lg:flex">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <Icon
                      key={f.title}
                      size={260}
                      color="#12FF80"
                      strokeWidth={1}
                      className="absolute transition-opacity duration-500"
                      style={{ opacity: active === i ? 0.16 : 0 }}
                    />
                  );
                })}
              </div>

              <div className="relative z-10">
                <span style={{ fontFamily: MONO, fontSize: "13px", color: "#8A8F98" }}>
                  Non-custodial by design
                </span>
                <div className="mt-10">
                  <span className="font-semibold" style={{ fontSize: "clamp(4rem, 9vw, 6.5rem)", color: "#1A1A1A", lineHeight: 1, letterSpacing: "-0.04em" }}>
                    $0
                  </span>
                  <span className="mt-3 block" style={{ fontSize: "16px", color: "#8A8F98" }}>
                    ever held by Disburs. Funds go straight from your wallet to
                    your team.
                  </span>
                </div>
              </div>

              {/* Posture badges */}
              <div className="absolute bottom-8 left-10 right-10 flex flex-wrap gap-2">
                {BADGES.map((b) => (
                  <span
                    key={b}
                    className="uppercase"
                    style={{
                      fontFamily: MONO,
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      color: "#8A8F98",
                      border: "1px solid #E8E8E8",
                      borderRadius: "6px",
                      padding: "5px 10px",
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Feature cards stack */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const on = active === i;
              return (
                <FadeIn key={f.title} delay={i * 0.05}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="w-full text-left transition-all duration-300"
                    style={{
                      borderRadius: "16px",
                      border: on ? "1px solid #12FF80" : "1px solid #E8E8E8",
                      background: on ? "#F7FBF8" : "#FFFFFF",
                      padding: "22px 24px",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="flex shrink-0 items-center justify-center transition-colors duration-300"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "11px",
                          background: on ? "#12FF80" : "#F0F1F3",
                          color: on ? "#0A2E12" : "#8A8F98",
                        }}
                      >
                        <Icon size={20} />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium" style={{ fontSize: "17px", color: "#1A1A1A" }}>
                            {f.title}
                          </h3>
                          {f.soon && (
                            <span
                              className="font-medium"
                              style={{ background: "#DEF6E9", color: "#0A9200", borderRadius: "5px", padding: "2px 7px", fontSize: "11px" }}
                            >
                              Soon
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: "14px", color: "#8A8F98", marginTop: "6px", lineHeight: 1.5 }}>
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
