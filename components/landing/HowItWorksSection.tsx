"use client";

/* eslint-disable @next/next/no-img-element */

import { Check, ArrowUpRight, ArrowDown, ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUTED = "#5B6B62";
const FAINT = "#8A9B90";
const MINT = "#12FF80";
const DEEP = "#0A9200";

/* ---------------- primitives ---------------- */

function FeaturePill({ label }: { label: string }) {
  return (
    <span
      className="flex items-center gap-1.5 font-medium"
      style={{ background: "#EAFBF1", color: DEEP, border: "1px solid #C9EFD9", borderRadius: 999, padding: "5px 11px", fontSize: 12, boxShadow: "0 8px 20px -12px rgba(14,26,20,0.4)" }}
    >
      <Check size={13} /> {label}
    </span>
  );
}

function Frame({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "#FFFFFF", border: "1px solid rgba(14,26,20,0.08)", borderRadius: 14, boxShadow: "0 24px 50px -28px rgba(14,26,20,0.45)", ...style }}
    >
      {children}
    </div>
  );
}

function Logo({ src, size = 20 }: { src: string; size?: number }) {
  return <img src={src} alt="" width={size} height={size} style={{ width: size, height: size }} />;
}

/* ---------------- card visuals ---------------- */

function VisualWorkspace() {
  return (
    <Frame style={{ padding: "14px" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <span className="font-semibold" style={{ fontSize: 13, color: INK }}>
          Payroll workspace
        </span>
        <span className="flex items-center gap-1.5" style={{ fontSize: 10, color: DEEP }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: MINT }} /> Live
        </span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <div>
          <span className="block" style={{ fontSize: 9, letterSpacing: "0.08em", color: FAINT, marginBottom: 6 }}>
            ACCOUNTS
          </span>
          {[
            { logo: "/logos/usdc.svg", name: "Treasury", net: "USDC · Stellar" },
            { logo: "/logos/usdc.svg", name: "Contractor pool", net: "USDC · Stellar" },
            { logo: "/logos/stellar.svg", name: "FX buffer", net: "XLM · Stellar" },
          ].map((a) => (
            <div key={a.name} className="flex items-center gap-2" style={{ padding: "7px 0", borderTop: "1px solid rgba(14,26,20,0.05)" }}>
              <Logo src={a.logo} size={22} />
              <span className="min-w-0">
                <span className="block truncate font-medium" style={{ fontSize: 11.5, color: INK, lineHeight: 1.1 }}>
                  {a.name}
                </span>
                <span className="block truncate" style={{ fontSize: 9.5, color: FAINT }}>
                  {a.net}
                </span>
              </span>
            </div>
          ))}
        </div>
        <div style={{ background: "#F7FAF8", borderRadius: 10, padding: "10px" }}>
          <span className="block" style={{ fontSize: 9, letterSpacing: "0.08em", color: FAINT, marginBottom: 8 }}>
            WALLET DETAILS
          </span>
          {[
            ["Currency", "USDC"],
            ["Network", "Stellar"],
            ["Address", "GABC…7Q"],
            ["Balance", "$128,760"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between" style={{ padding: "5px 0" }}>
              <span style={{ fontSize: 10.5, color: FAINT }}>{k}</span>
              <span className="font-medium" style={{ fontSize: 10.5, color: INK }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function VisualPrepare() {
  return (
    <Frame style={{ height: 244 }}>
      <img src="/how/prepare.jpg" alt="Founder reviewing a payroll run" className="h-full w-full" style={{ objectFit: "cover" }} />
      <span
        className="absolute flex items-center gap-1.5 font-semibold"
        style={{ top: 14, left: 14, background: "rgba(255,255,255,0.94)", color: DEEP, borderRadius: 999, padding: "5px 10px", fontSize: 11, backdropFilter: "blur(4px)" }}
      >
        <Check size={12} /> CONTRACT READ
      </span>
      <div
        className="absolute flex items-center justify-between"
        style={{ left: 14, right: 14, bottom: 14, background: "rgba(255,255,255,0.96)", borderRadius: 12, padding: "10px 12px", boxShadow: "0 14px 30px -16px rgba(14,26,20,0.5)", backdropFilter: "blur(4px)" }}
      >
        <span>
          <span className="block" style={{ fontSize: 9.5, letterSpacing: "0.06em", color: FAINT }}>
            RUN PREPARED
          </span>
          <span className="font-semibold" style={{ fontSize: 15, color: INK }}>
            $2,480.00
          </span>
        </span>
        <span className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: "50%", background: INK, color: "#fff" }}>
          <ArrowUpRight size={15} />
        </span>
      </div>
    </Frame>
  );
}

function VisualConvert() {
  return (
    <Frame style={{ height: 244 }}>
      <img src="/how/convert.jpg" alt="Treasury lead converting funds" className="h-full w-full" style={{ objectFit: "cover" }} />
      <div
        className="absolute"
        style={{ top: 14, left: 14, width: 168, background: "rgba(255,255,255,0.96)", borderRadius: 12, padding: "11px 12px", boxShadow: "0 14px 30px -16px rgba(14,26,20,0.5)", backdropFilter: "blur(4px)" }}
      >
        <span className="block" style={{ fontSize: 9.5, color: FAINT, marginBottom: 6 }}>
          Convert
        </span>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Logo src="/logos/usdc.svg" size={16} />
            <span className="font-medium" style={{ fontSize: 11.5, color: INK }}>
              USDC
            </span>
          </span>
          <span className="font-semibold" style={{ fontSize: 12, color: INK }}>
            10,000
          </span>
        </div>
        <div className="my-1.5 flex justify-center">
          <span className="flex items-center justify-center" style={{ width: 20, height: 20, borderRadius: "50%", background: "#EAFBF1", color: DEEP }}>
            <ArrowDown size={12} />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium" style={{ fontSize: 11.5, color: INK }}>
            🇺🇸 USD
          </span>
          <span className="font-semibold" style={{ fontSize: 12, color: INK }}>
            $10,000.00
          </span>
        </div>
      </div>
      <div className="absolute flex flex-wrap gap-2" style={{ left: 14, bottom: 14 }}>
        <FeaturePill label="Best rate" />
        <FeaturePill label="On Stellar" />
      </div>
    </Frame>
  );
}

function VisualPayout() {
  return (
    <Frame style={{ padding: "14px" }}>
      <div className="absolute flex flex-col items-end gap-1.5" style={{ top: 12, right: 12 }}>
        <FeaturePill label="24/7 access" />
        <FeaturePill label="Real-time" />
        <FeaturePill label="Private" />
      </div>
      <span className="block" style={{ fontSize: 9.5, letterSpacing: "0.06em", color: FAINT, marginBottom: 8 }}>
        PAYOUT TO
      </span>
      <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
        <img src="/how/payout.jpg" alt="" width={40} height={40} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
        <span className="min-w-0">
          <span className="block font-semibold" style={{ fontSize: 14, color: INK, lineHeight: 1.15 }}>
            Kagiso Molefe
          </span>
          <span className="flex items-center gap-1" style={{ fontSize: 10.5, color: FAINT }}>
            <Logo src="/logos/usdc.svg" size={13} /> USDC · Stellar
          </span>
          <span className="block truncate" style={{ fontSize: 9.5, color: "#B4C2B9", maxWidth: 190 }}>
            GABC…9f4d21e7cQ
          </span>
        </span>
      </div>
      <span className="block" style={{ fontSize: 10, color: FAINT, marginBottom: 6 }}>
        Contractor receives in
      </span>
      <div className="flex gap-2" style={{ marginBottom: 14 }}>
        {[
          { f: "🇳🇬", c: "NGN", on: true },
          { f: "🇰🇪", c: "KES", on: false },
          { f: "🇿🇦", c: "ZAR", on: false },
        ].map((o) => (
          <span
            key={o.c}
            className="flex items-center gap-1.5 font-medium"
            style={{ fontSize: 11, color: o.on ? INK : FAINT, border: `1px solid ${o.on ? DEEP : "rgba(14,26,20,0.1)"}`, background: o.on ? "#EAFBF1" : "#fff", borderRadius: 8, padding: "5px 9px" }}
          >
            {o.f} {o.c}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between" style={{ background: INK, borderRadius: 12, padding: "12px 14px" }}>
        <span>
          <span className="block" style={{ fontSize: 9.5, letterSpacing: "0.06em", color: "rgba(255,255,255,0.6)" }}>
            PAYOUT AMOUNT
          </span>
          <span className="font-semibold" style={{ fontSize: 15, color: "#fff" }}>
            $2,480.00
          </span>
        </span>
        <span className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: "50%", background: MINT, color: "#06231A" }}>
          <ArrowUpRight size={15} />
        </span>
      </div>
    </Frame>
  );
}

/* ---------------- cards ---------------- */

type Card = { title: string; desc: string; visual: React.ReactNode };

const CARDS: Card[] = [
  {
    title: "One agent for your entire payroll",
    desc: "Manage contracts, contractors and payouts from a single account your agent runs end to end.",
    visual: <VisualWorkspace />,
  },
  {
    title: "Reads every contract, prepares the run",
    desc: "Upload any contract and the agent extracts the terms, calculates bonuses, overtime and caps, then prepares the run.",
    visual: <VisualPrepare />,
  },
  {
    title: "Times the FX, settles on Stellar",
    desc: "The agent watches rates and converts at the best window, settling every salary on Stellar in seconds.",
    visual: <VisualConvert />,
  },
  {
    title: "Pays your team instantly, privately",
    desc: "Batch payouts reach contractors across Africa in local currency, verified with zero-knowledge proofs so amounts stay private.",
    visual: <VisualPayout />,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white px-5 md:px-10" style={{ paddingTop: "96px", paddingBottom: "80px" }}>
      <div className="mx-auto max-w-container">
        <FadeIn>
          <h2 className="mx-auto text-center font-semibold" style={{ fontFamily: DISPLAY, color: INK, maxWidth: "760px", fontSize: "clamp(1.65rem, 3.1vw, 2.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Fund your treasury. Your agent handles the rest.
          </h2>
          <p className="mx-auto mt-4 text-center" style={{ fontSize: "18px", color: MUTED, maxWidth: "560px" }}>
            From reading contracts to paying your team on Stellar, every step runs on its own.
          </p>
        </FadeIn>

        <div className="mx-auto mt-12 grid max-w-[980px] grid-cols-1 gap-6 md:grid-cols-2">
          {CARDS.map((c, i) => (
            <FadeIn key={c.title} delay={(i % 2) * 0.06} className="h-full">
              <div className="flex h-full flex-col" style={{ background: "#F8FAF9", border: "1px solid rgba(14,26,20,0.07)", borderRadius: "22px", padding: "26px" }}>
                <h3 className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: "20px", color: INK, lineHeight: 1.2 }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: "14.5px", color: MUTED, marginTop: "10px", lineHeight: 1.55, maxWidth: "420px" }}>
                  {c.desc}
                </p>
                <div style={{ marginTop: "22px" }}>{c.visual}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <p className="mx-auto mt-10 text-center" style={{ maxWidth: "820px", fontSize: "12px", lineHeight: 1.6, color: "#9CAAA1" }}>
            Disburs settles payroll in USDC on the Stellar network. Local-currency conversion and on/off-ramp
            availability vary by country and are provided through third-party licensed partners where available.
            Disburs does not provide financial, investment or advisory services.
          </p>
          <div className="mt-7 flex justify-center">
            <a
              href="#features"
              className="flex items-center gap-2 font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: INK, color: "#fff", borderRadius: 999, height: 46, padding: "0 24px", fontSize: 15 }}
            >
              Learn more <ArrowRight size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
