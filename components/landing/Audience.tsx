import { Container, Heading } from "./Section";
import Reveal from "./Reveal";
import LinkButton from "./Button";

const SIDES = [
  {
    label: "If you pay people",
    title: "Your whole team, one approved run.",
    points: [
      "One treasury, funded in USDC",
      "Runs drafted from your contracts",
      "Salaries private, every line reconciled",
      "Spending caps and approval gates you set",
    ],
    cta: "Pay my team",
  },
  {
    label: "If you get paid",
    title: "Money that arrives in seconds, in the currency you want.",
    points: [
      "Nothing to install, no crypto to understand",
      "Receive USDC, cash out to local currency",
      "What you earn stays between you and your employer",
      "A clean record of every payment",
    ],
    cta: "Get paid",
  },
];

export default function Audience() {
  return (
    <section className="border-t border-line bg-surface py-24 md:py-32">
      <Container>
        <Reveal className="max-w-[560px]">
          <Heading>Two sides of every payment.</Heading>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-line">
          {SIDES.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className={i === 1 ? "lg:pl-16" : "lg:pr-16"}>
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent">{s.label}</p>
              <h3 className="mt-4 max-w-[22ch] font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[26px]">
                {s.title}
              </h3>
              <ul className="mt-7 divide-y divide-line border-y border-line">
                {s.points.map((p) => (
                  <li key={p} className="py-3 text-[15.5px] text-ink">
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <LinkButton href="#waitlist" variant="ink" arrow>
                  {s.cta}
                </LinkButton>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
