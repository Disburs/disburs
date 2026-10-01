import { Container, Heading, Lead } from "./Section";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import { Avatar, Protected, TEAM, Verified } from "./mock";

/** What a public explorer shows for the same roster: an address and a figure, per payday. */
const PUBLIC_ROWS = [
  { address: "GA7K…3WPD", amount: "1,250.00 USDC" },
  { address: "GBSV…2KQN", amount: "3,800.00 USDC" },
  { address: "GCTE…9XLM", amount: "940.00 USDC" },
  { address: "GDWC…8RTF", amount: "2,150.00 USDC" },
  { address: "GEPD…5VKJ", amount: "1,600.00 USDC" },
  { address: "GFQR…7HNB", amount: "2,900.00 USDC" },
];

export default function Privacy() {
  return (
    <section id="privacy" className="bg-canvas py-24 md:py-36">
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading size="lg">Your payroll is a public diary.</Heading>
          <div>
            <Lead className="max-w-[40ch]">
              On a public ledger, anyone can read what each person earns.
              Disburs is private by default and auditable when required: the
              network verifies every payment without seeing the amount, and an
              auditor sees the figures only when you hand them a view key.
            </Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="#waitlist" variant="ink">
                Join the waitlist
              </LinkButton>
              <LinkButton href="#security" variant="outline">
                Security details
              </LinkButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 md:mt-20">
          <div className="grid overflow-hidden rounded-tile border border-line bg-accent-soft lg:grid-cols-2">
            <div className="bg-subtle p-6 md:p-10">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-ink">
                  On a public ledger
                </span>
                <span className="text-[14px] text-muted">
                  visible to anyone
                </span>
              </div>
              <ul
                className="mt-5 divide-y divide-line border-y border-line"
                aria-label="Payroll lines exposed on a public ledger"
              >
                {TEAM.map((m, i) => (
                  <li
                    key={m.name}
                    className="flex items-center justify-between gap-3 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar m={m} size={36} />
                      <div className="min-w-0">
                        <div className="truncate text-[15px] text-ink">
                          {m.name}
                        </div>
                        <div className="truncate font-mono text-[12.5px] text-muted">
                          {PUBLIC_ROWS[i].address} · payday
                        </div>
                      </div>
                    </div>
                    <span className="tabular font-mono text-[15px] text-ink">
                      {PUBLIC_ROWS[i].amount}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[14px] leading-[1.5] text-muted">
                Every amount, every month, forever. Your team can read each
                other&rsquo;s salaries; so can your competitors.
              </p>
            </div>
            <div className="bg-canvas p-6 md:p-10">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-ink">
                  With Disburs
                </span>
                <span className="text-[14px] text-muted">
                  visible to you, and whoever you choose
                </span>
              </div>
              <ul
                className="mt-5 divide-y divide-line border-y border-line"
                aria-label="Payroll lines with amounts protected"
              >
                {TEAM.map((m) => (
                  <li
                    key={m.name}
                    className="flex items-center justify-between gap-3 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar m={m} size={36} />
                      <div className="min-w-0">
                        <div className="truncate text-[15px] text-ink">
                          {m.name}
                        </div>
                        <div className="text-[12.5px] text-muted">
                          {m.place}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Protected />
                      <span className="hidden sm:block">
                        <Verified />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[14px] leading-[1.5] text-muted">
                Verified by proof: right recipient, within budget. The amount
                never leaves your records unless you share a view key.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
