"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Search,
  Bell,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Users,
  ReceiptText,
  History,
  Wallet,
  Settings,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const DISPLAY = "var(--font-display)";
const MINT = "#12FF80";

/* ---------------- Cycling word (fade up) ---------------- */
const WORDS = ["thinks", "reasons", "protects", "resolves", "pays"];

function useWordCycle(interval = 2100) {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % WORDS.length), interval);
    return () => window.clearInterval(id);
  }, [reduced, interval]);

  return { word: WORDS[i], reduced };
}

/* ---------------- Floating coins ---------------- */
const COINS = [
  { src: "/hero/usdc.png", size: 82, top: "16%", left: "5%", dur: "7s", delay: "0s", rot: "-12deg" },
  { src: "/hero/xlm.png", size: 60, top: "30%", left: "15%", dur: "8.5s", delay: "0.6s", rot: "10deg" },
  { src: "/hero/usdc.png", size: 52, top: "64%", left: "8%", dur: "6.5s", delay: "0.3s", rot: "-8deg" },
  { src: "/hero/xlm.png", size: 58, top: "22%", right: "9%", dur: "7.5s", delay: "0.9s", rot: "14deg" },
  { src: "/hero/usdc.png", size: 50, top: "52%", right: "14%", dur: "9s", delay: "0.2s", rot: "-16deg" },
  { src: "/hero/usdc.png", size: 66, top: "70%", right: "6%", dur: "8s", delay: "0.5s", rot: "8deg" },
];

function Coins() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {COINS.map((c, i) => (
        <div
          key={i}
          className="floaty absolute"
          style={
            {
              top: c.top,
              left: (c as { left?: string }).left,
              right: (c as { right?: string }).right,
              "--dur": c.dur,
              "--delay": c.delay,
              "--rot": c.rot,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.src}
            alt=""
            width={c.size}
            height={c.size}
            style={{
              width: c.size,
              height: c.size,
              filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.45)) drop-shadow(0 0 18px rgba(18, 255, 128,0.18))",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const { word, reduced } = useWordCycle();
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 md:px-10"
      style={{
        background:
          "radial-gradient(120% 90% at 30% 6%, #0F5A41 0%, #0A3B2B 44%, #06231A 100%)",
        paddingTop: "150px",
        paddingBottom: "0",
      }}
    >
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "62px 62px",
          maskImage: "radial-gradient(circle at 50% 12%, black, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 12%, black, transparent 72%)",
        }}
      />
      <Coins />

      <div className="relative mx-auto max-w-container">
        {/* Copy */}
        <div className="mx-auto max-w-[860px] text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
            }}
          >
            <span style={{ display: "block" }}>Payroll that</span>
            <span
              style={{
                color: MINT,
                display: "inline-block",
                minWidth: "6em",
                height: "1.12em",
                lineHeight: "1.12em",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                verticalAlign: "bottom",
                position: "relative",
              }}
            >
              {reduced ? (
                word
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={word}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-110%", opacity: 0 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "inline-block" }}
                  >
                    {word}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto"
            style={{ fontSize: "19px", lineHeight: 1.6, color: "rgba(233,244,238,0.72)", marginTop: "22px", maxWidth: "600px" }}
          >
            Disburs is the autonomous agent that runs your entire payroll on its
            own. Zero-knowledge proofs settle every salary on Stellar and keep
            each amount completely private.
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
                style={{ width: "56px", height: "56px", borderRadius: "9999px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)" }}
              >
                <Play size={19} color={MINT} fill={MINT} style={{ marginLeft: "2px" }} />
              </span>
              <span className="font-medium" style={{ fontSize: "16px", color: "#FFFFFF" }}>
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
            style={{ top: "-28px", width: "100%", bottom: "48px", borderRadius: "26px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "-14px", width: "97%", bottom: "26px", borderRadius: "22px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <div className="relative mx-auto" style={{ width: "94%" }}>
            <DisbursDashboard />
          </div>
        </motion.div>
      </div>

      {/* white base for the bleed */}
      <div aria-hidden className="absolute inset-x-0 bottom-0" style={{ height: "120px", background: "#FFFFFF" }} />
    </section>
  );
}

/* ---------------- Disburs dashboard mock ---------------- */
const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: MessageSquare, label: "Agent Chat" },
  { icon: Users, label: "Contractors" },
  { icon: ReceiptText, label: "Payroll" },
  { icon: History, label: "History" },
  { icon: Wallet, label: "Wallet" },
  { icon: Settings, label: "Settings" },
];

const ACTIVITY = [
  { icon: CheckCircle2, text: "Paid 18 contractors in one Stellar transaction.", time: "2h ago" },
  { icon: MessageSquare, text: "Resolved Bola's overtime, paid an extra $360.", time: "5h ago" },
  { icon: TrendingUp, text: "Locked the day's best FX rate, saved $312.", time: "6h ago" },
  { icon: ShieldCheck, text: "Verified Amara's new wallet after a low risk change.", time: "1d ago" },
];

