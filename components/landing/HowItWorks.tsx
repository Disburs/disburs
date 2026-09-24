import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";
import LinkButton from "./Button";

const STEPS: [string, string, string][] = [
  ["01", "Fund your treasury", "Top up once in USDC. One balance covers every contractor, in every country."],
  ["02", "The agent prepares the run", "Contracts read, rates applied, exceptions cleared. Every decision written down in plain English."],
  ["03", "You approve. We settle.", "One approval. Every contractor paid in about four seconds, every salary kept private."],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-canvas py-24 md:py-36">
      <Container>
        <Reveal className="on-dark rounded-tile bg-ink-deep p-8 md:p-16 lg:p-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Heading tone="dark" size="lg">
                Three steps to payday.
              </Heading>
              <Lead tone="dark" className="mt-6 max-w-[36ch]">
                From a funded treasury to settled salaries, with one human decision in the middle.
              </Lead>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="#waitlist" variant="mint">
                  Join the waitlist
                </LinkButton>
                <LinkButton href="#pricing" variant="outline-dark">
                  See pricing
                </LinkButton>
              </div>
            </div>
            <ol className="divide-y divide-white/10 border-t border-white/10 lg:border-t-0">
              {STEPS.map(([n, t, d], i) => (
                <Reveal as="li" key={n} delay={0.15 + i * 0.1} className="grid grid-cols-[56px_1fr] gap-4 py-7 first:lg:pt-0">
                  <span className="font-mono text-[14px] text-mint">{n}</span>
                  <div>
                    <h3 className="font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[30px]">{t}</h3>
                    <p className="mt-3 text-[16px] leading-[1.5] text-white/65 md:text-[17px]">{d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
