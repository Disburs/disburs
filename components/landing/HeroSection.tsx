"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import AnimatedSphere from "./AnimatedSphere";

// Verbs that describe what the Disburs agent actually does
const WORDS = ["thinks", "reasons", "adapts", "resolves"];

const STATS = [
  { value: "~4 sec", label: "settles on Stellar" },
  { value: "0.5%", label: "flat fee per run" },
  { value: "< $0.01", label: "network fee per payment" },
  { value: "4", label: "countries served" },
  { value: "24/7", label: "agent on watch" },
];

function GridLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: 0.4 }}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0"
          style={{ top: `${12.5 * (i + 1)}%`, height: "1px", background: "#E8E8E8" }}
        />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0"
          style={{ left: `${8.33 * (i + 1)}%`, width: "1px", background: "#E8E8E8" }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => setVisible(true), []);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((p) => (p + 1) % WORDS.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  const word = WORDS[wordIndex];

  return (
    <section
      id="top"
      className="relative flex flex-col justify-center overflow-hidden bg-white"
      style={{ minHeight: "100vh" }}
    >
      {/* Animated ASCII sphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-6%] top-1/2 hidden -translate-y-1/2 md:block"
        style={{ width: "min(46vw, 760px)", height: "min(46vw, 760px)", opacity: 0.42 }}
      >
        <AnimatedSphere />
      </div>

      <GridLines />

      {/* Content */}
      <div
        className="relative z-10 mx-auto w-full max-w-container px-5 md:px-10"
        style={{ paddingTop: "150px", paddingBottom: "150px" }}
      >
        {/* Eyebrow */}
        <div
          className="mb-8 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px)",
          }}
        >
          <span className="inline-flex items-center gap-3" style={{ fontFamily: "ui-monospace, monospace", fontSize: "13px", color: "#8A8F98", letterSpacing: "0.02em" }}>
            <span style={{ width: "32px", height: "1px", background: "#C2C6CC" }} />
            The autonomous payroll agent
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-semibold transition-all duration-1000"
          style={{
            fontSize: "clamp(2.75rem, 9vw, 6.75rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: "#1A1A1A",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(28px)",
          }}
        >
          <span className="block">Payroll that</span>
          <span className="block">
            <span className="relative inline-block">
              <span
                aria-hidden
                className="absolute left-0 right-0"
                style={{ bottom: "0.14em", height: "0.16em", background: "rgba(18,255,128,0.35)", zIndex: 0 }}
              />
              <span key={wordIndex} className="relative inline-flex" style={{ zIndex: 1 }}>
                {word.split("").map((char, i) => (
                  <span
                    key={`${wordIndex}-${i}`}
                    className="animate-char-in"
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
            <span style={{ color: "#12FF80" }}>.</span>
          </span>
        </h1>

        {/* Description + CTAs */}
        <div className="mt-12 grid items-end gap-10 lg:grid-cols-2 lg:gap-20">
          <p
            className="transition-all duration-700"
            style={{
              fontSize: "20px",
              lineHeight: 1.6,
              color: "#8A8F98",
              maxWidth: "560px",
              transitionDelay: "200ms",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(16px)",
            }}
          >
            Every payroll tool automates the clicks. Disburs reads your contracts,
            times the FX window, and pays your team on Stellar. Last cycle it made
            11 decisions. You made none.
          </p>

          <div
            className="flex flex-col items-start gap-4 transition-all duration-700 sm:flex-row"
            style={{
              transitionDelay: "300ms",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(16px)",
            }}
          >
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
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center font-medium transition-colors hover:bg-black/[0.04]"
              style={{
                height: "56px",
                padding: "0 28px",
                borderRadius: "9999px",
                border: "1px solid #E1E1E1",
                color: "#1A1A1A",
                fontSize: "16px",
              }}
            >
              See how it works
            </a>
          </div>
        </div>
      </div>

      {/* Stats marquee */}
      <div
        className="absolute bottom-12 left-0 right-0 overflow-hidden transition-opacity duration-700"
        style={{ opacity: visible ? 1 : 0, transitionDelay: "500ms" }}
      >
        <div className="marquee flex w-max gap-16 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-16" aria-hidden={copy === 1}>
              {STATS.map((s) => (
                <div key={`${copy}-${s.label}`} className="flex items-baseline gap-3">
                  <span className="font-semibold" style={{ fontSize: "clamp(28px, 3vw, 40px)", color: "#1A1A1A", letterSpacing: "-0.02em" }}>
                    {s.value}
                  </span>
                  <span style={{ fontSize: "14px", color: "#8A8F98" }}>{s.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
