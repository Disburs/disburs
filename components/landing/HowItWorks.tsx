import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";

const STEPS = [
  {
    n: "1",
    title: "Onboard the team and fund a treasury.",
    body: "Each person gets a custodied payout account — nothing to install, no keys to hold. Your organisation gets a treasury. You fund it in USDC.",
    log: "18 payout accounts activated · treasury funded",
  },
  {
    n: "2",
    title: "The agent drafts the run.",
    body: "It reads every contract, works out who is owed what, picks the FX window and resolves the routine exceptions. What lands on your desk is a finished run, not a spreadsheet.",
    log: "18 contracts read · 1 rate change applied · 2 exceptions resolved",
  },
  {
    n: "3",
    title: "You approve. It pays and reconciles.",
    body: "One approval. Every payment settles on Stellar in about four seconds, each line is matched back to the chain, and the whole run is on record with its transaction references.",
    log: "18/18 settled · avg 3.9s · ledger reconciled",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line bg-surface py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Heading>Three steps. One approval.</Heading>
          <Lead className="mt-5 max-w-[38ch]">
            Everything between &ldquo;payday&rdquo; and &ldquo;paid&rdquo; is the infrastructure&apos;s job.
          </Lead>
        </Reveal>

        <ol className="divide-y divide-line border-y border-line">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.06} className="grid gap-4 py-9 md:grid-cols-[64px_1fr] md:gap-8">
              <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.03em] text-ink/20">
                {s.n}
              </span>
              <div>
                <h3 className="font-display text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink md:text-[24px]">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-muted">{s.body}</p>
                <p className="mt-4 font-mono text-[12px] text-accent">{s.log}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
