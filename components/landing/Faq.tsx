"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Container, Eyebrow, Heading, Lead } from "./Section";
import Reveal from "./Reveal";

type QA = { q: string; a: string };
type Category = { name: string; items: QA[] };

// FAQ content is unchanged from the previous page.
const CATEGORIES: Category[] = [
  {
    name: "General",
    items: [
      {
        q: "Do my contractors need to understand crypto?",
        a: "No. They get a simple link, receive USDC, and convert to shillings, cedis or rand instantly through local partners. No wallets to manage, no jargon.",
      },
      {
        q: "Which countries do you support?",
        a: "Today: Kenya, Ghana and South Africa, with more on the way. Contractors convert USDC to local currency through Stellar anchor partners.",
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
        q: "Can anyone see our payroll on the blockchain?",
        a: "Stellar is a public network, so records are visible. We are bringing zero-knowledge proofs to Disburs so payroll amounts stay private while the network still verifies every payment is valid.",
      },
      {
        q: "Is it secure?",
        a: "Data is encrypted in transit and at rest, and every agent decision is logged in plain English for a full audit trail.",
      },
    ],
  },
];

export default function Faq() {
  const [cat, setCat] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const items = CATEGORIES[cat].items;

  return (
    <section id="faq" className="border-t border-line bg-surface py-24 md:py-32">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <Eyebrow>FAQ</Eyebrow>
          <Heading className="mt-4">Questions, answered plainly.</Heading>
          <Lead className="mt-5">Everything about how the agent runs, protects and pays out your payroll.</Lead>
        </Reveal>

        <div role="tablist" aria-label="FAQ categories" className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c, i) => {
            const on = i === cat;
            return (
              <button
                key={c.name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setCat(i);
                  setOpen(0);
                }}
                className={`h-10 cursor-pointer rounded-md px-4 text-[14px] font-medium transition-colors duration-150 ${
                  on ? "bg-ink text-white" : "bg-paper text-muted hover:text-ink"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-[760px] divide-y divide-line border-y border-line">
          {items.map((it, i) => {
            const isOpen = open === i;
            const panelId = `faq-${cat}-${i}`;
            return (
              <div key={it.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink md:text-[20px]">
                    {it.q}
                  </span>
                  <Plus
                    size={20}
                    aria-hidden
                    className={`shrink-0 text-faint transition-transform duration-200 ease-out ${
                      isOpen ? "rotate-45 text-accent" : ""
                    }`}
                  />
                </button>
                {/* grid-rows trick: animates height with transform-free, layout-stable motion */}
                <div
                  id={panelId}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[640px] pb-5 text-[15.5px] leading-relaxed text-muted">{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
