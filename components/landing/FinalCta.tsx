import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";
import LinkButton from "./Button";

export default function FinalCta() {
  return (
    <section className="on-dark border-t border-white/10 bg-ink-deep py-24 md:py-32">
      <Container className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/45">Private beta</p>
          <Heading tone="dark" className="mt-4 max-w-[16ch]">
            Run your next payroll without the wire.
          </Heading>
        </Reveal>
        <Reveal delay={0.06}>
          <Lead tone="dark" className="max-w-[40ch]">
            The first 20 companies on the waitlist get three months free and lock in launch pricing.
          </Lead>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <LinkButton href="#waitlist" variant="mint" size="lg" arrow>
              Join the waitlist
            </LinkButton>
            <LinkButton href="mailto:hello@disburs.io" variant="ghost-dark" size="lg">
              Talk to us
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
