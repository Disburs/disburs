"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";
import AnimatedCube from "./AnimatedCube";

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export default function CalloutSection() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <section
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <div
            className="relative overflow-hidden"
            style={{ border: "1px solid #1A1A1A", borderRadius: "24px", background: "#FBFBFA" }}
            onMouseMove={onMove}
          >
            {/* Mouse spotlight */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(18,255,128,0.14), transparent 42%)`,
              }}
            />

            {/* Decorative corners */}
            <div className="pointer-events-none absolute right-0 top-0" style={{ width: "128px", height: "128px", borderBottom: "1px solid rgba(26,26,26,0.12)", borderLeft: "1px solid rgba(26,26,26,0.12)" }} />
            <div className="pointer-events-none absolute bottom-0 left-0" style={{ width: "128px", height: "128px", borderTop: "1px solid rgba(26,26,26,0.12)", borderRight: "1px solid rgba(26,26,26,0.12)" }} />

            <div className="relative z-10 px-8 py-16 md:px-14 lg:py-20">
              <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
                {/* Left content */}
                <div className="flex-1">
                  <h2
                    className="font-semibold"
                    style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)", lineHeight: 0.98, letterSpacing: "-0.03em", color: "#1A1A1A" }}
                  >
                    Hand payroll to
                    <br />
                    an agent<span style={{ color: "#12FF80" }}>.</span>
                  </h2>

                  <p style={{ fontSize: "19px", color: "#8A8F98", marginTop: "24px", maxWidth: "520px", lineHeight: 1.6 }}>
                    Join the waitlist. The first 20 companies get three months
                    free, and lock launch pricing for life.
                  </p>

                  <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
                    <a
                      href="#waitlist"
                      className="group inline-flex items-center justify-center gap-2 font-medium transition-transform hover:scale-[1.02]"
                      style={{
                        height: "56px",
                        padding: "0 28px",
                        borderRadius: "9999px",
                        background: "#12FF80",
                        color: "#1A1A1A",
                        fontSize: "16px",
                        boxShadow: "0 10px 30px -10px rgba(18,255,128,0.6)",
                      }}
                    >
                      Join the Waitlist
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                      href="#how-it-works"
                      className="inline-flex items-center justify-center font-medium transition-colors hover:bg-black/[0.04]"
                      style={{ height: "56px", padding: "0 28px", borderRadius: "9999px", border: "1px solid #D7DADF", color: "#1A1A1A", fontSize: "16px" }}
                    >
                      See how it works
                    </a>
                  </div>

                  <p style={{ fontFamily: MONO, fontSize: "13px", color: "#8A8F98", marginTop: "28px" }}>
                    No credit card required · Built on Stellar
                  </p>
                </div>

                {/* Right animation */}
                <div className="hidden items-center justify-center lg:flex" style={{ width: "420px", height: "420px", marginRight: "-32px" }}>
                  <AnimatedCube />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
