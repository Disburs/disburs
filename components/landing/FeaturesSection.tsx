"use client";

/* eslint-disable @next/next/no-img-element */

import {
  FileText,
  TrendingUp,
  EyeOff,
  MessageCircle,
  BarChart3,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Plus,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUTED = "#5B6B62";
const FAINT = "#8A9B90";
const MINT = "#12FF80";
const DEEP = "#0A9200";

/* ---------------- Small primitives ---------------- */

function Avatar({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      width={26}
      height={26}
      style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  );
}

function Amount({ value, sign = "" }: { value: string; sign?: string }) {
  const [whole, cents] = value.split(".");
  return (
    <span className="font-semibold" style={{ fontSize: 12.5, color: INK }}>
      {sign}
      {whole}
      {cents && <span style={{ fontSize: 10, color: FAINT }}>.{cents}</span>}
    </span>
  );
}

const TONES: Record<string, { bg: string; fg: string }> = {
  paid: { bg: "#DEF6E9", fg: "#0A9200" },
  scheduled: { bg: "#FFF1CF", fg: "#946200" },
  processing: { bg: "#E6EEFF", fg: "#2B5FDB" },
};

function Pill({ label, tone }: { label: string; tone: keyof typeof TONES }) {
  const t = TONES[tone];
  return (
    <span className="font-medium" style={{ background: t.bg, color: t.fg, fontSize: 10, borderRadius: 6, padding: "3px 8px", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(14,26,20,0.08)",
        borderRadius: "16px",
        boxShadow: "0 24px 50px -26px rgba(14,26,20,0.4)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Gradient area chart. `pts` are 0..100 heights, evenly spaced.
function Area({ id, pts, w = 240, h = 56 }: { id: string; pts: number[]; w?: number; h?: number }) {
  const step = w / (pts.length - 1);
  const y = (v: number) => h - (v / 100) * (h - 6) - 3;
  const line = pts.map((v, i) => `${i * step},${y(v).toFixed(1)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(18,255,128,0.16)" />
          <stop offset="100%" stopColor="rgba(18,255,128,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={MINT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Mocks ---------------- */

function MockPayroll() {
  const rows = [
    { name: "Ngozi Adeyemi", role: "Product Design", avatar: "/avatars/ngozi.jpg", date: "Feb 01", amt: "2,480.00", status: "scheduled" as const },
    { name: "Thabo Sithole", role: "Backend", avatar: "/avatars/thabo.jpg", date: "Jan 25", amt: "3,150.00", status: "paid" as const },
    { name: "Fatou Ndiaye", role: "QA", avatar: "/avatars/fatou.jpg", date: "Jan 25", amt: "1,920.00", status: "paid" as const },
    { name: "Kwabena Mensah", role: "Data", avatar: "/avatars/kwabena.jpg", date: "Jan 25", amt: "2,240.00", status: "processing" as const },
    { name: "Amara Nwosu", role: "Content", avatar: "/avatars/amara.jpg", date: "Jan 18", amt: "1,760.00", status: "paid" as const },
  ];
  return (
    <Panel>
      <div className="flex items-center justify-between" style={{ padding: "13px 14px 11px" }}>
        <span className="font-semibold" style={{ fontSize: 13.5, color: INK }}>
          Payroll
        </span>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1.5" style={{ border: "1px solid rgba(14,26,20,0.1)", borderRadius: 8, padding: "4px 8px", color: FAINT, fontSize: 10.5 }}>
            <Search size={11} /> Search
          </span>
          <span className="flex items-center justify-center" style={{ border: "1px solid rgba(14,26,20,0.1)", borderRadius: 8, width: 24, height: 24, color: FAINT }}>
            <SlidersHorizontal size={11} />
          </span>
          <span className="flex items-center gap-1 font-medium" style={{ background: "#0E1A14", color: "#fff", borderRadius: 8, padding: "5px 9px", fontSize: 10.5 }}>
            <Plus size={11} /> Pay all (18)
          </span>
        </div>
      </div>
      <div className="grid items-center" style={{ gridTemplateColumns: "44px 1fr auto auto 16px", gap: 8, padding: "6px 14px", background: "#F7FAF8", color: FAINT, fontSize: 10, borderTop: "1px solid rgba(14,26,20,0.06)", borderBottom: "1px solid rgba(14,26,20,0.06)" }}>
        <span>Date</span>
        <span>Contractor</span>
        <span>Amount</span>
        <span>Status</span>
        <span />
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid items-center" style={{ gridTemplateColumns: "44px 1fr auto auto 16px", gap: 8, padding: "9px 14px", borderBottom: "1px solid rgba(14,26,20,0.05)" }}>
          <span style={{ fontSize: 10.5, color: FAINT, lineHeight: 1.1 }}>
            {r.date}
            <br />
            2025
          </span>
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar src={r.avatar} />
            <span className="min-w-0">
              <span className="block truncate font-medium" style={{ fontSize: 12, color: INK }}>
                {r.name}
              </span>
              <span className="block truncate" style={{ fontSize: 10, color: FAINT }}>
                Payroll · {r.role}
              </span>
            </span>
          </span>
          <Amount value={r.amt} sign="$" />
          <Pill label={r.status[0].toUpperCase() + r.status.slice(1)} tone={r.status} />
          <ChevronRight size={13} color="#C4D0C9" />
        </div>
      ))}
    </Panel>
  );
}

function Stat({ id, label, value, delta, pts }: { id: string; label: string; value: string; delta: string; pts: number[] }) {
  return (
    <div style={{ background: "#F7FAF8", border: "1px solid rgba(14,26,20,0.06)", borderRadius: 12, padding: "10px 11px" }}>
      <span className="block" style={{ fontSize: 10, color: FAINT }}>
        {label}
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="font-semibold" style={{ fontSize: 16, color: INK }}>
          {value}
        </span>
        <span className="font-medium" style={{ fontSize: 10, color: DEEP }}>
          {delta}
        </span>
      </span>
      <div style={{ marginTop: 4, opacity: 0.9 }}>
        <Area id={id} pts={pts} h={28} />
      </div>
    </div>
  );
}

function MockInsights() {
  return (
    <Panel style={{ padding: "15px" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <span className="font-semibold" style={{ fontSize: 13, color: INK }}>
          Payout insights
        </span>
        <div className="flex items-center gap-1.5">
          <span style={{ background: "#0E1A14", color: "#fff", borderRadius: 8, padding: "4px 9px", fontSize: 10 }}>Jan 1 – Jan 31</span>
          <span style={{ border: "1px solid rgba(14,26,20,0.1)", borderRadius: 8, padding: "4px 9px", fontSize: 10, color: MUTED }}>Team</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Stat id="s1" label="Total paid" value="$148,320" delta="+6%" pts={[30, 42, 36, 58, 50, 70, 64]} />
        <Stat id="s2" label="Contractors" value="18" delta="+2" pts={[40, 44, 50, 48, 60, 66, 72]} />
        <Stat id="s3" label="On-time" value="100%" delta="↑" pts={[60, 62, 64, 63, 68, 70, 72]} />
        <Stat id="s4" label="Fee / run" value="$0.014" delta="−31%" pts={[80, 70, 66, 58, 50, 44, 30]} />
      </div>
      <div className="mt-3 flex items-end gap-2" style={{ height: 58 }}>
        {[46, 62, 40, 74, 56, 88, 68, 52, 80].map((h, i) => (
          <span key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: i === 5 ? MINT : "#CFEFDD" }} />
        ))}
      </div>
    </Panel>
  );
}

/* ---------------- Cards ---------------- */

type Card = {
  key: string;
  tint: string;
  Icon: LucideIcon;
  label: string;
  title: string;
  link: string;
  mock?: React.ReactNode;
  illo?: string;
};

const VERTICAL: Card[] = [
  { key: "payroll", tint: "#F0FBF5", Icon: FileText, label: "Payroll", title: "Run payroll without lifting a finger.", link: "Automate payroll", mock: <MockPayroll /> },
  { key: "fx", tint: "#E9F8F1", Icon: TrendingUp, label: "Smart FX", title: "Always convert at the best rate.", link: "See the FX engine", illo: "/illustrations/fx.svg" },
  { key: "privacy", tint: "#E3F6EA", Icon: EyeOff, label: "Zero-knowledge", title: "Pay your whole team, privately.", link: "How privacy works", illo: "/illustrations/privacy.svg" },
  { key: "agent", tint: "#EEFAF3", Icon: MessageCircle, label: "AI Agent", title: "An agent that resolves issues for you.", link: "Meet the agent", illo: "/illustrations/agent.svg" },
];

function CategoryLabel({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <span className="flex items-center gap-2 font-medium" style={{ fontSize: 13.5, color: DEEP }}>
      <Icon size={16} /> {label}
    </span>
  );
}

function CardLink({ children }: { children: string }) {
  return (
    <span className="flex items-center gap-1.5 font-semibold" style={{ fontSize: 15, color: INK }}>
      {children} <ArrowRight size={15} />
    </span>
  );
}

function VerticalCard({ card }: { card: Card }) {
  const isIllo = Boolean(card.illo);
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{ background: card.tint, borderRadius: "24px", padding: isIllo ? "30px" : "30px 30px 0", minHeight: 470 }}
    >
      <CategoryLabel Icon={card.Icon} label={card.label} />
      <h3 className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: "23px", lineHeight: 1.14, color: INK, margin: "14px 0 16px" }}>
        {card.title}
      </h3>
      <CardLink>{card.link}</CardLink>
      {isIllo ? (
        <div className="flex flex-1 items-end justify-center" style={{ marginTop: 20 }}>
          <img src={card.illo} alt="" style={{ width: "86%", maxHeight: 210, objectFit: "contain" }} />
        </div>
      ) : (
        <div style={{ marginTop: 26, marginBottom: -22 }}>{card.mock}</div>
      )}
    </div>
  );
}

/* ---------------- Section ---------------- */

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white px-5 md:px-10" style={{ paddingTop: "96px", paddingBottom: "100px" }}>
      <div className="mx-auto max-w-container">
        <FadeIn>
          <span className="block text-center font-semibold uppercase" style={{ fontSize: "13px", color: DEEP, letterSpacing: "0.12em" }}>
            Product Suite
          </span>
          <h2 className="mx-auto mt-4 text-center font-semibold" style={{ fontFamily: DISPLAY, color: INK, maxWidth: "820px", fontSize: "clamp(30px, 5vw, 46px)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            The autonomous payroll platform for global teams.
          </h2>
          <p className="mx-auto mt-5 text-center" style={{ maxWidth: "560px", fontSize: "18px", lineHeight: 1.55, color: MUTED }}>
            Pay, protect and reconcile your whole team without any hassle.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#waitlist" className="flex items-center gap-2 font-semibold transition-transform hover:scale-[1.02]" style={{ background: "#0E1A14", color: "#FFFFFF", borderRadius: 999, height: 46, padding: "0 22px", fontSize: 15 }}>
              Join the waitlist <ArrowRight size={16} />
            </a>
            <a href="#how-it-works" className="flex items-center font-semibold" style={{ background: "#EEF1EF", color: INK, borderRadius: 999, height: 46, padding: "0 22px", fontSize: 15 }}>
              See how it works
            </a>
          </div>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VERTICAL.map((card, i) => (
            <FadeIn key={card.key} delay={(i % 3) * 0.05} className="h-full">
              <VerticalCard card={card} />
            </FadeIn>
          ))}

          <FadeIn delay={0.05} className="h-full md:col-span-2">
            <div className="relative flex h-full flex-col overflow-hidden md:flex-row md:items-center" style={{ background: "#E7F7EE", borderRadius: "24px", padding: "30px", gap: "26px" }}>
              <div className="md:max-w-[300px]">
                <CategoryLabel Icon={BarChart3} label="Insights" />
                <h3 className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: "23px", lineHeight: 1.14, color: INK, margin: "14px 0 16px" }}>
                  Full visibility into every payout.
                </h3>
                <CardLink>Explore insights</CardLink>
              </div>
              <div className="min-w-0 flex-1">
                <MockInsights />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
