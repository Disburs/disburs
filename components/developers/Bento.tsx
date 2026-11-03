import { Container } from "@/components/landing/Section";
import Reveal from "@/components/landing/Reveal";
import { highlight } from "./highlight";

const LOG = `09:03:07  POST /api/payments/pay        201  PENDING   a1b2c3d4  1200.00
09:03:07  stellar  submit tx 57dd5365…                sponsor-paid fee
09:03:11  stellar  ledger 4888068  successful=true
09:03:11  ledger   5f9e1c2a  PENDING → SETTLED
09:03:12  POST /api/payments/pay        201  SETTLED   a1b2c3d4  1200.00  (same key, replayed)`;

const badge = (t: string) =>
  t === "Live"
    ? "bg-mint text-ink-deep"
    : "border border-line bg-subtle text-muted";

/** Endpoints as a bento grid: one big live tile with a ledger log, the rest sized by weight. */
export default function Bento() {
  return (
    <section id="endpoints" className="bg-subtle py-24 md:py-32">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-accent">
              Endpoints
            </p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[56px]">
              The whole payroll loop, as endpoints.
            </h2>
          </div>
          <p className="max-w-[40ch] text-[16px] leading-[1.5] text-muted">
            Session-authenticated REST today. Everything marked live is in the
            OpenAPI spec now.
          </p>
        </Reveal>

        <div className="mt-12 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          <Reveal className="on-dark min-w-0 overflow-hidden rounded-[28px] bg-ink-deep p-7 md:col-span-4 md:row-span-2 md:p-9">
            <div className="flex items-center justify-between">
              <h3 className="text-[22px] font-medium text-white">Payments</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${badge("Live")}`}
              >
                Live
              </span>
            </div>
            <p className="mt-2 max-w-[48ch] text-[15px] leading-[1.5] text-white/65">
              Pay a payee from the organization treasury. A caller-supplied
              idempotency key means a retry returns the original payout instead
              of a second one.
            </p>
            <ul className="mt-5 space-y-2 font-mono text-[13px]">
              <li className="flex gap-3">
                <span className="w-12 text-mint">POST</span>
                <span className="text-white/85">/api/payments/pay</span>
              </li>
              <li className="flex gap-3">
                <span className="w-12 text-[#93C5FD]">GET</span>
                <span className="text-white/85">/api/payments</span>
              </li>
            </ul>
            <div className="mt-6 min-w-0 overflow-hidden rounded-[16px] border border-white/10 bg-black/30">
              <div className="border-b border-white/10 px-4 py-2 font-mono text-[11.5px] text-white/45">
                one payout, as the ledger and the chain saw it
              </div>
              <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-[1.7] text-white/80">
                <code>{highlight(LOG, "bash")}</code>
              </pre>
            </div>
          </Reveal>

          <Reveal
            delay={0.05}
            className="min-w-0 rounded-[28px] border border-line bg-canvas p-7 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-medium text-ink">Onboarding</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${badge("Live")}`}
              >
                Live
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.5] text-muted">
              Create the paying org or the payee profile. A custodial wallet is
              provisioned and activated on completion.
            </p>
            <ul className="mt-4 space-y-1.5 font-mono text-[12.5px] text-ink">
              <li>POST /api/onboarding/client</li>
              <li>POST /api/onboarding/contractor</li>
              <li>GET&nbsp; /api/contractors/lookup</li>
            </ul>
          </Reveal>

          <Reveal
            delay={0.1}
            className="min-w-0 rounded-[28px] border border-line bg-canvas p-7 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-medium text-ink">Wallets</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${badge("Live")}`}
              >
                Live
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.5] text-muted">
              Balances straight from Horizon, activation retry, and memo-aware
              USDC sends for exchange deposits.
            </p>
            <ul className="mt-4 space-y-1.5 font-mono text-[12.5px] text-ink">
              <li>GET&nbsp; /api/me</li>
              <li>POST /api/me/activate</li>
              <li>POST /api/me/send</li>
            </ul>
          </Reveal>

          <Reveal
            delay={0.15}
            className="min-w-0 rounded-[28px] bg-mint p-7 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-medium text-ink">Payroll runs</h3>
              <span className="rounded-full bg-ink-deep px-2.5 py-0.5 text-[11.5px] font-medium text-white">
                Phase 1
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.5] text-ink/80">
              Roster and cadence, draft → approve → execute → reconcile, every
              line with a paid / failed status.
            </p>
          </Reveal>

          <Reveal
            delay={0.2}
            className="min-w-0 rounded-[28px] border border-line bg-canvas p-7 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-medium text-ink">Webhooks</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${badge("soon")}`}
              >
                Phase 1
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.5] text-muted">
              payout.settled, payout.failed, wallet.activated, run.completed.
              Stop polling.
            </p>
          </Reveal>

          <Reveal
            delay={0.25}
            className="min-w-0 rounded-[28px] border border-line bg-canvas p-7 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-medium text-ink">Agent SDK</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${badge("soon")}`}
              >
                Phase 3
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.5] text-muted">
              A typed, scoped client the agent uses to propose and reconcile
              runs. Never keys, never the chain.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
