"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowDownLeft, Check } from "lucide-react";
import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";
import LinkButton from "./Button";
import { Avatar, Frame, Kicker, MockButton, Panel, Pill, TEAM } from "./mock";
import { highlight } from "@/components/developers/highlight";

type Tab = {
  id: string;
  label: string;
  title: string;
  points: string[];
  cta: { label: string; href: string };
  picture: ReactNode;
};

/** A payroll run waiting for the company's approval. */
function CompanyPicture() {
  const amounts = ["1,200.00", "950.00", "1,480.00", "800.00"];
  return (
    <Frame
      active="Payroll"
      label="A March payroll run of four contractors, drafted and waiting for approval"
    >
      <div className="p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Kicker>Payroll run</Kicker>
            <h4 className="mt-1 text-[19px] font-semibold tracking-[-0.02em] text-ink">
              March salaries
            </h4>
          </div>
          <Pill tone="accent">Awaiting approval</Pill>
        </div>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {TEAM.slice(0, 4).map((m, i) => (
            <li key={m.name} className="flex items-center gap-3 py-3">
              <Avatar m={m} size={32} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-ink">
                  {m.name}
                </span>
                <span className="block text-[12.5px] text-muted">
                  {m.place}
                </span>
              </span>
              <span className="tabular font-mono text-[13px] text-ink">
                {amounts[i]} <span className="text-muted">USDC</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[13.5px] text-muted">
            4 people ·{" "}
            <span className="tabular font-medium text-ink">4,430.00 USDC</span>
          </span>
          <MockButton tone="mint">Approve payroll</MockButton>
        </div>
      </div>
    </Frame>
  );
}

/** What a contractor sees: a balance and the payments that built it. */
function ContractorPicture() {
  const paid: [string, string, string][] = [
    ["March salary", "1 Mar", "1,200.00"],
    ["Milestone: checkout redesign", "18 Feb", "650.00"],
    ["February salary", "1 Feb", "1,200.00"],
  ];
  return (
    <Frame
      chrome={false}
      label="A contractor's balance of 1,850 USDC with three recent payments"
    >
      <div className="p-5 md:p-7">
        <div className="flex items-center gap-3">
          <Avatar m={TEAM[0]} size={40} />
          <div>
            <div className="text-[15px] font-medium text-ink">
              {TEAM[0].name}
            </div>
            <div className="text-[12.5px] text-muted">{TEAM[0].place}</div>
          </div>
        </div>
        <Panel className="mt-5">
          <Kicker>Available to withdraw</Kicker>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div className="tabular text-[32px] font-semibold leading-none tracking-[-0.02em] text-ink">
              1,850.00{" "}
              <span className="text-[15px] font-normal text-muted">USDC</span>
            </div>
            <MockButton tone="ink">Withdraw</MockButton>
          </div>
        </Panel>
        <ul className="mt-5 divide-y divide-line border-t border-line">
          {paid.map(([what, when, amount]) => (
            <li key={what + when} className="flex items-center gap-3 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <ArrowDownLeft size={15} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] text-ink">
                  {what}
                </span>
                <span className="block text-[12.5px] text-muted">{when}</span>
              </span>
              <span className="tabular font-mono text-[13px] text-ink">
                +{amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

const REQUEST = `curl -X POST https://api.disburs.xyz/api/payments/pay \\
  -H "Content-Type: application/json" \\
  -d '{
    "contractorId": "a1b2c3d4-…",
    "amount": "1200.00",
    "memo": "March salary",
    "idempotencyKey": "run-2026-03-kwabena"
  }'`;

const RESPONSE = `{
  "status": "SETTLED",
  "amount": "1200.0000000",
  "assetCode": "USDC",
  "txHash": "57dd5365…"
}`;

/** One API call and its answer. The same request as on the developers page. */
function DeveloperPicture() {
  const pre =
    "overflow-x-auto whitespace-pre-wrap break-words px-5 py-4 font-mono text-[12.5px] leading-[1.65] text-white/85 md:whitespace-pre";
  return (
    <div
      role="img"
      aria-label="An API request that pays a contractor 1,200 USDC, and the settled response"
      className="on-dark overflow-hidden rounded-card border border-line bg-ink-deep"
    >
      <div className="border-b border-white/10 px-5 py-3 text-[12.5px] text-white/60">
        Pay a contractor
      </div>
      <pre className={pre}>
        <code>{highlight(REQUEST, "bash")}</code>
      </pre>
      <div className="flex items-center justify-between border-y border-white/10 bg-white/[0.04] px-5 py-2.5">
        <span className="text-[12.5px] text-white/60">Response</span>
        <span className="flex items-center gap-3 font-mono text-[11.5px]">
          <span className="text-mint">201 Created</span>
          <span className="text-white/50">4.1s to settle</span>
        </span>
      </div>
      <pre className={pre}>
        <code>{highlight(RESPONSE, "json")}</code>
      </pre>
    </div>
  );
}

const TABS: Tab[] = [
  {
    id: "companies",
    label: "Companies",
    title: "Pay the whole team with one approval.",
    points: [
      "One treasury, funded in USDC",
      "Runs drafted for you, on your schedule",
      "Spending caps and approval rules you set",
      "Every line matched to its payment on Stellar",
    ],
    cta: { label: "Pay my team", href: "#waitlist" },
    picture: <CompanyPicture />,
  },
  {
    id: "contractors",
    label: "Contractors",
    title: "Get paid in dollars, in seconds.",
    points: [
      "Nothing to install, no crypto to understand",
      "Receive USDC the moment the run is approved",
      "Withdraw to any wallet or exchange",
      "A clean record of every payment",
    ],
    cta: { label: "Get paid", href: "#waitlist" },
    picture: <ContractorPicture />,
  },
  {
    id: "developers",
    label: "Developers",
    title: "Add payouts to your product with one call.",
    points: [
      "A REST API over the same treasury and rules",
      "Idempotency keys, so a retry never pays twice",
      "Settled in about four seconds, with the transaction hash",
      "Pay a contractor or any Stellar address",
    ],
    cta: { label: "Read the docs", href: "/developers" },
    picture: <DeveloperPicture />,
  },
];

export default function Audience() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[active];

  /** Left and right arrows move between tabs, as screen readers expect. */
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + TABS.length) % TABS.length;
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <section id="audience" className="bg-canvas py-24 md:py-36">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading size="lg">Built for every side of the payment.</Heading>
          <Lead className="max-w-[40ch]">
            The company that pays, the person who is paid, and the developer
            who builds on top. Each gets a view made for them.
          </Lead>
        </Reveal>

        <Reveal delay={0.06} className="mt-12 md:mt-16">
          <div
            role="tablist"
            aria-label="Who Disburs is for"
            onKeyDown={onKeyDown}
            className="grid grid-cols-3 gap-1 rounded-full bg-subtle p-1.5 ring-1 ring-line sm:inline-grid"
          >
            {TABS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`audience-tab-${t.id}`}
                  aria-selected={on}
                  aria-controls="audience-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`cursor-pointer rounded-full px-3 py-2.5 text-[15px] font-medium transition-colors duration-200 sm:px-8 sm:py-3 sm:text-[16px] ${on ? "bg-ink-deep text-white" : "text-muted hover:text-ink"}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="audience-panel"
            aria-labelledby={`audience-tab-${tab.id}`}
            className="mt-6 grid gap-8 rounded-tile border border-line bg-subtle p-6 md:p-10 lg:grid-cols-[5fr_6fr] lg:items-center lg:gap-14 lg:p-14"
          >
            <div>
              <h3 className="font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-balance text-ink md:text-[44px]">
                {tab.title}
              </h3>
              <ul className="mt-7 space-y-3.5">
                {tab.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 text-[16px] text-ink md:text-[17px]"
                  >
                    <Check
                      size={18}
                      strokeWidth={2.5}
                      className="mt-[3px] shrink-0 text-accent"
                      aria-hidden
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <LinkButton href={tab.cta.href} variant="ink">
                  {tab.cta.label}
                </LinkButton>
              </div>
            </div>
            {/* Keyed so the picture fades in again on each tab change. */}
            <div key={tab.id} className="min-w-0 animate-[fade-in_0.3s_ease-out]">
              {tab.picture}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
