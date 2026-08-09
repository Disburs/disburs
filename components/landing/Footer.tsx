"use client";

import { Twitter, Github, ArrowRight } from "lucide-react";
import { DemoOnly } from "@/components/DemoGate";

const MINT = "#12FF80";
const HEAD = "#FFFFFF";
const LINK = "rgba(233,244,238,0.55)";

type Link = { label: string; href: string };
const COLUMNS: { header: string; links: Link[] }[] = [
  {
    header: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Platform & APIs", href: "#platform" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    header: "Company",
    links: [
      { label: "Contact", href: "mailto:hello@disburs.io" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

function hoverIn(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.color = "#FFFFFF";
}
function hoverOut(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.color = LINK;
}

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden px-6 md:px-12"
      style={{
        background:
          "radial-gradient(60% 120% at 50% -8%, rgba(18,255,128,0.10) 0%, rgba(18,255,128,0) 46%), #06130D",
        paddingTop: "120px",
        paddingBottom: "40px",
      }}
    >
      {/* glowing arc */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0"
        width="100%"
        height="240"
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(18,255,128,0)" />
            <stop offset="50%" stopColor="rgba(18,255,128,0.6)" />
            <stop offset="100%" stopColor="rgba(18,255,128,0)" />
          </linearGradient>
        </defs>
        <path d="M -60 240 Q 600 40 1260 240" fill="none" stroke="url(#arc)" strokeWidth="6" style={{ filter: "blur(9px)", opacity: 0.5 }} />
        <path d="M -60 240 Q 600 40 1260 240" fill="none" stroke="url(#arc)" strokeWidth="1.4" />
      </svg>

      <div className="relative mx-auto max-w-container" style={{ zIndex: 1 }}>
        <div className="flex flex-col gap-14 md:flex-row md:justify-between">
          {/* Brand + CTA */}
          <div style={{ maxWidth: 340 }}>
            <span className="font-medium" style={{ fontSize: "22px", color: "#FFFFFF" }}>
              disburs<span style={{ color: MINT }}>.</span>
            </span>
            <p style={{ fontSize: "15px", color: LINK, marginTop: "12px", lineHeight: 1.55 }}>
              Private, autonomous payroll for teams paying contractors across Africa. Settled on Stellar.
            </p>
            <a
              href="#waitlist"
              className="mt-6 inline-flex items-center gap-2 font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: MINT, color: "#06231A", borderRadius: 999, height: 44, padding: "0 20px", fontSize: 14.5, boxShadow: "0 12px 28px -12px rgba(18,255,128,0.6)" }}
            >
              Join the waitlist <ArrowRight size={16} />
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-14 gap-y-10 sm:gap-x-24">
            {COLUMNS.map((col) => (
              <div key={col.header}>
                <h4 className="font-semibold" style={{ fontSize: "14px", color: HEAD, marginBottom: "16px" }}>
                  {col.header}
                </h4>
                <ul className="flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="transition-colors" style={{ fontSize: "15px", color: LINK }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col items-start justify-between gap-5 border-t sm:flex-row sm:items-center" style={{ borderColor: "rgba(255,255,255,0.08)", paddingTop: "24px" }}>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span style={{ fontSize: "14px", color: "rgba(233,244,238,0.5)" }}>© 2026 Disburs Ltd.</span>
            <DemoOnly>
              <a href="/onboarding" className="transition-colors" style={{ fontSize: "14px", color: MINT }}>
                Employer demo →
              </a>
              <a href="/contractor/onboarding" className="transition-colors" style={{ fontSize: "14px", color: MINT }}>
                Contractor demo →
              </a>
            </DemoOnly>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" aria-label="Disburs on X" className="transition-colors" style={{ color: LINK }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              <Twitter size={19} />
            </a>
            <a href="#" aria-label="Disburs on GitHub" className="transition-colors" style={{ color: LINK }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              <Github size={19} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
