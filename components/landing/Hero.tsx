import { Container, Em, Heading, Lead } from "./Section";
import Wordmark from "@/components/Wordmark";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import Dashboard from "./Dashboard";

export default function Hero() {
  return (
    <section id="hero" className="bg-canvas pb-20 pt-[152px] md:pb-28 md:pt-[184px]">
      <Container>
        <Reveal immediate>
          <Heading as="h1" size="xl" className="max-w-[14ch]">
            Global payroll that keeps every salary <Em>private.</Em>
          </Heading>
        </Reveal>
        <Reveal immediate delay={0.1}>
          <Lead className="mt-8 max-w-[38ch]">
            Disburs is autonomous payroll infrastructure. Fund a treasury in USDC, let the agent
            prepare each run, approve it — and every contractor is paid in seconds.
          </Lead>
        </Reveal>
        <Reveal immediate delay={0.18} className="mt-10 flex flex-wrap items-center gap-4">
          <LinkButton href="#waitlist" variant="mint" size="lg">
            Join the waitlist
          </LinkButton>
          <LinkButton href="#how-it-works" variant="outline" size="lg">
            See how it works
          </LinkButton>
        </Reveal>
        <Reveal immediate delay={0.3} className="mt-16 md:mt-24">
          <div className="rounded-tile border border-line bg-subtle p-3 md:p-4">
            <div className="flex items-center justify-between px-3 pb-3 pt-1 md:px-4">
              <span className="text-[15px] font-medium text-ink">The product</span>
              <Wordmark className="text-[15px] font-semibold text-ink" />
            </div>
            <Dashboard />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
