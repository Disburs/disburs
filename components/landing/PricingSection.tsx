"use client";

import { CheckCircle2 } from "lucide-react";
import FadeIn from "./FadeIn";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const FAINT = "#8A9B90";
const DEEP = "#0A9200";
const LINE = "#E7ECE8";

type Plan = {
  name: string;
  price: string;
  tagline: string;
  everythingIn?: string;
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$29",
    tagline: "For small teams paying up to 10 contractors.",
    features: [
      "Access to the payroll agent",
      "Stellar batch payments",
      "Cash-out in 2 countries",
      "Basic reporting",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$79",
    tagline: "For growing teams of 11 to 50 contractors.",
    everythingIn: "Starter",
    featured: true,
    features: [
      "Contract reading & interpretation",
      "Autonomous dispute resolution",
      "FX rate optimization",
      "Cash-out in 4 countries",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: "$149",
    tagline: "For teams paying 50+ contractors.",
    everythingIn: "Growth",
    features: [
      "Agent-to-agent payment APIs",
      "Custom approval workflows",
      "Cash-out in all countries",
      "Zero-knowledge private payroll",
      "Dedicated support",
    ],
  },
];

function Star({ top, right, size, o }: { top: number; right: number; size: number; o: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ position: "absolute", top, right, opacity: o, filter: "drop-shadow(0 0 3px rgba(18,255,128,0.6))" }}
    >
      <path d="M12 0c.8 6.7 4.5 10.4 12 12-7.5 1.6-11.2 5.3-12 12-.8-6.7-4.5-10.4-12-12C7.5 10.4 11.2 6.7 12 0Z" fill="#FFFFFF" />
    </svg>
  );
}

function Card({ plan }: { plan: Plan }) {
  const featured = plan.featured;
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        border: `1px solid ${featured ? "#DBF3E5" : LINE}`,
        boxShadow: featured
          ? "0 44px 90px -44px rgba(14,26,20,0.45)"
          : "0 26px 60px -40px rgba(14,26,20,0.28)",
        padding: "30px 30px 34px",
      }}
    >
      {/* soft aurora wash + delicate stars on the featured card */}
      {featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 210,
            background:
              "radial-gradient(120% 130% at 82% -20%, rgba(18,255,128,0.20) 0%, rgba(18,255,128,0) 56%), radial-gradient(90% 90% at 52% -30%, rgba(11,199,94,0.10) 0%, rgba(255,255,255,0) 60%)",
            maskImage: "linear-gradient(#000 0%, #000 52%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(#000 0%, #000 52%, transparent 100%)",
          }}
        >
          <Star top={20} right={30} size={13} o={0.85} />
          <Star top={46} right={66} size={8} o={0.65} />
          <Star top={38} right={18} size={6} o={0.8} />
          <Star top={70} right={42} size={6} o={0.5} />
          <Star top={14} right={74} size={5} o={0.5} />
        </div>
      )}

      {/* header */}
      <div className="relative flex items-center gap-2.5">
        <span className="font-semibold" style={{ fontSize: 17, color: INK }}>
          {plan.name} plan
        </span>
        {featured && (
          <span className="font-semibold" style={{ fontSize: 12, color: DEEP, background: "#DEF6E9", borderRadius: 999, padding: "3px 10px" }}>
            Popular
          </span>
        )}
      </div>

      {/* price */}
      <div className="relative mt-4 flex items-baseline gap-2">
        <span className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 48, color: INK, lineHeight: 1, letterSpacing: "-0.03em" }}>
          {plan.price}
        </span>
        <span style={{ fontSize: 15, color: FAINT }}>per month</span>
      </div>
      <p className="relative mt-4" style={{ fontSize: 15, color: MUT, lineHeight: 1.5 }}>
        {plan.tagline}
      </p>

      {/* CTA */}
      <a
        href="#waitlist"
        className="relative mt-6 flex w-full items-center justify-center font-semibold transition-transform hover:scale-[1.01]"
        style={{
          height: 50,
          borderRadius: 11,
          fontSize: 15,
          background: featured ? "linear-gradient(135deg, #2BFF93 0%, #0AC765 100%)" : "#F4F6F4",
          color: featured ? "#06231A" : INK,
          boxShadow: featured ? "0 14px 30px -12px rgba(18,255,128,0.6)" : "none",
        }}
      >
        Join the waitlist
      </a>

      {/* features */}
      <div style={{ borderTop: `1px solid ${LINE}`, margin: "28px 0 20px" }} />
      <span className="font-semibold uppercase" style={{ fontSize: 11.5, letterSpacing: "0.12em", color: FAINT }}>
        Features
      </span>
      <p style={{ fontSize: 14, color: MUT, marginTop: 10, marginBottom: 18 }}>
        {plan.everythingIn ? (
          <>
            Everything in <b style={{ color: INK }}>{plan.everythingIn}</b> plus….
          </>
        ) : (
          <>Everything you need to run payroll:</>
        )}
      </p>
      <ul className="flex flex-1 flex-col gap-3.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <CheckCircle2 size={20} color={DEEP} className="mt-0.5 shrink-0" strokeWidth={2} />
            <span style={{ fontSize: 14.5, color: MUT, lineHeight: 1.45 }}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-white px-6 md:px-12" style={{ paddingTop: "96px", paddingBottom: "104px" }}>
      <div className="mx-auto max-w-container">
        <FadeIn>
          <span className="block text-center font-semibold uppercase" style={{ color: DEEP, fontSize: 13, letterSpacing: "0.12em" }}>
            Pricing
          </span>
          <h2 className="mx-auto mt-4 text-center font-semibold" style={{ fontFamily: DISPLAY, color: INK, maxWidth: 720, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            A plan for every team
          </h2>
          <p className="mx-auto mt-5 text-center" style={{ color: MUT, fontSize: 18, maxWidth: 560, lineHeight: 1.55 }}>
            Every plan includes the Disburs agent and a flat 0.5% fee per payroll run. Waitlist companies lock these rates.
          </p>
        </FadeIn>

        <div className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <FadeIn key={plan.name} delay={plan.featured ? 0 : 0.06} className={plan.featured ? "lg:-translate-y-4" : ""}>
              <Card plan={plan} />
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <p className="mt-10 text-center" style={{ fontSize: 14, color: FAINT }}>
            Prices in USD and subject to change before launch. Need more than Scale?{" "}
            <a href="#waitlist" style={{ color: DEEP, fontWeight: 600 }}>
              Talk to us about Enterprise
            </a>
            .
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
