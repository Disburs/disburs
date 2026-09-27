import Image from "next/image";
import { Container } from "@/components/landing/Section";
import LinkButton from "@/components/landing/Button";
import Reveal from "@/components/landing/Reveal";
import { Avatar, TEAM } from "@/components/landing/mock";
import { highlight } from "./highlight";

/* ---------- Use cases: a payee roster with real avatars, per scenario ---------- */
const CASES = [
  {
    title: "Payroll & EOR platforms",
    body: "Add USDC payouts to an existing product without becoming a crypto company. Onboard payees by email; pay the roster; hand your finance team a reconciled ledger.",
    roster: [TEAM[0], TEAM[1], TEAM[2]],
    line: "Monthly · 18 payees · 3 countries",
  },
  {
    title: "Marketplaces & gig apps",
    body: "Pay drivers, creators and freelancers across borders the moment work is accepted. Per-task amounts, memos for exchange deposits, local cash-out through anchors.",
    roster: [TEAM[2], TEAM[0]],
    line: "Per task · settles in ~4s",
  },
  {
    title: "Agents & automations",
    body: "Give an agent a scoped client that proposes payouts a human authorizes. Idempotent by design, limited by policy, explained in plain English.",
    roster: [TEAM[1]],
    line: "Proposed by agent · approved by you",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="bg-subtle py-24 md:py-32">
      <Container>
        <Reveal>
          <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-accent">Solutions</p>
          <h2 className="mt-4 max-w-[16ch] font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[56px]">
            Who gets paid, and how.
          </h2>
        </Reveal>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05} className="grid gap-6 py-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <h3 className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">{c.title}</h3>
              </div>
              <p className="text-[16px] leading-[1.55] text-muted md:col-span-4">{c.body}</p>
              <div className="flex items-center gap-4 md:col-span-3 md:justify-end">
                <div className="flex -space-x-3">
                  {c.roster.map((m) => (
                    <span key={m.name} className="rounded-full ring-2 ring-subtle">
                      <Avatar m={m} size={44} />
                    </span>
                  ))}
                </div>
                <span className="text-[12.5px] leading-tight text-muted">{c.line}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <LinkButton href="#waitlist" variant="ink">
            Talk to us about your use case
          </LinkButton>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------- Quickstart: vertical timeline, one call per step ---------- */
const STEPS: { n: string; title: string; body: string; code: string; lang: "bash" | "json" }[] = [
  { n: "01", title: "Sign in", body: "Magic link or Google. The session cookie is what every call below carries.", code: `POST /api/auth/sign-in/magic-link\n{ "email": "finance@acme.io", "callbackURL": "https://app.acme.io/auth/callback" }`, lang: "json" },
  { n: "02", title: "Onboard the payer and a payee", body: "The org gets a treasury wallet; the contractor gets a payout wallet. Both are activated for you.", code: `POST /api/onboarding/client      { "company": "Acme", "country": "Kenya" }\nPOST /api/onboarding/contractor  { "name": "Kwabena Mensah", "country": "Ghana", "payoutCurrency": "GHS" }`, lang: "json" },
  { n: "03", title: "Fund the treasury", body: "Send USDC on Stellar to the treasury address from any wallet or exchange. On testnet, use Circle&rsquo;s faucet.", code: `GET /api/me\n→ organization.treasuryWallet.publicKey  "GBJAZAZF…OJUIY"\n→ balances.usdc                          "10.0000000"`, lang: "bash" },
  { n: "04", title: "Pay", body: "One idempotent call. Poll the ledger or, from Phase 1, receive payout.settled.", code: `POST /api/payments/pay\n{ "contractorId": "a1b2c3d4-…", "amount": "2.50", "idempotencyKey": "task-8812" }\n→ { "status": "SETTLED", "txHash": "57dd5365…" }`, lang: "json" },
];

export function Quickstart() {
  return (
    <section id="quickstart" className="bg-canvas py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-accent">Quickstart</p>
            <h2 className="mt-4 font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[52px]">
              Four calls to a settled payout.
            </h2>
            <p className="mt-5 text-[16px] leading-[1.55] text-muted">Everything here runs on testnet today with the same USDC issuer as mainnet, so what you test is what you ship.</p>
            <div className="mt-8 rounded-[28px] bg-cream p-6">
              <Image src="/illustrations/fx.svg" alt="A dashboard converting between currencies with USDC in the middle" width={960} height={743} className="h-auto w-full" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="https://github.com/Disburs/disburs-backend/blob/main/openapi.json" variant="outline">
                Full OpenAPI spec
              </LinkButton>
            </div>
          </Reveal>
          <ol className="relative lg:col-span-8">
            <div className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-line" aria-hidden />
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.06} className="relative flex gap-6 pb-10 last:pb-0">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-deep font-mono text-[12.5px] text-mint">{s.n}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[19px] font-medium text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.5] text-muted">{s.body}</p>
                  <pre className="on-dark mt-4 overflow-x-auto rounded-[16px] bg-ink-deep px-4 py-3 font-mono text-[12.5px] leading-[1.65] text-white/85"><code>{highlight(s.code, s.lang)}</code></pre>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
