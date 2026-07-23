"use client";

import { Sparkles, EyeOff } from "lucide-react";
import FadeIn from "./FadeIn";

const PILLARS = [
  {
    icon: Sparkles,
    eyebrow: "The agent",
    word: "Autonomous",
    desc: "It reads your contracts, times the FX window, resolves disputes, and pays, on its own. You approve each run, or let it run without you.",
  },
  {
    icon: EyeOff,
    eyebrow: "The proofs",
    word: "Private",
    desc: "Stellar is public, but your payroll isn't. Zero-knowledge proofs verify every payment is correct without revealing what anyone earns.",
    soon: true,
  },
];

export default function PillarsSection() {
  return (
    <section
      className="px-5 md:px-10"
      style={{ background: "#F5F5F5", paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <h2
            className="text-center font-medium"
            style={{
              color: "#1A1A1A",
              fontSize: "clamp(28px, 5vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: "760px",
              margin: "0 auto",
            }}
          >
            It runs your payroll. It keeps it private
            <span style={{ color: "#12FF80" }}>.</span>
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "520px" }}
          >
            Two things no other payroll tool puts together.
          </p>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <FadeIn key={p.word} delay={i * 0.08}>
                <div
                  className={i === 1 ? "md:pl-12 lg:pl-16" : "md:pr-12 lg:pr-16"}
                  style={{
                    borderLeft: i === 1 ? "1px solid #E1E1E1" : "none",
                    height: "100%",
                  }}
                >
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "9999px",
                      background: "#DEF6E9",
                    }}
                  >
                    <Icon size={24} color="#0A9200" />
                  </span>

                  <div
                    className="mt-6 font-medium uppercase"
                    style={{ fontSize: "12px", color: "#8A8F98", letterSpacing: "0.1em" }}
                  >
                    {p.eyebrow}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <h3
                      className="font-semibold"
                      style={{
                        fontSize: "clamp(32px, 4vw, 44px)",
                        color: "#1A1A1A",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {p.word}
                    </h3>
                    {p.soon && (
                      <span
                        className="font-medium"
                        style={{
                          background: "#DEF6E9",
                          color: "#0A9200",
                          borderRadius: "6px",
                          padding: "3px 9px",
                          fontSize: "12px",
                        }}
                      >
                        Soon
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: "17px",
                      color: "#8A8F98",
                      marginTop: "16px",
                      lineHeight: 1.65,
                      maxWidth: "420px",
                    }}
                  >
                    {p.desc}
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
