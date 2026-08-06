"use client";

import {
  Wallet,
  ShieldCheck,
  UserCheck,
  EyeOff,
  ScrollText,
  Lock,
  BadgeCheck,
  Power,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const DEEP = "#0A9200";

type Item = { icon: LucideIcon; title: string; desc: string; soon?: boolean };

const ITEMS: Item[] = [
  {
    icon: Wallet,
    title: "Non-custodial funds",
    desc: "Money moves wallet-to-wallet on Stellar. Disburs never holds it.",
  },
  {
    icon: ShieldCheck,
    title: "Caps & thresholds",
    desc: "Set spending limits the agent can never exceed on any run.",
  },
  {
    icon: UserCheck,
    title: "Human approval gates",
    desc: "Anything above your threshold waits for your sign-off first.",
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
    desc: "Every agent decision logged in plain English, ready to review.",
  },
  {
    icon: Lock,
    title: "Encrypted end to end",
    desc: "Contracts and payroll data encrypted at rest and in transit.",
  },
  {
    icon: BadgeCheck,
    title: "Verifiable on Stellar",
    desc: "Every payment settles on-chain and can be independently checked.",
  },
  {
    icon: Power,
    title: "Revoke anytime",
    desc: "Pause or revoke the agent's authority in a single click.",
  },
];

export default function SecuritySection() {
  return (
    <section id="security" className="bg-white px-5 md:px-10" style={{ paddingTop: "100px", paddingBottom: "104px" }}>
      {/* Gradient definition for the icon strokes */}
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="disburs-icon-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#39F58C" />
            <stop offset="100%" stopColor="#0A9200" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto max-w-container">
        <FadeIn>
          <h2
            className="mx-auto text-center"
            style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(1.65rem, 3.1vw, 2.2rem)", lineHeight: 1.14, letterSpacing: "-0.02em", color: INK, maxWidth: 760 }}
          >
            Autonomous where it helps,{" "}
            <span className="font-bold" style={{ color: DEEP }}>
              never unchecked
            </span>{" "}
            where it counts
          </h2>
          <p className="mx-auto mt-5 text-center" style={{ fontSize: "18px", color: MUT, maxWidth: 560, lineHeight: 1.55 }}>
            The agent is powerful, but bounded. It only ever does what you allow, on
            funds it never holds, with every decision on the record.
          </p>
        </FadeIn>

        <div className="mx-auto mt-16 grid max-w-[1080px] grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <FadeIn key={it.title} delay={(i % 4) * 0.05}>
                <div className="flex flex-col items-center text-center">
                  {/* soft neumorphic circle */}
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: "50%",
                      background: "radial-gradient(120% 120% at 30% 20%, #FFFFFF 0%, #F3FBF6 100%)",
                      border: "1px solid #EAF3EE",
                      boxShadow: "0 16px 30px -12px rgba(10, 146, 0,0.18), 0 2px 6px rgba(14,26,20,0.05), inset 0 1px 0 #FFFFFF",
                    }}
                  >
                    <Icon className="icon-grad" size={30} strokeWidth={1.75} />
                  </span>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <h3 className="font-semibold" style={{ fontSize: 17, color: INK }}>
                      {it.title}
                    </h3>
                    {it.soon && (
                      <span className="font-medium" style={{ background: "#DEF6E9", color: DEEP, borderRadius: 5, padding: "2px 7px", fontSize: 10.5 }}>
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5" style={{ fontSize: 14.5, color: MUT, lineHeight: 1.55, maxWidth: 240 }}>
                    {it.desc}
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
