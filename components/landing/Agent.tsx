import Image from "next/image";
import { Check } from "lucide-react";
import { Container, Heading, Lead } from "./Section";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import { MockButton } from "./mock";

const LOG: [string, string][] = [
  ["09:02:11", "18 contracts reviewed"],
  ["09:02:40", "1 FX rate updated · 1 USDC = 15.42 GHS"],
  ["09:03:05", "2 exceptions resolved"],
  ["09:03:07", "18 payroll lines prepared"],
];

export default function Agent() {
  return (
    <section id="agent" className="bg-canvas py-24 md:py-36">
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading size="lg">Payroll, prepared for you.</Heading>
          <div>
            <Lead className="max-w-[40ch]">
              The agent reads the contracts, applies rate changes, picks the FX window and clears the
              routine exceptions. Every decision is written down in plain English. Nothing moves
              until you approve it.
            </Lead>
            <div className="mt-8">
              <LinkButton href="#waitlist" variant="ink">
                Join the waitlist
              </LinkButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 md:mt-20">
          <div className="on-dark grid overflow-hidden rounded-tile border border-line bg-ink-deep lg:grid-cols-2">
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-white">Agent activity · March payroll</span>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
                  Awaiting approval
                </span>
              </div>
              <ol className="mt-5 divide-y divide-white/10 border-y border-white/10">
                {LOG.map(([t, msg]) => (
                  <li key={msg} className="flex items-center gap-3 py-4">
                    <Check size={16} strokeWidth={2.5} className="shrink-0 text-mint" aria-hidden />
                    <span className="flex-1 text-[15px] text-white">{msg}</span>
                    <span className="tabular font-mono text-[12px] text-white/50">{t}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[14px] text-white/60">Nothing moves until you approve.</span>
                <MockButton tone="mint">Approve payroll</MockButton>
              </div>
            </div>
            <div className="group flex items-center justify-center bg-cream p-10 md:p-16">
              <Image
                src="/illustrations/agent.svg"
                alt="The Disburs agent reading contracts and preparing a payroll run"
                width={800}
                height={714}
                className="h-auto w-full max-w-[380px] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
