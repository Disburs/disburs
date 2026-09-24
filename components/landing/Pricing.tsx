import { Check } from "lucide-react";
import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";
import LinkButton from "./Button";

type Plan = { name: string; price: string; tagline: string; everythingIn?: string; features: string[]; featured?: boolean };

// Plan content is unchanged.
const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$29",
    tagline: "For small teams paying up to 10 contractors.",
    features: ["Core zero-knowledge privacy", "Stellar batch payouts", "Cash-out in 2 countries", "Basic reporting", "Email support"],
  },
  {
    name: "Growth",
    price: "$79",
    tagline: "For growing teams of 11 to 50 contractors.",
    everythingIn: "Starter",
    featured: true,
    features: ["Contract reading & interpretation", "Autonomous dispute resolution", "FX rate optimization", "Cash-out in 4 countries", "Priority support"],
  },
  {
    name: "Scale",
    price: "$149",
    tagline: "For teams paying 50+ contractors.",
    everythingIn: "Growth",
    features: ["Platform integration APIs", "Custom approval workflows", "Cash-out in all countries", "Zero-knowledge private payroll", "Dedicated support"],
  },
];

function Card({ plan }: { plan: Plan }) {
  const f = plan.featured;
  return (
    <div className={`flex flex-col rounded-tile p-8 md:p-10 ${f ? "on-dark bg-ink-deep text-white" : "bg-subtle text-ink"}`}>
      <div className="flex items-center justify-between">
        <span className="text-[17px] font-medium">{plan.name}</span>
        {f && <span className="text-[14px] text-mint">Most popular</span>}
      </div>
      <div className="mt-8 flex items-baseline gap-2">
        <span className="tabular font-display text-[56px] font-semibold leading-none tracking-[-0.03em]">{plan.price}</span>
        <span className={`text-[15px] ${f ? "text-white/55" : "text-muted"}`}>/ month</span>
      </div>
      <p className={`mt-4 text-[15.5px] leading-[1.5] ${f ? "text-white/65" : "text-muted"}`}>{plan.tagline}</p>
      <div className="mt-8">
        <LinkButton href="#waitlist" variant={f ? "mint" : "ink"} className="w-full">
          Join the waitlist
        </LinkButton>
      </div>
      <div className={`my-8 h-px ${f ? "bg-white/10" : "bg-line"}`} />
      <p className={`text-[13.5px] ${f ? "text-white/55" : "text-muted"}`}>
        {plan.everythingIn ? (
          <>
            Everything in <b className={f ? "text-white" : "text-ink"}>{plan.everythingIn}</b>, plus
          </>
        ) : (
          "Everything you need to run payroll"
        )}
      </p>
      <ul className="mt-4 space-y-3">
        {plan.features.map((x) => (
          <li key={x} className="flex items-start gap-2.5 text-[15px]">
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
    <section id="pricing" className="bg-canvas py-24 md:py-36">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading size="lg">
            Simple plans. One flat fee.
          </Heading>
          <Lead className="max-w-[40ch]">
            Every plan includes the autonomous agent, zero-knowledge verification, and a flat 0.5%
            fee per payroll run. Waitlist companies lock these rates.
          </Lead>
        </Reveal>
        <Reveal delay={0.06} className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-3 lg:gap-6">
          {PLANS.map((p) => (
            <Card key={p.name} plan={p} />
          ))}
        </Reveal>
        <Reveal>
          <p className="mt-10 text-[15px] text-muted">
            Prices in USD and subject to change before launch. Need more than Scale?{" "}
            <a href="#waitlist" className="font-medium text-accent">
              Talk to us about Enterprise
            </a>
            .
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
