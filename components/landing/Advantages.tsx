"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Container, Heading } from "./Section";
import Reveal from "./Reveal";

type Row = { title: string; body: string };

const ROWS: Row[] = [
  {
    title: "Settlement in seconds, not days",
    body: "Payments settle on Stellar in about four seconds, instead of the three to five business days a bank wire takes. Your contractors know exactly when payday is.",
  },
  {
    title: "A flat fee you can itemise",
    body: "0.5% per payroll run plus Stellar's network fee, which is under a cent per payment. No FX spread hidden in the rate, no per-payment surcharge.",
  },
  {
    title: "Salaries stay private",
    body: "Amounts are verified by proof, never written to the public ledger. Banks, intermediaries, and anyone with the spreadsheet no longer see what each person earns.",
  },
  {
    title: "Reconciled automatically",
    body: "Every line is matched to its on-chain reference the moment it settles. Nothing to chase after payday, nothing to reconstruct at audit time.",
  },
  {
    title: "The agent proposes. You authorize.",
    body: "Contracts read, rates applied, exceptions cleared, every decision logged in plain English. Your only job on payday is a single approval.",
  },
];

export default function Advantages() {
  const [open, setOpen] = useState(0);
  return (
    <section id="why" className="bg-canvas py-24 md:py-36">
      <Container>
        <Reveal className="max-w-[820px]">
          <Heading size="lg">Why teams switch to Disburs.</Heading>
        </Reveal>
        <div className="mt-12 md:mt-16">
          <ul className="border-t border-line">
            {ROWS.map((r, i) => {
              const on = open === i;
              const id = `adv-${i}`;
              return (
                <Reveal as="li" key={r.title} delay={i * 0.06} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={id}
                    onClick={() => setOpen(on ? -1 : i)}
                    className="group flex w-full cursor-pointer items-center gap-5 py-5 text-left transition-colors duration-200 md:gap-8 md:py-6"
                  >
                    <span className="w-10 shrink-0 font-mono text-[14px] text-muted md:w-16" aria-hidden>
                      0{i + 1}
                    </span>
                    <span className="flex-1 font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink transition-transform duration-300 ease-out group-hover:translate-x-1 md:text-[34px]">
                      {r.title}
                    </span>
                    <Plus
                      size={26}
                      aria-hidden
                      className={`shrink-0 text-ink transition-transform duration-200 ${on ? "rotate-45" : ""}`}
                    />
                  </button>
                  <div id={id} className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="max-w-[62ch] pb-7 pl-[60px] text-[17px] leading-[1.5] text-muted md:pl-[96px] md:text-[19px]">{r.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
