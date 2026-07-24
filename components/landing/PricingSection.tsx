"use client";

import { ArrowRight, Check } from "lucide-react";
import FadeIn from "./FadeIn";

type Plan = {
  name: string;
  monthly: number | null;
  tagline: string;
  features: string[];
  cta: string;
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
  },
];

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        {/* Header (left-aligned, editorial) */}
        <FadeIn>
          <div style={{ maxWidth: "760px" }}>
            <span
              className="mb-5 block uppercase"
              style={{ fontFamily: MONO, fontSize: "12px", letterSpacing: "0.18em", color: "#8A8F98" }}
            >
              Pricing
            </span>
            <h2
              className="font-semibold"
              style={{
                fontSize: "clamp(2.25rem, 6vw, 4.25rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                color: "#1A1A1A",
              }}
            >
              Simple, transparent
              <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px #1A1A1A",
                }}
              >
                pricing
              </span>
              <span style={{ color: "#12FF80" }}>.</span>
            </h2>
            <p style={{ fontSize: "18px", color: "#8A8F98", marginTop: "20px", maxWidth: "560px", lineHeight: 1.6 }}>
              Planned pricing at launch. Every plan includes the Disburs agent
              and a 0.5% fee per payroll run, versus the 2–4% Payoneer and Wise
              take. Waitlist companies lock these rates.
            </p>
          </div>
        </FadeIn>

        {/* Connected hairline-grid cards */}
        <FadeIn>
          <div
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            style={{ gap: "1px", background: "#E8E8E8", border: "1px solid #E8E8E8" }}
          >
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className="relative flex flex-col"
                style={{
                  background: "#FFFFFF",
                  padding: "40px 32px",
                  border: plan.featured ? "2px solid #12FF80" : "2px solid transparent",
                  zIndex: plan.featured ? 1 : 0,
                }}
              >
                {plan.featured && (
                  <span
                    className="absolute uppercase"
                    style={{
                      top: "-11px",
                      left: "32px",
                      fontFamily: MONO,
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      background: "#12FF80",
                      color: "#0A2E12",
                      padding: "4px 10px",
                    }}
                  >
                    Most Popular
                  </span>
                )}

                {/* Plan header */}
                <span style={{ fontFamily: MONO, fontSize: "12px", color: "#B4B9C2" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold" style={{ fontSize: "28px", color: "#1A1A1A", marginTop: "8px", letterSpacing: "-0.02em" }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: "13.5px", color: "#8A8F98", marginTop: "8px", lineHeight: 1.5 }}>
                  {plan.tagline}
                </p>

                {/* Price */}
                <div style={{ margin: "28px 0", paddingBottom: "28px", borderBottom: "1px solid #E8E8E8" }}>
                  {plan.monthly !== null ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold" style={{ fontSize: "48px", color: "#1A1A1A", lineHeight: 1, letterSpacing: "-0.03em" }}>
                        ${plan.monthly}
                      </span>
                      <span style={{ fontSize: "15px", color: "#8A8F98" }}>/month</span>
                    </div>
                  ) : (
                    <span className="font-semibold" style={{ fontSize: "40px", color: "#1A1A1A", letterSpacing: "-0.02em" }}>
                      Custom
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-1 flex-col gap-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={15} color="#12FF80" strokeWidth={3} className="mt-0.5 shrink-0" />
                      <span style={{ fontSize: "14px", color: "#5C6068", lineHeight: 1.45 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#waitlist"
                  className="group mt-9 flex w-full items-center justify-center gap-2 font-medium transition-all"
                  style={{
                    height: "50px",
                    fontSize: "14.5px",
                    background: plan.featured ? "#12FF80" : "transparent",
                    color: "#1A1A1A",
                    border: plan.featured ? "1px solid #12FF80" : "1px solid #D7DADF",
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.featured) e.currentTarget.style.borderColor = "#1A1A1A";
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.featured) e.currentTarget.style.borderColor = "#D7DADF";
                  }}
                >
                  {plan.cta}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Bottom note */}
        <FadeIn>
          <p style={{ fontSize: "14px", color: "#8A8F98", marginTop: "28px" }}>
            All prices in USD and subject to change before launch. A 0.5%
            transaction fee per payroll run applies on all plans.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
