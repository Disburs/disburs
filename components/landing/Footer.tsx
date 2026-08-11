"use client";

import { Twitter, Github, Linkedin } from "lucide-react";
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
      { label: "Pricing", href: "#pricing" },
      { label: "Security", href: "#security" },
    ],
  },
  {
    header: "Learn",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "#" },
      { label: "Docs", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    header: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    header: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
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
      className="relative overflow-hidden px-5 md:px-10"
      style={{
        background:
          "radial-gradient(60% 120% at 50% -8%, rgba(18,255,128,0.10) 0%, rgba(18,255,128,0) 46%), #06130D",
        paddingTop: "128px",
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
          {/* Brand */}
          <div>
            <span className="font-medium" style={{ fontSize: "22px", color: "#FFFFFF" }}>
              disburs<span style={{ color: MINT }}>.</span>
            </span>
            <p style={{ fontSize: "14px", color: LINK, marginTop: "12px", maxWidth: 240, lineHeight: 1.5 }}>
              The autonomous payroll agent for global teams.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 md:gap-x-16">
            {COLUMNS.map((col) => (
              <div key={col.header}>
                <h4 className="font-semibold" style={{ fontSize: "15px", color: HEAD, marginBottom: "18px" }}>
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
        <div className="mt-20 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
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
            <span style={{ fontSize: "14px", color: "rgba(233,244,238,0.4)" }}>Built on Stellar · Powered by Claude</span>
          </div>

          <div className="flex items-center gap-5">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="transition-colors" style={{ color: LINK }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
