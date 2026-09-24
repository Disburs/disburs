import { Check, Lock } from "lucide-react";
import { Container, Em, Heading, Lead } from "./Section";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import { Avatar, Kicker, Pill, TEAM } from "./mock";

/** Four tilted tiles: the product, in fragments. */
function Tiles() {
  const tile = "aspect-square w-full overflow-hidden rounded-tile";
  return (
    <div className="mt-16 grid grid-cols-2 gap-4 md:mt-24 md:grid-cols-4 md:gap-6" aria-hidden>
      {/* 1 — protected amount, on dark */}
      <div className={`${tile} flex flex-col justify-between bg-ink-deep p-6 md:-rotate-6 md:p-8`}>
        <span className="text-[13px] text-white/50">Salary</span>
        <div>
          <div className="flex items-center gap-3 text-white">
            <Lock size={26} className="text-mint" />
            <span className="font-mono text-[28px] tracking-[0.04em] md:text-[34px]">••••••</span>
          </div>
          <div className="mt-2 text-[14px] text-white/55">Verified by proof. Never revealed.</div>
        </div>
      </div>
      {/* 2 — approve, on mint */}
      <div className={`${tile} flex items-center justify-center bg-mint p-6 md:rotate-3`}>
        <span className="inline-flex h-14 items-center gap-3 rounded-full bg-canvas px-6 text-[18px] font-medium text-ink md:text-[22px]">
          <Check size={22} strokeWidth={2.5} className="text-accent" />
          Approve payroll
        </span>
      </div>
      {/* 3 — payees paid, on dark */}
      <div className={`${tile} flex flex-col justify-center gap-3 bg-ink-deep p-6 md:-rotate-3 md:p-8`}>
        {TEAM.slice(0, 3).map((m) => (
          <div key={m.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar m={m} size={40} />
              <span className="hidden text-[14px] text-white md:block">{m.name.split(" ")[0]}</span>
            </div>
            <span className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-canvas px-3 text-[13px] font-medium text-ink md:h-10 md:px-4 md:text-[15px]">
              Paid <span className="ml-1 hidden md:inline">· 4s</span>
            </span>
          </div>
        ))}
      </div>
      {/* 4 — run card, on subtle */}
      <div className={`${tile} flex flex-col justify-between border border-line bg-subtle p-6 md:rotate-6 md:p-8`}>
        <div>
          <Kicker>March payroll</Kicker>
          <div className="tabular mt-2 text-[32px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[40px]">$12,840</div>
          <div className="mt-2 text-[14px] text-muted">18 contractors · 3 countries</div>
        </div>
        <Pill tone="accent">Ready for approval</Pill>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="bg-canvas pb-20 pt-[152px] md:pb-28 md:pt-[184px]">
      <Container>
        <Reveal immediate>
          <Heading as="h1" size="xl" className="max-w-[14ch]">
            Global payroll that keeps every salary <Em>private.</Em>
          </Heading>
        </Reveal>
        <Reveal immediate delay={0.08}>
          <Lead className="mt-8 max-w-[38ch]">
            Disburs is autonomous payroll infrastructure. Fund a treasury in USDC, let the agent
            prepare each run, approve it — and every contractor is paid in seconds.
          </Lead>
        </Reveal>
        <Reveal immediate delay={0.14} className="mt-10 flex flex-wrap items-center gap-4">
          <LinkButton href="#waitlist" variant="mint" size="lg">
            Join the waitlist
          </LinkButton>
          <LinkButton href="#how-it-works" variant="outline" size="lg">
            See how it works
          </LinkButton>
        </Reveal>
        <Reveal immediate delay={0.22}>
          <Tiles />
        </Reveal>
      </Container>
    </section>
  );
}
