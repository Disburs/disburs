"use client";

import { motion } from "framer-motion";
import {
  Play,
  Bell,
  Sparkles,
  LayoutGrid,
  MessageSquare,
  Users,
  ReceiptText,
  History,
  Settings,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  Clock,
  Landmark,
  type LucideIcon,
} from "lucide-react";

const DISPLAY = "var(--font-display)";
const MINT = "#12FF80";

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 md:px-12"
      style={{
        background:
          "radial-gradient(72% 55% at 50% 0%, rgba(18,255,128,0.16) 0%, rgba(18,255,128,0) 55%)," +
          "radial-gradient(46% 42% at 10% 26%, rgba(11,199,94,0.12) 0%, rgba(11,199,94,0) 62%)," +
          "radial-gradient(46% 42% at 90% 26%, rgba(18,255,128,0.12) 0%, rgba(18,255,128,0) 62%)," +
          "#FFFFFF",
        paddingTop: "150px",
        paddingBottom: "120px",
      }}
    >
      {/* rigid gradient guide lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent calc(16.666% - 1px), rgba(14,26,20,0.05) calc(16.666% - 1px), rgba(14,26,20,0.05) 16.666%)",
            maskImage: "linear-gradient(180deg, transparent 20%, #000 46%, #000 82%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 20%, #000 46%, #000 82%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: "13%",
            backgroundImage: "repeating-linear-gradient(45deg, rgba(14,26,20,0.045) 0 1px, transparent 1px 11px)",
            maskImage: "linear-gradient(90deg, #000, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, #000, transparent)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0"
          style={{
            width: "13%",
            backgroundImage: "repeating-linear-gradient(-45deg, rgba(14,26,20,0.045) 0 1px, transparent 1px 11px)",
            maskImage: "linear-gradient(270deg, #000, transparent)",
            WebkitMaskImage: "linear-gradient(270deg, #000, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-container">
        {/* Copy */}
        <div className="mx-auto max-w-[860px] text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 500,
              color: "#0E1A14",
              fontSize: "clamp(2rem, 4.4vw, 2.875rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
            }}
          >
            Payroll that runs itself,
            <br />
            and stays private
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto"
            style={{ fontSize: "19px", lineHeight: 1.6, color: "#5B6B62", marginTop: "22px", maxWidth: "600px" }}
          >
            Disburs is private payroll for teams paying contractors across
            Africa. It reads contracts, times the FX, resolves disputes and
            settles on Stellar on its own, while zero-knowledge proofs keep
            every salary private.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-9"
          >
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center font-semibold transition-transform hover:scale-[1.03]"
              style={{
                height: "58px",
                padding: "0 38px",
                borderRadius: "9999px",
                background: MINT,
                color: "#06231A",
                fontSize: "16px",
                boxShadow: "0 16px 36px -12px rgba(18, 255, 128,0.6)",
              }}
            >
              Join the waitlist
            </a>
            <a href="#how-it-works" className="group inline-flex items-center gap-3">
              <span
                className="flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ width: "56px", height: "56px", borderRadius: "9999px", background: "#FFFFFF", border: "1px solid #E2E7E3", boxShadow: "0 8px 20px -10px rgba(14,26,20,0.2)" }}
              >
                <Play size={19} color="#0A9200" fill="#0A9200" style={{ marginLeft: "2px" }} />
              </span>
              <span className="font-medium" style={{ fontSize: "16px", color: "#0E1A14" }}>
                See how it works
              </span>
            </a>
          </motion.div>
        </div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="relative mx-auto"
          style={{ maxWidth: "1080px", marginTop: "62px" }}
        >
          {/* layered platform behind the dashboard */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "-28px", width: "100%", bottom: "-22px", borderRadius: "26px", background: "#EEF7F1", border: "1px solid rgba(14,26,20,0.05)" }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "-14px", width: "97%", bottom: "-11px", borderRadius: "22px", background: "#F4FAF6", border: "1px solid rgba(14,26,20,0.06)" }}
          />
          <div className="relative mx-auto" style={{ width: "94%" }}>
            <DisbursDashboard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Disburs dashboard mock ---------------- */
const NAV: { icon: LucideIcon; label: string; active?: boolean; badge?: string }[] = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: MessageSquare, label: "Agent Chat" },
  { icon: Users, label: "Contractors" },
  { icon: ReceiptText, label: "Payroll", badge: "2" },
  { icon: Landmark, label: "Treasury" },
  { icon: History, label: "History" },
  { icon: Settings, label: "Settings" },
];

const STATS: { icon: LucideIcon; label: string; value: string; sub: string }[] = [
  { icon: Landmark, label: "Total treasury", value: "$148,320", sub: "8,240 USDC · Stellar" },
  { icon: TrendingUp, label: "Paid this month", value: "$48,120", sub: "18 contractors" },
  { icon: CheckCircle2, label: "Runs completed", value: "42", sub: "0 failed" },
  { icon: Clock, label: "Pending approval", value: "2", sub: "Awaiting you" },
];