function DisbursDashboard() {
  return (
    <div
      className="relative z-10 flex overflow-hidden text-left"
      style={{ background: "#FBFBFC", borderRadius: "18px", boxShadow: "0 50px 90px -40px rgba(6,35,26,0.6)", minHeight: "460px" }}
    >
      {/* sidebar */}
      <div className="hidden md:flex flex-col" style={{ width: "196px", background: "#FFFFFF", borderRight: "1px solid #EDEEF1", padding: "18px 14px" }}>
        <span className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: "18px", color: "#15181C", padding: "0 8px 16px" }}>
          disburs<span style={{ color: MINT }}>.</span>
        </span>
        <div className="flex flex-col gap-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.label} className="flex items-center gap-3" style={{ padding: "8px 10px", borderRadius: "9px", background: n.active ? "#E6FBEF" : "transparent" }}>
                <Icon size={16} color={n.active ? "#0A9200" : "#9AA0A6"} />
                <span style={{ fontSize: "13px", color: n.active ? "#0A7A1E" : "#6B7078", fontWeight: n.active ? 600 : 400 }}>{n.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* main */}
      <div className="flex-1">
        {/* topbar */}
        <div className="flex items-center justify-between" style={{ padding: "14px 18px", borderBottom: "1px solid #EDEEF1", background: "#FFFFFF" }}>
          <div className="flex items-center gap-2" style={{ background: "#F3F4F6", borderRadius: "9px", padding: "8px 12px", width: "min(260px, 46%)" }}>
            <Search size={15} color="#AEB2BA" />
            <span style={{ fontSize: "13px", color: "#AEB2BA" }}>Search</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5" style={{ background: "#E6FBEF", color: "#0A7A1E", borderRadius: "8px", padding: "5px 9px", fontSize: "11.5px", fontWeight: 500 }}>
              <span className="inline-block rounded-full" style={{ width: "6px", height: "6px", background: MINT }} /> Agent active
            </span>
            <Bell size={17} color="#AEB2BA" />
            <span style={{ width: "32px", height: "32px", borderRadius: "9999px", background: "linear-gradient(135deg,#12FF80,#0A9200)", display: "inline-block" }} />
          </div>
        </div>

        <div className="flex">
          {/* content */}
          <div className="flex-1" style={{ padding: "18px" }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "18px", color: "#15181C" }}>Good morning, Collins</div>
            <div style={{ fontSize: "12.5px", color: "#9AA0A6", marginTop: "2px" }}>Here is what your agent has been doing.</div>

            {/* next payroll card */}
            <div style={{ border: "1px solid #EDEEF1", background: "#FFFFFF", borderRadius: "14px", padding: "16px", marginTop: "16px" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: "12px", color: "#9AA0A6" }}>Next payroll</div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "16px", color: "#15181C", marginTop: "2px" }}>Nov 30, 2026</div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#A66A00", background: "#FBEFD6", borderRadius: "7px", padding: "4px 9px" }}>Needs approval</span>
              </div>
              <div className="mt-4 grid grid-cols-3">
                <div>
                  <div style={{ fontSize: "11px", color: "#9AA0A6" }}>Total</div>
                  <div className="tnum" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "19px", color: "#15181C" }}>$48,120</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#9AA0A6" }}>Contractors</div>
                  <div className="tnum" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "19px", color: "#15181C" }}>18</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#9AA0A6" }}>Settles</div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "19px", color: "#15181C" }}>~4s</div>
                </div>
              </div>
              <button className="mt-4 inline-flex items-center gap-1.5 font-medium" style={{ height: "36px", padding: "0 15px", borderRadius: "9px", background: MINT, color: "#06231A", fontSize: "13px" }}>
                Review payroll <ArrowRight size={14} />
              </button>
            </div>

            {/* quick stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { l: "Active contractors", v: "18" },
                { l: "Paid this month", v: "$10,012" },
                { l: "Avg. FX achieved", v: "1,618" },
              ].map((s) => (
                <div key={s.l} style={{ border: "1px solid #EDEEF1", background: "#FFFFFF", borderRadius: "12px", padding: "12px 14px" }}>
                  <div className="tnum" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "18px", color: "#15181C" }}>{s.v}</div>
                  <div style={{ fontSize: "11px", color: "#9AA0A6", marginTop: "2px" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* activity feed */}
          <div className="hidden lg:block" style={{ width: "252px", borderLeft: "1px solid #EDEEF1", padding: "18px 16px", background: "#FFFFFF" }}>
            <div className="flex items-center gap-2" style={{ marginBottom: "14px" }}>
              <Sparkles size={15} color="#0A9200" />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#15181C" }}>Agent activity</span>
            </div>
            <div className="flex flex-col">
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex gap-3" style={{ padding: "9px 0" }}>
                    <span className="flex shrink-0 items-center justify-center" style={{ width: "28px", height: "28px", borderRadius: "9999px", background: "#E6FBEF" }}>
                      <Icon size={14} color="#0A9200" />
                    </span>
                    <div>
                      <div style={{ fontSize: "12px", color: "#3A3F45", lineHeight: 1.45 }}>{a.text}</div>
                      <div style={{ fontSize: "10.5px", color: "#AEB2BA", marginTop: "2px" }}>{a.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
