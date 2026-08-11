"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  TrendingUp,
  MessageCircle,
  Zap,
  ShieldCheck,
  Check,
  AlertCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";

/* ---------------- palette (orange, tazapay-style) ---------------- */
const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const FAINT = "#98A6AF";
const ACCENT = "#0A9200"; // brand green (was orange)
const ACCENT_BG = "#DEF6E9";
const AMBER = "#D97706"; // semantic "under review" only
const GREEN = "#16A34A";
const GREEN_BG = "#DCFCE7";
const MINT = "#12FF80";

const PANEL =
  "repeating-linear-gradient(120deg, rgba(10,146,0,0.04) 0 1px, transparent 1px 16px), radial-gradient(120% 120% at 85% 10%, #E9FBF0 0%, #F3FBF6 55%, #FDFEFD 100%)";

/* ---------------- mock primitives ---------------- */

function MiniCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(19,41,61,0.08)",
        borderRadius: 12,
        boxShadow: "0 18px 40px -24px rgba(19,41,61,0.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Square({ Icon, bg, fg, size = 44 }: { Icon: LucideIcon; bg: string; fg: string; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center" style={{ width: size, height: size, borderRadius: 12, background: bg, color: fg }}>
      <Icon size={Math.round(size * 0.5)} />
    </span>
  );
}

/* ---------------- per-card mocks ---------------- */

function MockContracts() {
  return (
    <div className="flex w-full max-w-[380px] items-center gap-3">
      <Square Icon={ShieldCheck} bg={ACCENT} fg="#fff" size={48} />
      <span style={{ width: 18, height: 1, background: "rgba(19,41,61,0.15)" }} />
      <div className="flex flex-1 flex-col gap-2">
        <MiniCard style={{ padding: "9px 11px" }}>
          <span className="block font-semibold" style={{ fontSize: 12, color: INK }}>
            Contracts read
          </span>
          <span className="block" style={{ fontSize: 10.5, color: FAINT }}>
            Scanning 14 documents…
          </span>
        </MiniCard>
        <MiniCard style={{ padding: "9px 11px" }}>
          <span className="block font-semibold" style={{ fontSize: 12, color: INK }}>
            Amounts calculated
          </span>
          <span className="block" style={{ fontSize: 10.5, color: FAINT }}>
            Bonuses, overtime, caps
          </span>
        </MiniCard>
      </div>
      <span style={{ width: 18, height: 1, background: "rgba(19,41,61,0.15)" }} />
      <Square Icon={Check} bg={GREEN_BG} fg={GREEN} size={48} />
    </div>
  );
}

function MockFx() {
  const rows = [
    { logo: "/logos/usdc.svg", code: "USDC", val: "1.00", strong: true },
    { flag: "🇳🇬", code: "NGN", val: "₦ 1,618.40" },
    { flag: "🇰🇪", code: "KES", val: "KSh 129.10" },
  ];
  return (
    <MiniCard style={{ padding: "16px 18px", width: "100%", maxWidth: 300 }}>
      <span className="mb-3 block text-center font-medium uppercase" style={{ fontSize: 10.5, letterSpacing: "0.1em", color: FAINT }}>
        Currency exchange
      </span>
      {rows.map((r) => (
        <div key={r.code} className="flex items-center justify-between" style={{ padding: "8px 0", borderTop: "1px solid rgba(19,41,61,0.06)" }}>
          <span className="flex items-center gap-2.5" style={{ fontSize: 18 }}>
            {r.logo ? <img src={r.logo} alt="" width={22} height={22} style={{ width: 22, height: 22 }} /> : <span>{r.flag}</span>}
            <span className="font-medium" style={{ fontSize: 12.5, color: INK }}>
              {r.code}
            </span>
          </span>
          <span className="font-semibold" style={{ fontSize: r.strong ? 22 : 17, color: r.strong ? INK : "#9AA6AE" }}>
            {r.val}
          </span>
        </div>
      ))}
    </MiniCard>
  );
}