const OPS = [
  { label: "Contracts read", value: "14" },
  { label: "Disputes resolved", value: "3" },
  { label: "FX windows caught", value: "6" },
  { label: "Runs automated", value: "42" },
];

const ACTIVITY: { icon: LucideIcon; text: string; time: string }[] = [
  { icon: CheckCircle2, text: "Paid 18 contractors in one Stellar transaction", time: "2h ago" },
  { icon: MessageSquare, text: "Resolved Ngozi's overtime, paid an extra $360", time: "5h ago" },
  { icon: TrendingUp, text: "Locked the day's best FX rate, saved $312", time: "6h ago" },
  { icon: ShieldCheck, text: "Verified Kwabena's new wallet after a low-risk change", time: "1d ago" },
];

function DashArea() {
  const pts = [16, 28, 24, 42, 38, 54, 50, 66, 60, 80];
  const w = 300;
  const h = 74;
  const step = w / (pts.length - 1);
  const y = (v: number) => h - (v / 100) * (h - 8) - 4;
  const line = pts.map((v, i) => `${i * step},${y(v).toFixed(1)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <defs>
        <linearGradient id="dashg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(18,255,128,0.22)" />
          <stop offset="100%" stopColor="rgba(18,255,128,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#dashg)" />
      <polyline points={line} fill="none" stroke="#0BB85E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DisbursDashboard() {
  return (
    <div
      className="relative z-10 flex overflow-hidden text-left"
      style={{ background: "#FBFBFC", borderRadius: "18px", boxShadow: "0 50px 90px -40px rgba(6,35,26,0.6)", minHeight: "600px" }}
    >
      {/* sidebar */}
      <div className="hidden md:flex flex-col" style={{ width: "212px", background: "#FFFFFF", borderRight: "1px solid #EDEEF1", padding: "14px 12px" }}>
        {/* workspace switcher */}
        <div className="flex items-center gap-2.5" style={{ border: "1px solid #EDEEF1", borderRadius: 11, padding: "9px 10px" }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#12FF80,#0A9200)", flexShrink: 0 }} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold" style={{ fontSize: 12.5, color: "#15181C", lineHeight: 1.1 }}>John Doe</span>
            <span className="block" style={{ fontSize: 10.5, color: "#9AA0A6" }}>Founder</span>
          </span>
          <ChevronDown size={14} color="#AEB2BA" />
        </div>

        <span className="mt-4 block" style={{ fontSize: 10, letterSpacing: "0.1em", color: "#AEB2BA", padding: "0 8px 8px" }}>WORKSPACE</span>
        <div className="flex flex-col gap-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.label} className="flex items-center gap-2.5" style={{ padding: "8px 10px", borderRadius: 9, background: n.active ? "#E6FBEF" : "transparent" }}>
                <Icon size={16} color={n.active ? "#0A9200" : "#9AA0A6"} />
                <span className="flex-1" style={{ fontSize: 13, color: n.active ? "#0A7A1E" : "#6B7078", fontWeight: n.active ? 600 : 400 }}>{n.label}</span>
                {n.badge && (
                  <span className="font-semibold" style={{ fontSize: 10, color: "#0A9200", background: "#DEF6E9", borderRadius: 999, padding: "1px 7px" }}>{n.badge}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* help card */}
        <div className="mt-auto flex items-center gap-2.5" style={{ background: "#F6F8FB", borderRadius: 11, padding: "10px" }}>
          <span className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 999, background: "#E6FBEF" }}>
            <Sparkles size={14} color="#0A9200" />
          </span>
          <span>
            <span className="block font-semibold" style={{ fontSize: 11.5, color: "#15181C", lineHeight: 1.1 }}>Need help?</span>
            <span className="block" style={{ fontSize: 10, color: "#9AA0A6" }}>Ask the agent</span>
          </span>
        </div>
      </div>

      {/* main */}
      <div className="flex-1">
        {/* topbar */}
        <div className="flex items-center justify-between" style={{ padding: "14px 18px", borderBottom: "1px solid #EDEEF1", background: "#FFFFFF" }}>
          <div className="flex items-center gap-2" style={{ fontSize: 13.5 }}>
            <LayoutGrid size={15} color="#AEB2BA" />
            <span style={{ color: "#9AA0A6" }}>Workspace</span>
            <span style={{ color: "#D0D4DA" }}>/</span>
            <span style={{ color: "#15181C", fontWeight: 600 }}>Overview</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5" style={{ background: "#E6FBEF", color: "#0A7A1E", borderRadius: 8, padding: "5px 9px", fontSize: 11.5, fontWeight: 500 }}>
              <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: MINT }} /> Agent active
            </span>
            <span className="relative">
              <Bell size={17} color="#AEB2BA" />
              <span className="absolute flex items-center justify-center font-bold" style={{ top: -4, right: -4, width: 13, height: 13, borderRadius: 999, background: "#0A9200", color: "#fff", fontSize: 8 }}>4</span>
            </span>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: "linear-gradient(135deg,#12FF80,#0A9200)", display: "inline-block" }} />
          </div>
        </div>

        {/* content */}
        <div style={{ padding: "18px" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "18px", color: "#15181C" }}>Good morning, John</div>
          <div style={{ fontSize: "12.5px", color: "#9AA0A6", marginTop: "2px" }}>Here is what your agent did overnight.</div>

          {/* stat cards */}
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ border: "1px solid #EDEEF1", background: "#FFFFFF", borderRadius: 12, padding: "12px 13px" }}>
                  <div className="flex items-center gap-1.5" style={{ color: "#9AA0A6", fontSize: 11 }}>
                    <Icon size={13} color="#0A9200" /> {s.label}
                  </div>
                  <div className="tnum" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, color: "#15181C", marginTop: 6 }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: "#AEB2BA", marginTop: 2 }}>{s.sub}</div>
                </div>
              );
            })}
          </div>

          {/* chart + activity */}
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <div className="lg:col-span-2" style={{ border: "1px solid #EDEEF1", background: "#FFFFFF", borderRadius: 14, padding: "14px 16px" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: "#15181C" }}>Payroll paid over time</div>
                  <div style={{ fontSize: 11, color: "#9AA0A6" }}>Cumulative, last 90 days</div>
                </div>
                <TrendingUp size={16} color="#0A9200" />
              </div>
              <div className="mt-3">
                <DashArea />
              </div>
              <div className="mt-3 flex items-center gap-7" style={{ borderTop: "1px solid #F1F3F5", paddingTop: 10 }}>
                <div>
                  <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: "#9AA0A6" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: "#0BB85E" }} /> USDC
                  </div>
                  <div className="tnum" style={{ fontWeight: 600, fontSize: 14, color: "#15181C", marginTop: 2 }}>$148,320</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: "#9AA0A6" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: "#CFEFDD" }} /> XLM
                  </div>
                  <div className="tnum" style={{ fontWeight: 600, fontSize: 14, color: "#15181C", marginTop: 2 }}>8,240.50</div>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #EDEEF1", background: "#FFFFFF", borderRadius: 14, padding: "14px" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                <Sparkles size={15} color="#0A9200" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#15181C" }}>Agent activity</span>
              </div>
              <div className="flex flex-col">
                {ACTIVITY.slice(0, 3).map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex gap-2.5" style={{ padding: "7px 0" }}>
                      <span className="flex shrink-0 items-center justify-center" style={{ width: 26, height: 26, borderRadius: 999, background: "#E6FBEF" }}>
                        <Icon size={13} color="#0A9200" />
                      </span>
                      <div>
                        <div style={{ fontSize: 11.5, color: "#3A3F45", lineHeight: 1.4 }}>{a.text}</div>
                        <div style={{ fontSize: 10, color: "#AEB2BA", marginTop: 1 }}>{a.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* operations + next payroll */}
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div style={{ border: "1px solid #EDEEF1", background: "#FFFFFF", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: "#15181C", marginBottom: 8 }}>Agent operations</div>
              {OPS.map((o) => (
                <div key={o.label} className="flex items-center justify-between" style={{ padding: "6px 0", borderTop: "1px solid #F4F6F8" }}>
                  <span style={{ fontSize: 12, color: "#6B7078" }}>{o.label}</span>
                  <span className="tnum" style={{ fontSize: 12.5, fontWeight: 600, color: "#15181C" }}>{o.value}</span>
                </div>
              ))}
            </div>

            <div style={{ border: "1px solid #EDEEF1", background: "#FFFFFF", borderRadius: 14, padding: "14px 16px" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: 12, color: "#9AA0A6" }}>Next payroll</div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, color: "#15181C", marginTop: 2 }}>Nov 30, 2026</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#A66A00", background: "#FBEFD6", borderRadius: 7, padding: "4px 9px" }}>Needs approval</span>
              </div>
              <div className="mt-3 grid grid-cols-3">
                <div>
                  <div style={{ fontSize: 11, color: "#9AA0A6" }}>Total</div>
                  <div className="tnum" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, color: "#15181C" }}>$48,120</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9AA0A6" }}>People</div>
                  <div className="tnum" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, color: "#15181C" }}>18</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9AA0A6" }}>Settles</div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, color: "#15181C" }}>~4s</div>
                </div>
              </div>
              <button className="mt-3 inline-flex items-center gap-1.5 font-medium" style={{ height: 34, padding: "0 14px", borderRadius: 9, background: MINT, color: "#06231A", fontSize: 12.5 }}>
                Review payroll <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
