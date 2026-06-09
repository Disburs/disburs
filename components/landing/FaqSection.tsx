"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do my contractors need to understand crypto?",
    a: "No. They get a simple link, receive USDC, and convert to naira, KES, GHS, or rand instantly through local partners. No wallets to manage, no jargon.",
  },
  {
    q: "Does Disburs ever hold our money?",
    a: "No. Disburs is non-custodial. Funds move directly from your wallet to your contractors on Stellar. We never take custody of your money.",
  },
  {
    q: "Which countries do you support?",
    a: "Today: Nigeria, Kenya, Ghana, and South Africa, with more across Africa on the way. Contractors convert USDC to local currency through Stellar anchor partners.",
  },
  {
    q: "How fast do payments arrive?",
    a: "Payments settle on Stellar in about 4 seconds, instead of the 3 to 5 days a bank wire takes.",
  },
  {
    q: "What does it actually cost?",
    a: "A flat 0.5% per payroll run plus Stellar's network fee, which is under $0.01 per payment. Compare that to the 2 to 4% Payoneer and Wise charge.",
  },
  {
    q: "What if the exchange rate moves?",
    a: "The agent monitors rates across anchor partners and executes at the best window of the day, so you never pay when it is most expensive.",
  },
  {
    q: "Is it secure?",
    a: "Funds are non-custodial, data is encrypted in transit and at rest, and every agent decision is logged in plain English for a full audit trail.",
  },
  {
    q: "When can we start?",
    a: "Disburs is in private beta. Join the waitlist and the first 20 companies get 3 months free.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>FAQ</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            Questions, answered.
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="mx-auto mt-12" style={{ maxWidth: "760px" }}>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  style={{ borderBottom: "1px solid #E8E8E8" }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                    style={{ padding: "20px 0" }}
                    aria-expanded={isOpen}
                  >
                    <span
                      className="font-medium"
                      style={{ fontSize: "18px", color: "#1A1A1A" }}
                    >
                      {item.q}
                    </span>
                    <span className="shrink-0">
                      {isOpen ? (
                        <Minus size={20} color="#8A8F98" />
                      ) : (
                        <Plus size={20} color="#8A8F98" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          style={{
                            fontSize: "16px",
                            color: "#8A8F98",
                            lineHeight: 1.6,
                            paddingBottom: "20px",
                            maxWidth: "640px",
                          }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
