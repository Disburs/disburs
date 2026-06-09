"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

type Plan = {
  name: string;
  monthly: number | null;
  tagline: string;
  features: string[];
  cta: string;
  ctaPrimary: boolean;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    monthly: 29,
    tagline: "For small teams up to 10 contractors",
    features: [
      "AI payroll agent",
      "Stellar batch payments",
      "2-country offramp",
      "Email support",
      "Basic reporting",
    ],
    cta: "Join the Waitlist",
    ctaPrimary: true,
  },
  {
    name: "Growth",
    monthly: 79,
    tagline: "For growing teams of 11–50 contractors",
    features: [
      "Everything in Starter",
      "Contract reading & interpretation",
      "Autonomous dispute resolution",
      "FX rate optimization",
      "4-country offramp",
      "Priority support",
    ],
    cta: "Join the Waitlist",
    ctaPrimary: true,
    featured: true,
  },
  {
    name: "Scale",
    monthly: 149,
    tagline: "For teams of 50+ contractors",
    features: [
      "Everything in Growth",
      "Agent-to-agent payment APIs",
      "Custom approval workflows",
      "All countries",
      "Dedicated support",
    ],
    cta: "Join the Waitlist",
    ctaPrimary: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    tagline: "For large organizations",
    features: [
      "Custom SLA",
      "White-label options",
      "Full API access",
      "Onboarding support",
      "Compliance consulting",
    ],
    cta: "Contact Us",
    ctaPrimary: false,
  },
];

function priceFor(plan: Plan, annual: boolean): string {
  if (plan.monthly === null) return "Custom";
  const value = annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
  return `$${value}`;
}

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>Pricing</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            Simple, transparent pricing.
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "560px" }}
          >
            Every plan includes the Disburs AI agent. 0.5% transaction fee on all
            payroll runs.
          </p>

          {/* Savings callout */}
          <div
            className="mx-auto mt-6 flex w-fit items-center gap-2 text-center"
            style={{
              background: "#DEF6E9",
              borderRadius: "20px",
              padding: "8px 16px",
            }}
          >
            <span
              className="font-medium"
              style={{ fontSize: "14px", color: "#0A9200", lineHeight: 1.4 }}
            >
              Just 0.5% per run vs. the 2–4% Payoneer &amp; Wise take. Up to 8×
              cheaper.
            </span>
          </div>

          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              style={{
                fontSize: "14px",
                color: !annual ? "#1A1A1A" : "#8A8F98",
                fontWeight: !annual ? 500 : 400,
              }}
            >
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={annual}
              aria-label="Toggle annual billing"
              onClick={() => setAnnual((a) => !a)}
              className="relative transition-colors"
              style={{
                width: "48px",
                height: "28px",
                borderRadius: "9999px",
                background: annual ? "#12FF80" : "#E8E8E8",
                padding: "2px",
              }}
            >
              <motion.span
                className="block rounded-full bg-white"
                style={{ width: "24px", height: "24px" }}
                animate={{ x: annual ? 20 : 0 }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              />
            </button>
            <span
              style={{
                fontSize: "14px",
                color: annual ? "#1A1A1A" : "#8A8F98",
                fontWeight: annual ? 500 : 400,
              }}
            >
              Annual
            </span>
            <span
              className="font-medium"
              style={{
                background: "#DEF6E9",
                color: "#0A9200",
                borderRadius: "4px",
                padding: "2px 8px",
                fontSize: "12px",
              }}
            >
              Save 20%
            </span>
          </div>
        </FadeIn>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.name} delay={(i % 4) * 0.05}>
              <div className="relative h-full">
                {plan.featured && (
                  <span
                    className="absolute left-1/2 font-medium"
                    style={{
                      top: "-12px",
                      transform: "translateX(-50%)",
                      background: "#12FF80",
                      color: "#1A1A1A",
                      borderRadius: "4px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </span>
                )}
                <div
                  className="flex h-full flex-col"
                  style={{
                    borderRadius: "20px",
                    border: plan.featured
                      ? "2px solid #12FF80"
                      : "2px solid #E8E8E8",
                    background: "#FFFFFF",
                    padding: "40px",
                  }}
                >
                  <span
                    className="font-medium uppercase"
                    style={{
                      fontSize: "14px",
                      color: "#8A8F98",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {plan.name}
                  </span>

                  <div className="mt-3 flex items-end gap-1">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={priceFor(plan, annual)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium"
                        style={{ fontSize: "48px", color: "#1A1A1A", lineHeight: 1 }}
                      >
                        {priceFor(plan, annual)}
                      </motion.span>
                    </AnimatePresence>
                    {plan.monthly !== null && (
                      <span style={{ fontSize: "16px", color: "#8A8F98" }}>
                        /month
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: "14px", color: "#8A8F98", marginTop: "12px" }}>
                    {plan.tagline}
                  </p>

                  <div
                    style={{ borderTop: "1px solid #E8E8E8", margin: "24px 0" }}
                  />

                  <ul className="flex flex-1 flex-col gap-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1 shrink-0">
                          <Check size={16} color="#12FF80" strokeWidth={3} />
                        </span>
                        <span style={{ fontSize: "14px", color: "#1A1A1A" }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#waitlist"
                    className="mt-8 flex items-center justify-center font-medium transition-transform hover:scale-[1.02]"
                    style={{
                      height: "48px",
                      padding: "12px 24px",
                      borderRadius: "4px",
                      fontSize: "16px",
                      background: plan.ctaPrimary ? "#12FF80" : "transparent",
                      color: "#1A1A1A",
                      border: plan.ctaPrimary ? "none" : "1px solid #E8E8E8",
                      boxShadow: plan.ctaPrimary
                        ? "rgba(0,0,0,0.06) 0px 4px 4px 0px"
                        : "none",
                    }}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Fine print */}
        <FadeIn>
          <p
            className="mx-auto mt-12 text-center"
            style={{ fontSize: "16px", color: "#8A8F98", maxWidth: "640px" }}
          >
            All prices in USD. 0.5% transaction fee per payroll run applies on all
            plans. Annual billing available at 20% discount.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
