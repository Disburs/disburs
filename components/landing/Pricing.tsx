import { Check } from "lucide-react";
import { Container, Eyebrow, Heading, Lead } from "./Section";
import Reveal from "./Reveal";
import LinkButton from "./Button";

type Plan = {
  name: string;
  price: string;
  tagline: string;
  everythingIn?: string;
  features: string[];
  featured?: boolean;
};

// Plan content is unchanged from the previous page.
const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$29",
    tagline: "For small teams paying up to 10 contractors.",
    features: [
      "Core zero-knowledge privacy",
      "Stellar batch payouts",
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
      "Platform integration APIs",
      "Custom approval workflows",
      "Cash-out in all countries",
      "Zero-knowledge private payroll",
      "Dedicated support",
    ],
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const f = plan.featured;
  return (
    <div
      className={`flex h-full flex-col rounded-card p-7 ${
        f
          ? "border border-ink bg-ink text-white shadow-card-lg"
          : "border border-line bg-surface text-ink shadow-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-[17px] font-semibold">{plan.name}</span>
        {f && (
          <span className="rounded-full bg-mint/15 px-2.5 py-1 text-[11.5px] font-semibold text-mint">
            Most popular
          </span>
        )}
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="tabular font-display text-[44px] font-semibold leading-none tracking-[-0.03em]">
          {plan.price}
        </span>
        <span className={`text-[14px] ${f ? "text-white/50" : "text-faint"}`}>/ month</span>
      </div>
      <p className={`mt-3 text-[14.5px] leading-relaxed ${f ? "text-white/65" : "text-muted"}`}>
        {plan.tagline}
      </p>

      <div className="mt-6">
        <LinkButton href="#waitlist" variant={f ? "mint" : "ghost-light"} className="w-full">
          Join the waitlist
        </LinkButton>
      </div>

      <div className={`my-6 h-px ${f ? "bg-white/10" : "bg-line"}`} />
      <p className={`text-[13.5px] ${f ? "text-white/55" : "text-muted"}`}>
        {plan.everythingIn ? (
          <>
            Everything in <b className={f ? "text-white" : "text-ink"}>{plan.everythingIn}</b>, plus
          </>
        ) : (
          "Everything you need to run payroll"
        )}
      </p>
      <ul className="mt-4 flex-1 space-y-2.5">
        {plan.features.map((x) => (
          <li key={x} className="flex items-start gap-2.5 text-[14.5px]">
            <Check size={16} strokeWidth={2.5} className={`mt-[3px] shrink-0 ${f ? "text-mint" : "text-accent"}`} aria-hidden />
            <span className={f ? "text-white/85" : "text-ink"}>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-paper py-24 md:py-32">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <Eyebrow>Pricing</Eyebrow>
          <Heading className="mt-4">Simple plans. One flat fee per run.</Heading>
          <Lead className="mt-5">
            Every plan includes the autonomous agent, zero-knowledge verification, and a flat 0.5%
            fee per payroll run. Waitlist companies lock these rates.
          </Lead>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-[1040px] gap-4 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-center text-[13.5px] text-faint">
            Prices in USD and subject to change before launch. Need more than Scale?{" "}
            <a href="#waitlist" className="font-semibold text-accent">
              Talk to us about Enterprise
            </a>
            .
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
