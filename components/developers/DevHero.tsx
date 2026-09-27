import { Container } from "@/components/landing/Section";
import LinkButton from "@/components/landing/Button";
import Reveal from "@/components/landing/Reveal";
import Console from "./Console";

const TICKER: [string, string][] = [
  ["~4s", "to settle on Stellar"],
  ["<$0.01", "network fee per payout"],
  ["1 call", "to pay a payee"],
  ["PENDING → SETTLED", "every payout, on the ledger"],
  ["0 keys", "your users ever touch"],
  ["0 salaries", "on the public ledger, by proof"],
];

export default function DevHero() {
  return (
    <section id="hero" className="bg-canvas pt-[128px] md:pt-[150px]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-6 lg:pr-6">
            <Reveal immediate>
              <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-accent">Disburs API · private beta</p>
            </Reveal>
            <Reveal immediate delay={0.06}>
              <h1 className="mt-5 font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] text-ink md:text-[64px] lg:text-[72px]">
                Private payroll rails with an <em className="font-medium italic">operator</em> built in.
              </h1>
            </Reveal>
            <Reveal immediate delay={0.12}>
              <p className="mt-7 max-w-[44ch] text-[18px] leading-[1.5] text-muted md:text-[20px]">
                Custodial wallets, USDC payouts on Stellar and a ledger that matches the chain, as a REST
                API. An agent proposes each run inside a policy you set, and zero-knowledge proofs let the
                chain verify every salary without ever learning one. Autonomous and private, without your
                product holding a key or an amount.
              </p>
            </Reveal>
            <Reveal immediate delay={0.18} className="mt-9 flex flex-wrap items-center gap-3">
              <LinkButton href="#waitlist" variant="mint" size="lg">
                Request API access
              </LinkButton>
              <LinkButton href="#quickstart" variant="outline" size="lg">
                Read the quickstart
              </LinkButton>
            </Reveal>
          </div>
          <Reveal immediate delay={0.2} className="min-w-0 lg:col-span-6">
            <Console />
          </Reveal>
        </div>
      </Container>

      {/* Ticker strip: hairlines, mono figures. Different from the landing's stat tiles. */}
      <Reveal immediate delay={0.3} className="mt-16 border-y border-line bg-subtle">
        <Container className="grid grid-cols-2 divide-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {TICKER.map(([v, l], i) => (
            <div key={l} className={`py-5 ${i === 0 ? "lg:pr-6" : "lg:px-6"}`}>
              <div className="font-mono text-[15px] font-medium text-ink">{v}</div>
              <div className="mt-1 text-[13px] text-muted">{l}</div>
            </div>
          ))}
        </Container>
      </Reveal>
    </section>
  );
}
