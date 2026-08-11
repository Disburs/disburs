"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  TrendingUp,
  MessageCircle,
  EyeOff,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const FAINT = "#8A9B90";
const DEEP = "#0A9200";

/* ---------------- Autonomous: selectable agent panel ---------------- */
const ACTIONS: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: FileText, title: "Read 14 contracts", sub: "Timesheets + terms" },
  { icon: TrendingUp, title: "Locked FX at ₦1,618", sub: "Best rate in 6 days" },
  { icon: MessageCircle, title: "Resolved a dispute", sub: "Paid +$360 automatically" },
];

function AgentMock() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((p) => (p + 1) % ACTIONS.length), 1900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div style={{ background: "#EBEEF1", borderRadius: 20, padding: "18px 18px 22px" }}>
      <div className="text-center font-medium" style={{ fontSize: 13, color: MUT, marginBottom: 12 }}>
        Agent this week
      </div>
      <div className="relative" style={{ background: "#FFFFFF", borderRadius: 16, padding: 8, boxShadow: "0 20px 44px -26px rgba(14,26,20,0.35)" }}>
        {ACTIONS.map((a, i) => {
          const Icon = a.icon;
          const on = active === i;
          return (
            <div
              key={a.title}
              className="flex items-center gap-3"
              style={{ padding: "12px 14px", borderRadius: 12, background: on ? "#F1FBF6" : "transparent", transition: "background-color 300ms ease" }}
            >
              <span className="flex shrink-0 items-center justify-center" style={{ width: 40, height: 40, borderRadius: 11, background: "#DEF6E9" }}>
                <Icon size={19} color={DEEP} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold" style={{ fontSize: 14.5, color: INK, lineHeight: 1.15 }}>
                  {a.title}
                </div>
                <div className="truncate" style={{ fontSize: 12.5, color: FAINT }}>
                  {a.sub}
                </div>
              </div>
              <ChevronRight size={17} color="#C4D0C9" />
            </div>
          );
        })}
        {/* cursor pointer, drifting to the active row */}
        <svg
          aria-hidden
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="#0E1A14"
          className="pointer-events-none absolute"
          style={{ right: 40, top: 8 + active * 64 + 34, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))", transition: "top 400ms cubic-bezier(0.22,1,0.36,1)" }}
        >
          <path d="M5 2.5l14.5 8.2-6.3 1.3L9.7 21 5 2.5z" />
        </svg>
      </div>
    </div>
  );
}

/* ---------------- Private: shielded payroll ---------------- */
const MASK_ROWS = [
  { name: "Ngozi Adeyemi", flag: "🇳🇬" },
  { name: "Kwabena Mensah", flag: "🇬🇭" },
  { name: "Thabo Sithole", flag: "🇿🇦" },
];

function PrivateMock() {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 18, boxShadow: "0 20px 44px -26px rgba(14,26,20,0.35)" }}>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold" style={{ fontSize: 13.5, color: INK }}>
          October payroll
        </span>
        <EyeOff size={15} color={FAINT} />
      </div>
      <div className="flex flex-col gap-3.5">
        {MASK_ROWS.map((r) => (
          <div key={r.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: 999, background: "#F0F3F1", fontSize: 13 }}>
                {r.flag}
              </span>
              <span style={{ fontSize: 13.5, color: INK }}>{r.name}</span>
            </div>
            <span className="font-medium" style={{ fontSize: 14, color: "#C4D0C9", letterSpacing: 2 }}>
              ••••
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-1.5" style={{ borderTop: "1px solid #EDF1EE", paddingTop: 12, fontSize: 12.5, color: DEEP }}>
        <ShieldCheck size={14} color={DEEP} /> Zero-knowledge verified · amounts hidden
      </div>
    </div>
  );
}

/* ---------------- Card shell ---------------- */
function PillarCard({
  tint,
  title,
  soon,
  desc,
  linkHref,
  children,
}: {
  tint: string;
  title: string;
  soon?: boolean;
  desc: string;
  linkHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col" style={{ background: tint, borderRadius: 28, padding: "44px 44px 44px" }}>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-bold" style={{ fontFamily: DISPLAY, fontSize: "clamp(1.55rem, 2.8vw, 2.05rem)", color: INK, letterSpacing: "-0.025em", lineHeight: 1 }}>
          {title}
        </h3>
        {soon && (
          <span className="font-medium" style={{ background: "#FFFFFF", color: DEEP, borderRadius: 6, padding: "3px 9px", fontSize: 12 }}>
            Soon
          </span>
        )}
      </div>
      <p style={{ fontSize: 17.5, color: MUT, marginTop: 18, lineHeight: 1.55, maxWidth: 380 }}>
        {desc}
      </p>
      <a
        href={linkHref}
        className="mt-5 inline-flex items-center gap-2 font-semibold transition-transform hover:translate-x-0.5"
        style={{ fontSize: 16.5, color: INK }}
      >
        Learn more <ArrowRight size={18} />
      </a>
      <div className="mt-auto pt-10">{children}</div>
    </div>
  );
}

export default function PillarsSection() {
  return (
    <section className="bg-white px-5 md:px-10" style={{ paddingTop: "96px", paddingBottom: "100px" }}>
      <div className="mx-auto max-w-container">
        <FadeIn>
          <h2 className="mx-auto text-center font-semibold" style={{ fontFamily: DISPLAY, color: INK, fontSize: "clamp(1.65rem, 3.1vw, 2.2rem)", lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 760 }}>
            It runs your payroll. It keeps it private.
          </h2>
          <p className="mx-auto mt-5 text-center" style={{ fontSize: 18, color: MUT, maxWidth: 520, lineHeight: 1.55 }}>
            Two things no other payroll tool puts together.
          </p>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <FadeIn>
            <PillarCard
              tint="#E9F8F1"
              title="Autonomous"
              desc="It reads your contracts, times the FX window, resolves disputes and pays, on its own. You approve, or let it run."
              linkHref="#how-it-works"
            >
              <AgentMock />
            </PillarCard>
          </FadeIn>
          <FadeIn delay={0.08}>
            <PillarCard
              tint="#EEF1F5"
              title="Private"
              soon
              desc="Stellar is public, but your payroll isn't. Zero-knowledge proofs verify every payment without revealing what anyone earns."
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
