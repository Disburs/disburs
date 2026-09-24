import { Container, Em, Heading, Lead } from "./Section";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import Tiles from "./Tiles";

/** Centered statement on a cream band, with the product in fragments below. */
export default function Statement() {
  return (
    <section id="product" className="bg-cream py-24 md:py-36">
      <Container>
        <Reveal className="mx-auto max-w-[900px] text-center">
          <Heading size="lg" className="mx-auto">
            Payroll, <Em>without</Em> the payroll work.
          </Heading>
          <Lead className="mx-auto mt-8 max-w-[34ch]">
            Private payroll for global teams, run by an agent inside the limits you set — settled in USDC on Stellar.
          </Lead>
          <div className="mt-10">
            <LinkButton href="#waitlist" variant="mint" size="lg">
              Join the waitlist
            </LinkButton>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-16 md:mt-24">
          <Tiles />
        </Reveal>
      </Container>
    </section>
  );
}
