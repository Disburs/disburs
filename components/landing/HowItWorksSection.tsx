"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

type Doer = "You" | "Disburs Agent";

type Step = {
  title: string;
  doer: Doer;
  desc: string;
};

const STEPS: Step[] = [
  {
    title: "Connect your team",
    doer: "You",
    desc: "Add contractors, upload their contracts (PDF, Google Drive, Notion), and connect your timesheet tool. Takes 10 minutes.",
  },
  {
    title: "Agent reads and prepares",
    doer: "Disburs Agent",
    desc: "Before every payroll cycle, the agent reads every contract, calculates amounts owed, checks wallet addresses, and monitors exchange rates.",
  },
  {
    title: "Review and approve",
    doer: "You",
    desc: "See a clean summary. Approve with one click, or configure Disburs to run fully automatically. Your call.",
  },
  {
    title: "Everyone gets paid",
    doer: "Disburs Agent",
    desc: "Batch payments via Stellar in seconds. Contractors receive USDC and can convert to local currency instantly.",
  },
  {
    title: "Agent handles the rest",
    doer: "Disburs Agent",
    desc: "Disputes, failed payments, wallet changes, balance alerts. The agent manages everything.",
  },
];

function DoerBadge({ doer }: { doer: Doer }) {
  const isAgent = doer === "Disburs Agent";
  return (
    <span
      className="inline-block font-medium"
      style={{
        fontSize: "12px",
        borderRadius: "20px",
        padding: "4px 12px",
        background: isAgent ? "#DEF6E9" : "#F5F5F5",
        color: isAgent ? "#0A9200" : "#1A1A1A",
      }}
    >
      {doer}
    </span>
  );
}

const RING_R = 25;
const RING_C = 2 * Math.PI * RING_R;

function StepCircle({ n, active }: { n: number; active: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: "48px", height: "48px" }}>
      {/* Tracing ring that draws around the number when reached */}
      <svg
        width="58"
        height="58"
        viewBox="0 0 58 58"
        aria-hidden
        className="absolute"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="29"
          cy="29"
          r={RING_R}
          fill="none"
          stroke="#12FF80"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={active ? 0 : RING_C}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>

      <div
        className="flex items-center justify-center font-medium"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "9999px",
          background: "#DEF6E9",
          color: "#0A9200",
          fontSize: "18px",
          transform: active ? "scale(1.05)" : "scale(1)",
          boxShadow: active ? "0 6px 18px -6px rgba(18,255,128,0.5)" : "none",
          transition: "transform 300ms ease, box-shadow 300ms ease",
        }}
      >
        {n}
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const posRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [reduced, setReduced] = useState(false);

  const { scrollYProgress } = useScroll({
    target: posRef,
    offset: ["start 0.85", "end 0.5"],
  });
  const fillPct = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduced) {
      setActiveCount(STEPS.length);
      return;
    }
    const cont = posRef.current;
    if (!cont) return;
    const cr = cont.getBoundingClientRect();
    const connTop = cr.top + 24;
    const filled = (cr.height - 48) * p;
    let n = 0;
    circleRefs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const centerFromTop = r.top + r.height / 2 - connTop;
      if (filled >= centerFromTop - 4) n += 1;
    });
    setActiveCount(n);
  });

  const trackFill = (
    <motion.div
      style={{
        position: "absolute",
        left: "-2px",
        top: 0,
        width: "2px",
        background: "#12FF80",
        boxShadow: "0 0 10px rgba(18,255,128,0.55)",
        height: reduced ? "100%" : fillPct,
      }}
    />
  );

  return (
    <section
      id="how-it-works"
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>How It Works</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              maxWidth: "640px",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            Set it up once. Your agent handles everything else.
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "520px" }}
          >
            Five steps, most of which your agent completes without you.
          </p>
        </FadeIn>

        {/* Timeline */}
        <div ref={posRef} className="relative mx-auto mt-12" style={{ maxWidth: "900px" }}>
          {/* Desktop connector (centered) */}
          <div
            className="absolute hidden md:block"
            style={{
              left: "50%",
              top: "24px",
              bottom: "24px",
              width: "2px",
              borderLeft: "2px dashed #E8E8E8",
              transform: "translateX(-50%)",
            }}
          >
            {trackFill}
          </div>
          {/* Mobile connector (left) */}
          <div
            className="absolute md:hidden"
            style={{
              left: "23px",
              top: "24px",
              bottom: "24px",
              width: "2px",
              borderLeft: "2px dashed #E8E8E8",
            }}
          >
            {trackFill}
          </div>

          <div className="flex flex-col gap-10">
            {STEPS.map((step, i) => {
              const leftSide = i % 2 === 0;
              const active = i < activeCount;
              return (
                <FadeIn key={step.title}>
                  <div
                    className={`relative flex items-start gap-5 md:items-center ${
                      leftSide ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* content half */}
                    <div className="hidden flex-1 md:block">
                      <div className={leftSide ? "pr-12 text-right" : "pl-12 text-left"}>
                        <StepContent step={step} />
                      </div>
                    </div>

                    {/* center circle */}
                    <div
                      ref={(el) => {
                        circleRefs.current[i] = el;
                      }}
                      className="relative z-10 flex md:mx-0"
                    >
                      <StepCircle n={i + 1} active={active} />
                    </div>

                    {/* spacer half (desktop) */}
                    <div className="hidden flex-1 md:block" />

                    {/* mobile content */}
                    <div className="flex-1 md:hidden">
                      <StepContent step={step} />
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepContent({ step }: { step: Step }) {
  return (
    <div>
      <div className="mb-2">
        <DoerBadge doer={step.doer} />
      </div>
      <h3 className="font-medium" style={{ fontSize: "20px", color: "#1A1A1A" }}>
        {step.title}
      </h3>
      <p style={{ fontSize: "16px", color: "#8A8F98", marginTop: "8px" }}>
        {step.desc}
      </p>
    </div>
  );
}
