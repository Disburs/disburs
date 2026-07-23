"use client";

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

function priceFor(plan: Plan): string {
  if (plan.monthly === null) return "Custom";
  return `$${plan.monthly}`;
}

export default function PricingSection() {

  return (
    <section
      id="pricing"
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
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
            Planned pricing at launch. Every plan includes the Disburs agent
            and a 0.5% transaction fee per payroll run. Waitlist companies lock
            these rates.
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
                        key={priceFor(plan)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium"
                        style={{ fontSize: "48px", color: "#1A1A1A", lineHeight: 1 }}
                      >
                        {priceFor(plan)}
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
            All prices in USD and subject to change before launch. A 0.5%
            transaction fee per payroll run applies on all plans.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
