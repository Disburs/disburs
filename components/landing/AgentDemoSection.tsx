"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  TrendingUp,
  MessageCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";

type Cap = {
  label: string;
  title: string;
  desc: string;
  stats: { v: string; l: string }[];
  icon: LucideIcon;
};

const CAPS: Cap[] = [
  {
    label: "READS",
    title: "Contract-aware payroll",
    desc: "Reads every contract and timesheet, then works out exactly what each person is owed, bonuses, overtime, and caps included.",
    stats: [
      { v: "14", l: "contracts read" },
      { v: "0", l: "spreadsheets" },
    ],
    icon: FileText,
  },
  {
    label: "OPTIMIZES",
    title: "FX at the best window",
    desc: "Monitors anchor rates around the clock and executes at the best moment of the day, not whenever payroll happens to run.",
    stats: [
      { v: "1,618", l: "NGN / USDC" },
      { v: "$204", l: "saved on FX" },
    ],
    icon: TrendingUp,
  },
  {
    label: "RESOLVES",
    title: "Disputes, handled alone",
    desc: "Reads a contractor's message, checks the evidence on the ticket, and pays the difference if the claim is valid.",
    stats: [
      { v: "4 hrs", l: "overtime verified" },
      { v: "$360", l: "auto-paid" },
    ],
    icon: MessageCircle,
  },
  {
    label: "PAYS",
    title: "Batch payout on Stellar",
    desc: "Pays the entire team in a single transaction that settles in seconds, at near-zero network cost.",
    stats: [
      { v: "~4 sec", l: "to settle" },
      { v: "< $0.01", l: "network fee" },
    ],
    icon: Zap,
  },
];

const STICKY_TOP = 96;
const STICKY_STEP = 16;
const SCALE_STEP = 0.04;
const OFFSET_STEP = 8;
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center uppercase"
      style={{
        fontFamily: MONO,
        fontSize: "11px",
        letterSpacing: "0.16em",
        color: "#8A8F98",
        background: "#F0F1F3",
        borderRadius: "9999px",
        padding: "5px 12px",
      }}
    >
      {children}
    </span>
  );
}

function StackingCards() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [depth, setDepth] = useState<number[]>(CAPS.map(() => 0));
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setRm = () => setReduced(mq.matches);
    setRm();
    mq.addEventListener("change", setRm);

    function onScroll() {
      const next = CAPS.map((_, i) => {
        let count = 0;
        for (let j = i + 1; j < CAPS.length; j++) {
          const el = cardRefs.current[j];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const stickyTopJ = STICKY_TOP + j * STICKY_STEP;
          if (rect.top <= stickyTopJ + 2) count++;
        }
        return count;
      });
      setDepth(next);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", setRm);
    };
  }, []);

  return (
    <div className="flex flex-col" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      {CAPS.map((cap, i) => {
        const d = reduced ? 0 : depth[i];
        const scale = 1 - d * SCALE_STEP;
        const translateY = d * OFFSET_STEP;
        const Icon = cap.icon;

        return (
          <div
            key={cap.label}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="sticky mb-4"
            style={{ top: `${STICKY_TOP + i * STICKY_STEP}px`, zIndex: 10 + i }}
          >
            <div
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "top center",
                transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                willChange: "transform",
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{ background: "#FFFFFF", borderRadius: "20px", border: "1px solid #E8E8E8" }}
              >
                {/* Right-side watermark icon (desktop) */}
                <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block">
                  <div className="flex h-full items-center justify-center">
                    <Icon size={240} color="#12FF80" strokeWidth={1} style={{ opacity: 0.14 }} />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to right, #FFFFFF 0%, transparent 60%)" }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10" style={{ padding: "36px" }}>
                  <div className="md:max-w-[58%]">
                    <div className="mb-6 flex items-center gap-3">
                      <Tag>{cap.label}</Tag>
                      <span style={{ fontFamily: MONO, fontSize: "12px", color: "#C2C6CC" }}>
                        {String(i + 1).padStart(2, "0")} / 04
                      </span>
                    </div>
                    <h3 className="font-medium" style={{ fontSize: "24px", color: "#1A1A1A", letterSpacing: "-0.01em" }}>
                      {cap.title}
                    </h3>
                    <p style={{ fontSize: "15px", color: "#8A8F98", marginTop: "12px", lineHeight: 1.6, maxWidth: "440px" }}>
                      {cap.desc}
                    </p>
                    <div className="mt-8 flex gap-10 pt-6" style={{ borderTop: "1px solid #EFEFEF" }}>
                      {cap.stats.map((s) => (
                        <div key={s.l}>
                          <div className="font-semibold" style={{ fontSize: "26px", color: "#1A1A1A", letterSpacing: "-0.02em" }}>
                            {s.v}
                          </div>
                          <div style={{ fontFamily: MONO, fontSize: "11px", color: "#8A8F98", letterSpacing: "0.08em", marginTop: "4px" }}>
                            {s.l}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AgentDemoSection() {
  return (
    <section
      className="px-5 md:px-10"
      style={{ background: "#F5F5F5", paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        {/* Header */}
        <FadeIn>
          <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div>
                <Tag>Real Agency</Tag>
              </div>
              <h2
                className="mt-5 font-medium"
                style={{
                  fontSize: "clamp(30px, 5vw, 48px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#1A1A1A",
                }}
              >
                What true autonomy
                <br />
                looks like<span style={{ color: "#12FF80" }}>.</span>
              </h2>
            </div>
            <p style={{ fontSize: "14px", color: "#8A8F98", lineHeight: 1.6, maxWidth: "300px" }}>
              One agent, one payroll week. Everything here happens in the
              background, with zero employer actions and eleven agent decisions.
            </p>
          </div>
        </FadeIn>

        <StackingCards />
      </div>
    </section>
  );
}
