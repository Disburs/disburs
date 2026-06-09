"use client";

import { Check, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const TRUST = [
  "Pay in seconds, not days",
  "Near-zero fees via Stellar",
  "No crypto knowledge needed",
];

export default function HeroSection() {
  return (
    <section
      id="top"
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "176px", paddingBottom: "80px" }}
    >
      <div className="mx-auto flex max-w-container flex-col items-center text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          className="font-medium"
          style={{
            color: "#1A1A1A",
            lineHeight: 1.0,
            fontSize: "clamp(32px, 8vw, 86px)",
          }}
        >
          Your payroll
          <br />
          runs itself<span style={{ color: "#12FF80" }}>.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="mt-6 font-normal"
          style={{
            fontSize: "20px",
            color: "#8A8F98",
            maxWidth: "640px",
            lineHeight: 1.6,
          }}
        >
          An AI agent that reads your contracts, calculates what everyone&rsquo;s
          owed, and pays your African team in seconds, at the best rate, on
          Stellar.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#waitlist"
            className="flex items-center justify-center font-medium transition-transform hover:scale-[1.02]"
            style={{
              height: "48px",
              padding: "12px 24px",
              borderRadius: "4px",
              background: "#12FF80",
              color: "#1A1A1A",
              fontSize: "16px",
              boxShadow: "rgba(0,0,0,0.06) 0px 4px 4px 0px",
            }}
          >
            Join the Waitlist →
          </a>
          <a
            href="#how-it-works"
            className="flex items-center justify-center font-medium transition-transform hover:scale-[1.02]"
            style={{
              height: "48px",
              padding: "12px 24px",
              borderRadius: "4px",
              background: "transparent",
              color: "#1A1A1A",
              border: "1px solid #E8E8E8",
              fontSize: "16px",
            }}
          >
            See How It Works
          </a>
        </motion.div>

        {/* Trust indicators */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          {TRUST.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <Check size={16} color="#12FF80" strokeWidth={3} />
              <span style={{ fontSize: "14px", color: "#8A8F98" }}>{t}</span>
            </div>
          ))}
        </div>

        {/* Hero visual: payroll dashboard mockup with mint glow */}
        <div className="relative mt-16 flex w-full justify-center">
          <div
            aria-hidden
            className="mint-glow absolute"
            style={{
              top: "-80px",
              width: "min(900px, 120%)",
              height: "520px",
              borderRadius: "9999px",
              zIndex: 0,
            }}
          />
          <div className="relative w-full" style={{ zIndex: 1 }}>
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

type Row = {
  initials: string;
  name: string;
  flag: string;
  role: string;
  amount: string;
};

const ROWS: Row[] = [
  { initials: "CO", name: "Chidi O.", flag: "🇳🇬", role: "Product Designer", amount: "$900" },
  { initials: "AN", name: "Amara N.", flag: "🇰🇪", role: "Frontend Engineer", amount: "$1,200" },
  { initials: "BA", name: "Bola A.", flag: "🇬🇭", role: "Project Manager", amount: "$760" },
];

const STATS = [
  { label: "Total due", value: "$12,400" },
  { label: "USDC balance", value: "$12,600" },
  { label: "Best FX rate", value: "1,618", sub: "NGN/USDC" },
];

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="mx-auto w-full bg-white text-left"
      style={{
        maxWidth: "880px",
        borderRadius: "20px",
        border: "2px solid #E8E8E8",
        padding: "24px",
      }}
    >
      {/* Top bar */}
      <div
        className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-start sm:justify-between"
        style={{ borderBottom: "1px solid #E8E8E8" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ fontSize: "18px", color: "#1A1A1A" }}>
              October Payroll
            </span>
            <span
              className="font-medium"
              style={{
                background: "#DEF6E9",
                color: "#0A9200",
                borderRadius: "4px",
                padding: "2px 8px",
                fontSize: "12px",
              }}
            >
              Due in 2 days
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "#8A8F98", marginTop: "4px" }}>
            14 contractors · Nigeria, Kenya, Ghana
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block rounded-full"
            style={{ width: "8px", height: "8px", background: "#12FF80" }}
          />
          <span style={{ fontSize: "12px", color: "#8A8F98" }}>Agent ready</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#F5F5F5",
              borderRadius: "12px",
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#8A8F98" }}>{s.label}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span
                className="font-medium"
                style={{ fontSize: "22px", color: "#1A1A1A", lineHeight: 1 }}
              >
                {s.value}
              </span>
              {s.sub && (
                <span style={{ fontSize: "11px", color: "#8A8F98" }}>{s.sub}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Agent insight */}
      <div
        className="mt-4 flex items-center gap-2"
        style={{ background: "#DEF6E9", borderRadius: "12px", padding: "12px 16px" }}
      >
        <Sparkles size={16} color="#0A9200" />
        <span
          className="font-medium"
          style={{ fontSize: "13px", color: "#0A9200", lineHeight: 1.4 }}
        >
          Best FX window detected. Running now saves you $204.
        </span>
      </div>

      {/* Contractor rows */}
      <div className="mt-5">
        {ROWS.map((r, i) => (
          <div
            key={r.name}
            className="flex items-center justify-between py-3"
            style={{
              borderBottom: i < ROWS.length - 1 ? "1px solid #E8E8E8" : "none",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center font-medium"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9999px",
                  background: "#F5F5F5",
                  fontSize: "12px",
                  color: "#1A1A1A",
                }}
              >
                {r.initials}
              </span>
              <div>
                <div style={{ fontSize: "14px", color: "#1A1A1A" }}>
                  {r.name} <span aria-hidden>{r.flag}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#8A8F98" }}>{r.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span
                className="font-medium"
                style={{ fontSize: "14px", color: "#1A1A1A" }}
              >
                {r.amount}
              </span>
              <span
                className="font-medium"
                style={{
                  background: "#DEF6E9",
                  color: "#0A9200",
                  borderRadius: "4px",
                  padding: "2px 8px",
                  fontSize: "12px",
                }}
              >
                Ready
              </span>
            </div>
          </div>
        ))}
        <div style={{ fontSize: "13px", color: "#8A8F98", marginTop: "12px" }}>
          + 11 more contractors
        </div>
      </div>

      {/* Bottom action */}
      <div
        className="mt-5 flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderTop: "1px solid #E8E8E8" }}
      >
        <span style={{ fontSize: "13px", color: "#8A8F98" }}>
          1 Stellar transaction · ~4 seconds
        </span>
        <button
          className="flex items-center justify-center gap-1 font-medium"
          style={{
            height: "40px",
            padding: "8px 16px",
            borderRadius: "4px",
            background: "#12FF80",
            color: "#1A1A1A",
            fontSize: "14px",
          }}
        >
          Run payroll <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
