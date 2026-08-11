"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import {
  Building2,
  Users,
  FileText,
  EyeOff,
  LayoutDashboard,
  Zap,
  ArrowLeftRight,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Landmark,
  Copy,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const FAINT = "#8FA398";
const MINT = "#12FF80";
const DEEP = "#0A9200";
const LINE = "#E7ECE8";

/* ---------------- accordion ---------------- */

type Item = { icon: LucideIcon; title: string; desc: string };

function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderBottom: `1px solid ${LINE}` }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const Icon = it.icon;
        return (
          <div key={it.title} style={{ borderTop: `1px solid ${LINE}` }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between"
              style={{ padding: "18px 2px", textAlign: "left" }}
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} color={isOpen ? DEEP : FAINT} />
                <span className="font-semibold" style={{ fontSize: 17, color: INK }}>
                  {it.title}
                </span>
              </span>
              <ChevronDown size={18} color={FAINT} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .3s ease", flexShrink: 0 }} />
            </button>
            <div style={{ maxHeight: isOpen ? 220 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
              <p style={{ fontSize: 15.5, color: MUT, lineHeight: 1.6, padding: "0 0 20px 30px", maxWidth: 440 }}>
                {it.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- gradient panel ---------------- */

function Panel({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden" style={{ borderRadius: 20, background: bg, minHeight: 470 }}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(10, 146, 0,0.05) 0 1px, transparent 1px 13px)" }}
      />
      {/* faint centre cross, echoing the reference's quadrant grid */}
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(10, 146, 0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(10, 146, 0,0.06) 1px, transparent 1px)", backgroundSize: "50% 50%", backgroundPosition: "center" }} />
      <div className="relative flex h-full items-center justify-center" style={{ padding: "34px" }}>
        {children}
      </div>
    </div>
  );
}

function Logo({ src, size = 22 }: { src: string; size?: number }) {
  return <img src={src} alt="" width={size} height={size} style={{ width: size, height: size }} />;
}

/* ---------------- mocks ---------------- */

function MockTreasury() {
  return (
    <div className="relative w-full" style={{ maxWidth: 356 }}>
      {/* card peeking behind */}
      <div className="absolute" style={{ top: -24, left: 18, right: 18, background: "#FFFFFF", borderRadius: 16, border: "1px solid rgba(14,26,20,0.08)", padding: "11px 15px", boxShadow: "0 18px 36px -26px rgba(14,26,20,0.4)" }}>
        <div className="flex items-center justify-between">
          <Logo src="/logos/stellar.svg" size={22} />
          <span className="flex items-center gap-2" style={{ fontSize: 11, color: FAINT, letterSpacing: "0.06em" }}>
            STELLAR <Landmark size={12} /> ·· 0130
          </span>
        </div>
      </div>

      {/* main card */}
      <div style={{ position: "relative", marginTop: 6, background: "#FFFFFF", borderRadius: 18, border: "1px solid rgba(14,26,20,0.09)", boxShadow: "0 34px 66px -30px rgba(14,26,20,0.5)", padding: 18 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <Logo src="/logos/usdc.svg" size={26} />
          <span className="flex items-center gap-2" style={{ fontSize: 11, color: FAINT, letterSpacing: "0.06em" }}>
            USDC <Landmark size={12} /> ·· 9593
          </span>
        </div>
        <div className="flex items-baseline gap-1.5" style={{ marginBottom: 14 }}>
          <span className="font-semibold" style={{ fontSize: 25, color: INK, letterSpacing: "-0.02em" }}>
            148,320.00
          </span>
          <span style={{ fontSize: 14, color: FAINT }}>USDC</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(14,26,20,0.07)", paddingTop: 12 }}>
          {[
            ["Next payroll", "Feb 01, 2025"],
            ["Contractors", "18 people"],
            ["Network", "Stellar"],
            ["Settlement", "~4 seconds"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between" style={{ padding: "6px 0" }}>
              <span style={{ fontSize: 12.5, color: FAINT }}>{k}</span>
              <span className="font-medium" style={{ fontSize: 12.5, color: INK }}>
                {v}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center font-medium uppercase" style={{ fontSize: 10, letterSpacing: "0.12em", color: "#B7C4BB", borderTop: "1px solid rgba(14,26,20,0.06)", paddingTop: 12 }}>
          USDC treasury account
        </div>
      </div>
    </div>
  );
}

function MockWallet() {
  return (
    <div className="relative w-full" style={{ maxWidth: 340 }}>
      {/* two wallet rows peeking behind */}
      <div className="absolute" style={{ top: -26, left: 14, right: 14, background: "#FFFFFF", borderRadius: 14, border: "1px solid rgba(14,26,20,0.08)", padding: "10px 14px", boxShadow: "0 16px 32px -24px rgba(14,26,20,0.4)", zIndex: 1 }}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Logo src="/logos/usdc.svg" size={20} />
            <span className="font-medium" style={{ fontSize: 12.5, color: INK }}>
              USDC
            </span>
          </span>
          <span style={{ fontSize: 10, color: FAINT, letterSpacing: "0.08em" }}>STELLAR WALLET</span>
        </div>
      </div>

      {/* main wallet card */}
      <div style={{ position: "relative", marginTop: 10, background: "#FFFFFF", borderRadius: 18, border: "1px solid rgba(14,26,20,0.09)", boxShadow: "0 34px 66px -30px rgba(14,26,20,0.5)", padding: 18, zIndex: 2 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <span className="flex items-center gap-2">
            <Logo src="/logos/usdc.svg" size={22} />
            <span className="font-medium" style={{ fontSize: 13, color: INK }}>
              USDC
            </span>
          </span>
          <span style={{ fontSize: 10, color: FAINT, letterSpacing: "0.08em" }}>STELLAR WALLET</span>
        </div>
        <div className="font-semibold" style={{ fontSize: 24, color: INK, letterSpacing: "-0.02em" }}>
          $2,480.00
        </div>
        <div style={{ borderTop: "1px solid rgba(14,26,20,0.07)", margin: "14px 0 10px", paddingTop: 12 }}>
          <span className="block" style={{ fontSize: 11, color: FAINT }}>
            Received this month
          </span>
          <span className="font-semibold" style={{ fontSize: 20, color: INK, letterSpacing: "-0.01em" }}>
            $9,240.00
          </span>
        </div>
        <div className="flex items-center gap-2" style={{ fontSize: 11, color: FAINT }}>
          <Logo src="/logos/stellar.svg" size={14} />
          GABC…3253
          <Copy size={11} />
          <span style={{ marginLeft: "auto", color: DEEP, fontWeight: 600 }}>+ Paid on time</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- block ---------------- */

type Block = {
  reverse?: boolean;
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  heading: string;
  items: Item[];
  panelBg: string;
  mock: React.ReactNode;
};

function ServeBlock({ reverse, eyebrow, eyebrowIcon: EI, heading, items, panelBg, mock }: Block) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      {/* text side */}
      <div className={reverse ? "md:order-2" : ""}>
        <span className="flex items-center gap-2.5 font-semibold" style={{ fontSize: 15, color: INK }}>
          <span className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 9, background: DEEP }}>
            <EI size={15} color="#fff" />
          </span>
          {eyebrow}
        </span>
        <h2 className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: "clamp(1.55rem, 2.8vw, 2.05rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: INK, margin: "20px 0 22px", maxWidth: 460 }}>
          {heading}
        </h2>
        <Accordion items={items} />
        <div className="mt-8 flex items-center gap-6">
          <a
            href="#waitlist"
            className="flex items-center font-semibold transition-transform hover:scale-[1.02]"
            style={{ background: MINT, color: "#06231A", borderRadius: 10, height: 46, padding: "0 20px", fontSize: 15, boxShadow: "0 10px 26px -12px rgba(18, 255, 128,0.7)" }}
          >
            Join the waitlist
          </a>
          <a href="#how-it-works" className="flex items-center gap-1.5 font-semibold" style={{ fontSize: 15, color: INK }}>
            How it works <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* visual side */}
      <div className={reverse ? "md:order-1" : ""}>
        <FadeIn>
          <Panel bg={panelBg}>{mock}</Panel>
        </FadeIn>
      </div>
    </div>
  );
}

/* ---------------- section ---------------- */

const COMPANY_ITEMS: Item[] = [
  {
    icon: FileText,
    title: "Contract-aware payroll runs",
    desc: "The agent reads every contract, times the FX and pays your whole team on Stellar, with no spreadsheets and no manual runs.",
  },
  {
    icon: EyeOff,
    title: "Private by default",
    desc: "Zero-knowledge proofs keep every salary amount off the public chain while still proving each payment is correct.",
  },
  {
    icon: LayoutDashboard,
    title: "One dashboard for everything",
    desc: "Contracts, contractors, payouts and history live in a single view your accounting team can export any time.",
  },
];

const CONTRACTOR_ITEMS: Item[] = [
  {
    icon: Zap,
    title: "Paid the moment payroll runs",
    desc: "Receive USDC on Stellar in seconds, with a plain-English record of what you were paid and exactly why.",
  },
  {
    icon: ArrowLeftRight,
    title: "Cash out in your currency",
    desc: "Convert to naira, KES or ZAR through licensed partners where available, or simply hold your balance in USDC.",
  },
  {
    icon: ShieldCheck,
    title: "Your pay stays private",
    desc: "Zero-knowledge proofs mean your salary is never exposed on-chain, to anyone.",
  },
];

export default function WhoWeServeSection() {
  return (
    <section id="who-we-serve" className="bg-white px-6 md:px-12" style={{ paddingTop: "96px", paddingBottom: "100px" }}>
      <div className="mx-auto max-w-container">
        <FadeIn>
          <span className="block text-center font-semibold uppercase" style={{ color: DEEP, fontSize: 13, letterSpacing: "0.12em" }}>
            Who we serve
          </span>
          <h2 className="mx-auto mt-4 text-center font-semibold" style={{ fontFamily: DISPLAY, color: INK, maxWidth: 720, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Built for both sides of payroll
          </h2>
          <p className="mx-auto mt-5 text-center" style={{ color: MUT, fontSize: 18, maxWidth: 560, lineHeight: 1.55 }}>
            Whether you run payroll or receive it, Disburs works the way you do.
          </p>
        </FadeIn>

        <div className="mt-16 flex flex-col" style={{ gap: 96 }}>
        <ServeBlock
          eyebrow="For companies"
          eyebrowIcon={Building2}
          heading="Global payroll, run by one agent"
          items={COMPANY_ITEMS}
          panelBg="radial-gradient(120% 120% at 80% 12%, #E7FAEE 0%, #F3FBF6 55%, #FBFEFD 100%)"
          mock={<MockTreasury />}
        />
        <ServeBlock
          reverse
          eyebrow="For contractors"
          eyebrowIcon={Users}
          heading="Get paid in USDC, cash out in your currency"
          items={CONTRACTOR_ITEMS}
          panelBg="radial-gradient(120% 120% at 20% 12%, #E1F5EE 0%, #ECF8F3 55%, #FBFEFD 100%)"
          mock={<MockWallet />}
        />
        </div>
      </div>
    </section>
  );
}
