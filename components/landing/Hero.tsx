import Image from "next/image";
import { Check, Lock } from "lucide-react";
import { Container, Heading, Lead } from "./Section";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import { PEOPLE } from "./people";

/**
 * The one product moment in the hero: a payroll run the agent has drafted,
 * with every amount shielded. Decorative — not an interactive control.
 */
function PayrollRun() {
  return (
    <div
      aria-label="Example payroll run with salary amounts hidden"
      className="rounded-card border border-white/12 bg-[#0D1913] shadow-card-lg"
    >
      <div className="flex items-start justify-between border-b border-white/[0.08] px-5 py-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">Run · March 2026</div>
          <div className="mt-1 font-display text-[17px] font-semibold text-white">18 contractors · 3 countries</div>
        </div>
        <span className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] text-mint">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
          ready for approval
        </span>
      </div>

      <ul>
        {PEOPLE.map((r, i) => (
          <Reveal
            as="li"
            key={r.name}
            immediate
            delay={0.3 + i * 0.06}
            className="flex items-center gap-3.5 border-b border-white/[0.06] px-5 py-3.5"
          >
            <Image src={r.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] text-white">{r.name}</div>
              <div className="font-mono text-[11.5px] text-white/40">{r.place}</div>
            </div>
            <span className="tabular inline-flex items-center gap-1.5 font-mono text-[12.5px] text-white/70">
              <Lock size={11} className="text-mint" aria-hidden />
              <span aria-label="amount hidden">••••••.••</span>
              <span className="text-white/35">USDC</span>
            </span>
            <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-mint/15 text-mint" aria-label="verified">
              <Check size={11} strokeWidth={3} />
            </span>
          </Reveal>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="font-mono text-[11.5px] leading-relaxed text-white/40">
          drafted 09:03 · 2 exceptions resolved · 0 need you
        </div>
        <span className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-md bg-mint px-3.5 text-[13.5px] font-medium text-ink-deep">
          Approve run
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="on-dark bg-ink-deep pb-20 pt-[140px] md:pb-28 md:pt-[168px]">
      <Container className="grid items-end gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal immediate>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/45">
              Private beta — settles on Stellar, paid in USDC
            </p>
          </Reveal>
          <Reveal immediate delay={0.06}>
            <Heading as="h1" tone="dark" size="lg" className="mt-6 max-w-[13ch]">
              Global payroll that keeps every salary private.
            </Heading>
          </Reveal>
          <Reveal immediate delay={0.12}>
            <Lead tone="dark" className="mt-6 max-w-[52ch]">
              Disburs is autonomous payroll infrastructure. It pays your contractors across
              borders in seconds, runs the compliance workflow end to end, and keeps amounts off
              the public ledger — proven correct with zero-knowledge proofs.
            </Lead>
          </Reveal>
          <Reveal immediate delay={0.18} className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href="#waitlist" variant="mint" size="lg" arrow>
              Join the waitlist
            </LinkButton>
            <LinkButton href="#how-it-works" variant="ghost-dark" size="lg">
              How it works
            </LinkButton>
          </Reveal>
          <Reveal immediate delay={0.24}>
            <p className="mt-10 max-w-[52ch] border-t border-white/10 pt-5 font-mono text-[12.5px] leading-relaxed text-white/45">
              ~4s to settle · under $0.01 network fee per payment · 0.5% flat per run · Kenya,
              Ghana, South Africa today
            </p>
          </Reveal>
        </div>

        <Reveal immediate delay={0.16}>
          <PayrollRun />
        </Reveal>
      </Container>
    </section>
  );
}
