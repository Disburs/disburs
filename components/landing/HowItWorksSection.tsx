"use client";

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

function StepCircle({ n }: { n: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center font-medium"
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "9999px",
        background: "#DEF6E9",
        color: "#0A9200",
        fontSize: "18px",
      }}
    >
      {n}
    </div>
  );
}

export default function HowItWorksSection() {
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
        <div className="relative mx-auto mt-12" style={{ maxWidth: "900px" }}>
          {/* Dashed connector line */}
          <div
            className="absolute hidden md:block"
            style={{
              left: "50%",
              top: "24px",
              bottom: "24px",
              width: 0,
              borderLeft: "2px dashed #E8E8E8",
              transform: "translateX(-50%)",
            }}
          />
          {/* Mobile connector line */}
          <div
            className="absolute md:hidden"
            style={{
              left: "23px",
              top: "24px",
              bottom: "24px",
              width: 0,
              borderLeft: "2px dashed #E8E8E8",
            }}
          />

          <div className="flex flex-col gap-10">
            {STEPS.map((step, i) => {
              const leftSide = i % 2 === 0;
              return (
                <FadeIn key={step.title}>
                  <div
                    className={`relative flex items-start gap-5 md:items-center ${
                      leftSide ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* content half */}
                    <div className="hidden flex-1 md:block">
                      <div
                        className={leftSide ? "pr-12 text-right" : "pl-12 text-left"}
                      >
                        <StepContent step={step} />
                      </div>
                    </div>

                    {/* center circle */}
                    <div className="relative z-10 flex md:mx-0">
                      <StepCircle n={i + 1} />
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
