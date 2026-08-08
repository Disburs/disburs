"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import FadeIn from "./FadeIn";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const FAINT = "#8FA398";
const DEEP = "#0A9200";
const LINE = "#E7ECE8";

type QA = { q: string; a: string };
type Category = { name: string; items: QA[] };

const CATEGORIES: Category[] = [
  {
    name: "General",
    items: [
      {
        q: "Do my contractors need to understand crypto?",
        a: "No. They get a simple link, receive USDC, and convert to naira, KES, GHS or rand instantly through local partners. No wallets to manage, no jargon.",
      },
      {
        q: "Which countries do you support?",
        a: "Today: Nigeria, Kenya, Ghana and South Africa, with more on the way. Contractors convert USDC to local currency through Stellar anchor partners.",
      },
      {
        q: "When can we start?",
        a: "Disburs is in private beta. Join the waitlist and the first 20 companies get three months free.",
      },
    ],
  },
  {
    name: "Payments",
    items: [
      {
        q: "How fast do payments arrive?",
        a: "Payments settle on Stellar in about four seconds, instead of the three to five days a bank wire takes.",
      },
      {
        q: "What does it actually cost?",
        a: "A flat 0.5% per payroll run plus Stellar's network fee, which is under $0.01 per payment. Compare that to the 2 to 4% Payoneer and Wise charge.",
      },
      {
        q: "What if the exchange rate moves?",
        a: "The agent monitors rates across anchor partners and executes at the best window of the day, so you never pay when it is most expensive.",
      },
    ],
  },
  {
    name: "Privacy & security",
    items: [
      {
        q: "Does Disburs ever hold our money?",
        a: "No. Disburs is non-custodial. Funds move directly from your wallet to your contractors on Stellar. We never take custody of your money.",
      },
      {
        q: "Can anyone see our payroll on the blockchain?",
        a: "Stellar is a public network, so records are visible. We are bringing zero-knowledge proofs to Disburs so payroll amounts stay private while the network still verifies every payment is valid.",
      },
      {
        q: "Is it secure?",
        a: "Funds are non-custodial, data is encrypted in transit and at rest, and every agent decision is logged in plain English for a full audit trail.",
      },
    ],
  },
];

export default function FaqSection() {
  const [cat, setCat] = useState(0);
  const [open, setOpen] = useState(0);

  const items = CATEGORIES[cat].items;

  return (
    <section id="faq" className="bg-white px-6 md:px-12" style={{ paddingTop: "96px", paddingBottom: "100px" }}>
      <div className="mx-auto max-w-container">
        {/* Centered header, matching the other sections */}
        <FadeIn>
          <h2 className="mx-auto text-center font-semibold" style={{ fontFamily: DISPLAY, color: INK, maxWidth: 720, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Have a question?
          </h2>
          <p className="mx-auto mt-5 text-center" style={{ color: MUT, fontSize: 18, maxWidth: 560, lineHeight: 1.55 }}>
            Everything about how the agent runs, protects and pays out your payroll.
          </p>
        </FadeIn>

        {/* Centered category tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c, i) => {
            const on = i === cat;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setCat(i);
                  setOpen(0);
                }}
                className="font-semibold transition-colors"
                style={{
                  fontSize: 15,
                  color: on ? "#FFFFFF" : "#5B6B62",
                  background: on ? INK : "#F4F6F4",
                  borderRadius: 999,
                  padding: "11px 24px",
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Accordion */}
        <div className="mx-auto mt-12" style={{ maxWidth: 820 }}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} style={{ borderBottom: `1px solid ${LINE}` }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 text-left"
                  style={{ padding: "22px 0" }}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: "clamp(18px, 1.9vw, 22px)", color: INK, lineHeight: 1.2 }}>
                    {item.q}
                  </span>
                  <span className="shrink-0" style={{ color: isOpen ? DEEP : FAINT }}>
                    {isOpen ? <X size={23} /> : <Plus size={23} />}
                  </span>
                </button>
                <div style={{ maxHeight: isOpen ? 260 : 0, overflow: "hidden", transition: "max-height .38s ease" }}>
                  <p style={{ fontSize: 16, color: MUT, lineHeight: 1.65, paddingBottom: 22, maxWidth: 680 }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
