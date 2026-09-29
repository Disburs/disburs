import { Container } from "@/components/landing/Section";
import LinkButton from "@/components/landing/Button";
import Reveal from "@/components/landing/Reveal";

const ROWS: [string, string, string, string][] = [
  ["Price", "$0", "0.5% per payout", "Custom"],
  ["Network", "Testnet", "Mainnet", "Mainnet"],
  ["Payouts", "Unlimited test USDC", "Pay as money moves", "Volume pricing"],
  ["Ledger", "Included", "Included", "Included"],
  ["Webhooks", "Phase 1", "Phase 1", "Phase 1"],
  [
    "Policy engine",
    "Defaults",
    "Your limits and thresholds",
    "Custom approvals and roles",
  ],
  ["Support", "Community", "Email", "Dedicated, with SLA"],
];

/** Pricing as a single matrix rather than tier cards. */
export default function DevPricing() {
  return (
    <section id="pricing" className="bg-subtle py-24 md:py-32">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-accent">
              Pricing
            </p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[56px]">
              Free to build. Pay when money moves.
            </h2>
          </div>
          <p className="max-w-[44ch] text-[16px] leading-[1.5] text-muted lg:col-span-5">
            No platform fee for the API itself. The flat 0.5% per payout is the
            same rate the payroll product charges; Stellar&rsquo;s network fee
            is passed through at cost.
          </p>
        </Reveal>
        <Reveal
          delay={0.06}
          className="mt-12 min-w-0 max-w-full overflow-x-auto"
        >
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[22%] py-4 pr-4" />
                {["Developer", "Builder", "Enterprise"].map((t, i) => (
                  <th key={t} className="py-4 pr-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[13.5px] font-medium ${i === 1 ? "bg-ink-deep text-white" : "border border-line bg-canvas text-ink"}`}
                    >
                      {t}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, a, b, c], i) => (
                <tr key={label} className="border-b border-line">
                  <td className="py-4 pr-4 text-[14px] text-muted">{label}</td>
                  {[a, b, c].map((v, j) => (
                    <td
                      key={j}
                      className={`py-4 pr-4 text-[15px] ${i === 0 ? "font-display text-[24px] font-semibold tracking-[-0.02em]" : ""} ${j === 1 ? "text-ink" : "text-ink/80"}`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="py-5" />
                <td className="py-5 pr-4">
                  <LinkButton href="#waitlist" variant="outline" size="sm">
                    Get testnet access
                  </LinkButton>
                </td>
                <td className="py-5 pr-4">
                  <LinkButton href="#waitlist" variant="mint" size="sm">
                    Request access
                  </LinkButton>
                </td>
                <td className="py-5 pr-4">
                  <LinkButton
                    href="mailto:hello@disburs.io"
                    variant="outline"
                    size="sm"
                  >
                    Talk to us
                  </LinkButton>
                </td>
              </tr>
            </tbody>
          </table>
        </Reveal>
      </Container>
    </section>
  );
}