function MockDisputes() {
  return (
    <MiniCard style={{ padding: "14px 16px", width: "100%", maxWidth: 340 }}>
      <div className="relative flex items-start justify-between" style={{ marginBottom: 8 }}>
        <span className="font-semibold" style={{ fontSize: 14, color: INK }}>
          Disputes
        </span>
        <span className="flex items-center gap-1 font-semibold" style={{ fontSize: 11, color: GREEN, background: GREEN_BG, borderRadius: 6, padding: "3px 7px" }}>
          ▼ 40% <span style={{ color: FAINT, fontWeight: 400 }}>vs last week</span>
        </span>
      </div>
      <svg viewBox="0 0 300 40" width="100%" height="34" preserveAspectRatio="none" style={{ marginBottom: 8 }}>
        <defs>
          <linearGradient id="dsp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(22,163,74,0.22)" />
            <stop offset="100%" stopColor="rgba(22,163,74,0)" />
          </linearGradient>
        </defs>
        <polygon points="0,40 0,26 40,22 80,28 120,14 160,20 200,10 240,18 300,8 300,40" fill="url(#dsp)" />
        <polyline points="0,26 40,22 80,28 120,14 160,20 200,10 240,18 300,8" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex items-center justify-between" style={{ padding: "8px 0", borderTop: "1px solid rgba(19,41,61,0.06)" }}>
        <span className="flex items-center gap-2.5">
          <Square Icon={AlertCircle} bg={AMBER} fg="#fff" size={30} />
          <span>
            <span className="block font-medium" style={{ fontSize: 12, color: INK, lineHeight: 1.1 }}>
              Overtime claim reviewed
            </span>
            <span className="block" style={{ fontSize: 9.5, color: FAINT }}>
              TCKT_87DXS9WC
            </span>
          </span>
        </span>
        <span className="font-semibold" style={{ fontSize: 12.5, color: INK }}>
          $360.00
        </span>
      </div>
      <div className="flex items-center justify-between" style={{ padding: "8px 0", borderTop: "1px solid rgba(19,41,61,0.06)" }}>
        <span className="flex items-center gap-2.5">
          <Square Icon={Check} bg={GREEN_BG} fg={GREEN} size={30} />
          <span>
            <span className="block font-medium" style={{ fontSize: 12, color: INK, lineHeight: 1.1 }}>
              Difference auto-paid
            </span>
            <span className="block" style={{ fontSize: 9.5, color: FAINT }}>
              pyout_214jns1
            </span>
          </span>
        </span>
        <span className="font-semibold" style={{ fontSize: 12.5, color: INK }}>
          $360.00
        </span>
      </div>
    </MiniCard>
  );
}

function MockPayout() {
  return (
    <MiniCard style={{ padding: "16px 18px", width: "100%", maxWidth: 300 }}>
      <span className="block font-medium uppercase" style={{ fontSize: 10, letterSpacing: "0.1em", color: FAINT }}>
        Batch payout
      </span>
      <div className="flex items-end justify-between" style={{ margin: "6px 0 12px" }}>
        <span className="font-semibold" style={{ fontSize: 26, color: INK, letterSpacing: "-0.02em" }}>
          $48,120.00
        </span>
      </div>
      <span className="flex w-full items-center justify-center gap-1.5 font-semibold" style={{ fontSize: 11.5, color: GREEN, background: GREEN_BG, borderRadius: 8, height: 32 }}>
        <Check size={13} /> Settled in 4.2s on Stellar
      </span>
      <div className="mt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(19,41,61,0.06)", paddingTop: 10 }}>
        <span style={{ fontSize: 11.5, color: MUT }}>18 contractors</span>
        <span className="font-medium" style={{ fontSize: 11.5, color: INK }}>
          Network fee &lt; $0.01
        </span>
      </div>
    </MiniCard>
  );
}

/* ---------------- data ---------------- */

type Cap = { title: string; desc: string; icon: LucideIcon; mock: React.ReactNode };

