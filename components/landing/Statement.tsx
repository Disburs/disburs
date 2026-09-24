import { Check } from "lucide-react";
import { Container, Em, Heading, Lead } from "./Section";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import { Frame, Kicker, MockButton, Panel, Pill, Verified } from "./mock";

const NAV = ["Dashboard", "Payroll", "Contractors", "Treasury", "Settings"];
const ACTIVITY: [string, string][] = [
  ["09:02", "18 contracts reviewed"],
  ["09:03", "1 FX rate updated"],
  ["09:03", "2 exceptions resolved"],
  ["09:03", "18 payroll lines prepared"],
];

function Dashboard() {
  return (
    <Frame active="Payroll" label="Disburs dashboard: treasury, the upcoming March payroll, recent runs and agent activity">
      <div className="grid min-w-0 lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-line bg-subtle p-4 lg:flex lg:flex-col" aria-hidden>
          <ul className="space-y-0.5">
            {NAV.map((n, i) => (
              <li key={n} className={`rounded-full px-4 py-2 text-[14px] ${i === 0 ? "bg-canvas font-medium text-ink" : "text-muted"}`}>
                {n}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <Panel className="bg-canvas">
              <Kicker>Treasury</Kicker>
              <div className="tabular mt-1.5 text-[22px] font-semibold text-ink">$24,600</div>
              <div className="mt-0.5 text-[12px] text-muted">USDC</div>
            </Panel>
          </div>
        </aside>
        <div className="min-w-0 p-5 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Kicker>Dashboard</Kicker>
              <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em] text-ink">Here&apos;s where payroll stands.</h3>
            </div>
            <MockButton tone="ghost">Talk to the agent</MockButton>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Panel>
              <Kicker>Treasury</Kicker>
              <div className="tabular mt-2 text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">$24,600</div>
              <div className="mt-2 text-[12.5px] text-muted">USDC · covers the next two runs</div>
            </Panel>
            <Panel>
              <Kicker>Upcoming payroll</Kicker>
              <div className="tabular mt-2 text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">$12,840</div>
              <div className="mt-2 text-[12.5px] text-muted">March · 18 contractors</div>
            </Panel>
            <Panel className="flex flex-col">
              <Kicker>Approval</Kicker>
              <div className="mt-2 text-[15px] font-medium text-ink">Awaiting your approval</div>
              <div className="mt-1 text-[12.5px] text-muted">18/18 lines protected and verified</div>
              <div className="mt-auto pt-4">
                <MockButton tone="mint">Approve payroll</MockButton>
              </div>
            </Panel>
          </div>
          <div className="mt-4 hidden gap-4 md:grid lg:grid-cols-[1.1fr_0.9fr]">
            <Panel className="p-0">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-[14px] font-medium text-ink">Recent runs</span>
                <Kicker>Last 3</Kicker>
              </div>
              <ul className="divide-y divide-line">
                {[
                  ["March", "$12,840", "Ready for approval", false],
                  ["February", "$12,610", "Settled · 18/18", true],
                  ["January", "$12,610", "Settled · 18/18", true],
                ].map(([m, amt, st, done]) => (
                  <li key={String(m)} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <div className="text-[14px] text-ink">{m} payroll</div>
                      <div className="text-[12px] text-muted">18 contractors · 3 countries</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular text-[13px] text-ink">{amt}</span>
                      {done ? <Verified label={String(st)} /> : <Pill tone="accent">{st}</Pill>}
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel className="p-0">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-[14px] font-medium text-ink">Agent activity</span>
                <Kicker>March run</Kicker>
              </div>
              <ul className="divide-y divide-line">
                {ACTIVITY.map(([t, msg]) => (
                  <li key={msg} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check size={11} strokeWidth={3} aria-hidden />
                    </span>
                    <span className="flex-1 text-[13.5px] text-ink">{msg}</span>
                    <span className="text-[12px] text-muted">{t}</span>
                  </li>
                ))}
                <li className="px-4 py-3">
                  <Pill tone="accent">Awaiting approval</Pill>
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** Centered statement on a warm wash, then the product itself. */
export default function Statement() {
  return (
    <section id="product" className="bg-cream pb-16 pt-24 md:pb-24 md:pt-40">
      <Container>
        <Reveal className="mx-auto max-w-[900px] text-center">
          <Heading size="lg" className="mx-auto">
            Payroll, <Em>without</Em> the payroll work.
          </Heading>
          <Lead className="mx-auto mt-8 max-w-[34ch]">
            Private, agent-assisted payroll for global teams — settled in USDC on Stellar.
          </Lead>
          <div className="mt-10">
            <LinkButton href="#waitlist" variant="mint" size="lg">
              Join the waitlist
            </LinkButton>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-16 max-w-[1240px] md:mt-24">
          <div className="rounded-tile border border-line bg-canvas p-3 md:p-4">
            <div className="flex items-center justify-between px-3 pb-3 pt-1 md:px-4">
              <span className="text-[15px] font-medium text-ink">The product</span>
              <span className="text-[15px] font-semibold text-ink">Disburs</span>
            </div>
            <Dashboard />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
