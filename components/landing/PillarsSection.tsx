"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  FileText,
  TrendingUp,
  MessageCircle,
  EyeOff,
  Check,
  ArrowRight,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";

/* ---------- Autonomous card visual: an agent-action selector ---------- */
const ACTIONS: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: FileText, title: "Read 14 contracts", sub: "Timesheets + terms" },
  { icon: TrendingUp, title: "Locked FX at 1,618", sub: "Best rate in 6 days" },
  { icon: MessageCircle, title: "Resolved a dispute", sub: "Paid +$360 automatically" },
];

const ROW_H = 56;
const PAD = 8;

function AgentMock({ active, reduced }: { active: number; reduced: boolean }) {
  const shown = reduced ? 1 : active;
  return (
    <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: "16px", padding: "16px" }}>
      <div
        className="text-center font-medium"
        style={{ fontSize: "13px", color: "#5C6068", marginBottom: "12px" }}
      >
        Agent this week
      </div>
      <div
        className="relative"
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: `${PAD}px`,
          boxShadow: "rgba(16,24,40,0.06) 0px 4px 14px",
        }}
      >
        {ACTIONS.map((a, i) => {
          const Icon = a.icon;
          const on = shown === i;
          return (
            <div
              key={a.title}
              className="flex items-center gap-3"
              style={{
                height: `${ROW_H}px`,
                padding: "0 12px",
                borderRadius: "10px",
                background: on ? "#F4F6FB" : "transparent",
                border: on ? "1px solid #E4E8F2" : "1px solid transparent",
                transition: "background-color 250ms ease, border-color 250ms ease",
              }}
            >
              <span
                className="flex shrink-0 items-center justify-center"
                style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#DEF6E9" }}
              >
                <Icon size={16} color="#0A9200" />
              </span>
              <div className="flex-1">
                <div className="font-medium" style={{ fontSize: "13.5px", color: "#1A1A1A" }}>
                  {a.title}
                </div>
                <div style={{ fontSize: "12px", color: "#8A8F98" }}>{a.sub}</div>
              </div>
              <ChevronRight size={16} color="#C2C6CC" />
            </div>
          );
        })}

        {!reduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute"
            style={{ top: 0, right: 34 }}
            initial={false}
            animate={{ y: PAD + active * ROW_H + 22 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#1A1A1A"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" }}
            >
              <path d="M5 2.5l14.5 8.2-6.3 1.3L9.7 21 5 2.5z" />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- Private card visual: masked payroll ---------- */
const MASK_ROWS = [
  { name: "Chidi O.", flag: "🇳🇬" },
  { name: "Amara N.", flag: "🇰🇪" },
  { name: "Bola A.", flag: "🇬🇭" },
];

function PrivateMock() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.55)",
        borderRadius: "16px",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "rgba(16,24,40,0.06) 0px 4px 14px",
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium" style={{ fontSize: "13px", color: "#1A1A1A" }}>
            October payroll
          </span>
          <EyeOff size={15} color="#8A8F98" />
        </div>
        <div className="flex flex-col gap-2.5">
          {MASK_ROWS.map((r) => (
            <div key={r.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center"
                  style={{ width: "24px", height: "24px", borderRadius: "9999px", background: "#F0F1F3", fontSize: "12px" }}
                >
                  {r.flag}
                </span>
                <span style={{ fontSize: "13px", color: "#1A1A1A" }}>{r.name}</span>
              </div>
              <span
                className="font-medium"
                style={{ fontSize: "13px", color: "#C2C6CC", letterSpacing: "1.5px" }}
              >
                ••••
              </span>
            </div>
          ))}
        </div>
        <div
          className="mt-3 flex items-center gap-1.5"
          style={{ borderTop: "1px solid #F0F1F3", paddingTop: "11px", fontSize: "12px", color: "#0A9200" }}
        >
          <Check size={13} color="#0A9200" /> Verified · amounts hidden
        </div>
      </div>
    </div>
  );
}

/* ---------- Card shell ---------- */
function PillarCard({
  tint,
  title,
  soon,
  desc,
  linkText,
  linkHref,
  children,
}: {
  tint: string;
  title: string;
  soon?: boolean;
  desc: string;
  linkText: string;
  linkHref: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ background: tint, borderRadius: "28px", padding: "44px 44px 0" }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-semibold" style={{ fontSize: "clamp(28px, 3vw, 36px)", color: "#1A1A1A", letterSpacing: "-0.02em" }}>
          {title}
        </h3>
        {soon && (
          <span
            className="font-medium"
            style={{ background: "#FFFFFF", color: "#0A9200", borderRadius: "6px", padding: "3px 9px", fontSize: "12px" }}
          >
            Soon
          </span>
        )}
      </div>
      <p style={{ fontSize: "17px", color: "#5C6068", marginTop: "16px", lineHeight: 1.6, maxWidth: "380px" }}>
        {desc}
      </p>
      <a
        href={linkHref}
        className="mt-6 inline-flex items-center gap-2 font-medium transition-transform hover:translate-x-0.5"
        style={{ fontSize: "16px", color: "#1A1A1A" }}
      >
        {linkText} <ArrowRight size={18} />
      </a>
      <div className="mt-8" style={{ marginBottom: "-4px" }}>
        {children}
      </div>
    </div>
  );
}

export default function PillarsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(v < 0.34 ? 0 : v < 0.67 ? 1 : 2);
  });

  return (
    <section
      ref={sectionRef}
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <h2
            className="mx-auto text-center font-medium"
            style={{
              color: "#1A1A1A",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
              maxWidth: "720px",
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

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FadeIn>
            <PillarCard
              tint="#E4F7EC"
              title="Autonomous"
              desc="It reads your contracts, times the FX window, resolves disputes, and pays, on its own. You approve, or let it run."
              linkText="See how it works"
              linkHref="#how-it-works"
            >
              <AgentMock active={active} reduced={reduced} />
            </PillarCard>
          </FadeIn>
          <FadeIn delay={0.08}>
            <PillarCard
              tint="#EEF1F5"
              title="Private"
              soon
              desc="Stellar is public, but your payroll isn't. Zero-knowledge proofs verify every payment without revealing what anyone earns."
              linkText="How privacy works"
              linkHref="#security"
            >
              <PrivateMock />
            </PillarCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