const CAPS: Cap[] = [
  {
    title: "Contract-aware payroll",
    desc: "The agent reads every contract and timesheet, then works out exactly what each person is owed, bonuses, overtime and caps included.",
    icon: FileText,
    mock: <MockContracts />,
  },
  {
    title: "FX at the best window",
    desc: "It monitors anchor rates around the clock and converts at the best moment of the day, not whenever payroll happens to run.",
    icon: TrendingUp,
    mock: <MockFx />,
  },
  {
    title: "Disputes, handled alone",
    desc: "It reads a contractor's message, checks the evidence on the ticket and pays the difference itself when the claim is valid.",
    icon: MessageCircle,
    mock: <MockDisputes />,
  },
  {
    title: "Batch payout on Stellar",
    desc: "It pays the entire team in a single transaction that settles in seconds, at near-zero network cost.",
    icon: Zap,
    mock: <MockPayout />,
  },
];

/* ---------------- sticky stacking scroll ---------------- */

const STICKY_TOP = 96;
const STICKY_STEP = 16;
const SCALE_STEP = 0.04;
const OFFSET_STEP = 8;

function StackingCards() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [depth, setDepth] = useState<number[]>(CAPS.map(() => 0));
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setRm = () => setReduced(mq.matches);
    setRm();
    mq.addEventListener("change", setRm);

    function onScroll() {
      const next = CAPS.map((_, i) => {
        let count = 0;
        for (let j = i + 1; j < CAPS.length; j++) {
          const el = cardRefs.current[j];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const stickyTopJ = STICKY_TOP + j * STICKY_STEP;
          if (rect.top <= stickyTopJ + 2) count++;
        }
        return count;
      });
      setDepth(next);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", setRm);
    };
  }, []);

  return (
    <div className="flex flex-col" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      {CAPS.map((cap, i) => {
        const d = reduced ? 0 : depth[i];
        const scale = 1 - d * SCALE_STEP;
        const translateY = d * OFFSET_STEP;

        return (
          <div
            key={cap.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="sticky mb-5"
            style={{ top: `${STICKY_TOP + i * STICKY_STEP}px`, zIndex: 10 + i }}
          >
            <div
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "top center",
                transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                willChange: "transform",
              }}
            >
              <div className="relative overflow-hidden" style={{ background: "#FFFFFF", borderRadius: "22px", border: "1px solid #ECECEC", boxShadow: "0 34px 70px -46px rgba(19,41,61,0.4)" }}>
                <div className="grid md:grid-cols-2">
                  {/* left: icon + copy */}
                  <div className="flex flex-col justify-center" style={{ padding: "38px 40px" }}>
                    <Square Icon={cap.icon} bg={ACCENT_BG} fg={ACCENT} size={52} />
                    <h3 className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: "26px", color: INK, letterSpacing: "-0.01em", marginTop: 20 }}>
                      {cap.title}
                    </h3>
                    <p style={{ fontSize: "15.5px", color: MUT, marginTop: "12px", lineHeight: 1.6, maxWidth: "420px" }}>
                      {cap.desc}
                    </p>
                  </div>
                  {/* right: peach mock panel */}
                  <div className="relative flex items-center justify-center" style={{ background: PANEL, padding: "34px 30px", minHeight: 260 }}>
                    {cap.mock}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AgentDemoSection() {
  return (
    <section className="px-5 md:px-10" style={{ background: "linear-gradient(180deg, #E7FAEE 0px, #F1F7F3 300px, #F6F8F6 520px)", paddingTop: "96px", paddingBottom: "96px" }}>
      <div className="mx-auto max-w-container">
        <FadeIn>
          <h2 className="mx-auto text-center font-semibold" style={{ fontFamily: DISPLAY, fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: INK, maxWidth: 720 }}>
            What true autonomy looks like
          </h2>
          <p className="mx-auto mt-4 text-center" style={{ fontSize: "18px", color: MUT, maxWidth: 560, lineHeight: 1.55 }}>
            One payroll week, run entirely by the agent, with zero actions from you and eleven decisions made on its own.
          </p>
        </FadeIn>

        <div className="mx-auto mt-14 max-w-[1000px]">
          <StackingCards />
        </div>

        <FadeIn>
          <div className="mt-10 flex justify-center">
            <a
              href="#waitlist"
              className="flex items-center gap-2 font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: MINT, color: "#06231A", borderRadius: 999, height: 48, padding: "0 24px", fontSize: 15, boxShadow: "0 10px 26px -12px rgba(18,255,128,0.7)" }}
            >
              Join the waitlist <ArrowRight size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
