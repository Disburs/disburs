import Image from "next/image";
import { Container } from "@/components/landing/Section";
import LinkButton from "@/components/landing/Button";
import Reveal from "@/components/landing/Reveal";
import { highlight } from "./highlight";

const FLOW: [string, string, string][] = [
  [
    "Public",
    "Deposit",
    "USDC enters the payroll pool contract. The aggregate inflow is visible on Stellar, as any deposit is.",
  ],
  [
    "Private",
    "Inside the pool",
    "Salaries are commitments, not amounts. A payout is a proof that it is valid: right recipient, within budget. The number never appears.",
  ],
  [
    "Edge",
    "Claim",
    "The payee claims with a proof and the amount is revealed only to them. Auditors get a view key, not the ledger.",
  ],
];

const PROOF = `POST /api/payments/pay        # same call
{
  "contractorId": "a1b2c3d4-…",
  "amount": "1200.00",          # never on-chain
  "settlement": "shielded"
}
→ {
  "status": "SETTLED",
  "proof": "zk:0x9f3a…",       # valid, proven
  "commitment": "0x51c0…",     # what the chain sees
  "viewKey": "org auditors"
}`;

/** Privacy as a settlement path, not a checkbox. Three-node public → private → edge flow. */
export default function PrivacySection() {
  return (
    <section id="privacy" className="bg-canvas py-24 md:py-32">
      <Container>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="order-2 min-w-0 lg:order-1 lg:col-span-5">
            <div className="relative mx-auto max-w-[420px] rounded-[32px] bg-accent-soft p-8">
              <Image
                src="/illustrations/privacy.svg"
                alt="A person walking past a padlock: salaries stay off the public ledger"
                width={854}
                height={800}
                className="h-auto w-full"
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-deep px-4 py-2 font-mono text-[12px] text-mint">
                proven · never revealed
              </div>
            </div>
          </Reveal>
          <Reveal
            delay={0.06}
            className="order-1 min-w-0 lg:order-2 lg:col-span-7"
          >
            <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-accent">
              Private by proof
            </p>
            <h2 className="mt-4 max-w-[18ch] font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[56px]">
              The chain verifies every salary. It never learns one.
            </h2>
            <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.55] text-muted md:text-[19px]">
              A native Stellar payment is public, so privacy cannot be bolted on
              afterwards. Disburs adds a second settlement path: a shielded
              payroll pool where amounts are commitments and each payout carries
              a zero-knowledge proof that it is valid. Your integration keeps
              the same{" "}
              <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[15px] text-ink">
                pay
              </code>{" "}
              call; only the settlement changes. When an auditor needs the
              numbers, you hand them a view key, deliberately, instead of the
              whole ledger being open to everyone.
            </p>
            <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.55] text-muted">
              Honest limits: pool inflows and outflows stay visible in aggregate
              and timing leaks. Perfect anonymity is not the claim. Hiding
              individual salaries is.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/#privacy" variant="ink">
                Privacy on the payroll side
              </LinkButton>
              <LinkButton
                href="https://github.com/Disburs/disburs-docs"
                variant="outline"
              >
                Read the design in the bible
              </LinkButton>
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={0.1}
          className="mt-16 grid min-w-0 gap-6 lg:grid-cols-12"
        >
          <ol className="grid min-w-0 gap-4 md:grid-cols-3 lg:col-span-7 lg:gap-5">
            {FLOW.map(([tag, title, body], i) => (
              <li
                key={title}
                className={`rounded-[24px] p-6 ${i === 1 ? "on-dark bg-ink-deep" : "border border-line bg-canvas"}`}
              >
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-[11.5px] ${i === 1 ? "bg-mint text-ink-deep" : "bg-subtle text-muted"}`}
                >
                  {tag}
                </span>
                <h3
                  className={`mt-4 text-[19px] font-medium ${i === 1 ? "text-white" : "text-ink"}`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-2 text-[14.5px] leading-[1.5] ${i === 1 ? "text-white/65" : "text-muted"}`}
                >
                  {body}
                </p>
              </li>
            ))}
          </ol>
          <div className="on-dark min-w-0 overflow-hidden rounded-[24px] bg-ink-deep lg:col-span-5">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-[11.5px]">
              <span className="text-white/60">
                same endpoint, shielded settlement
              </span>
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-white/70">
                Phase 4
              </span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words px-5 py-4 font-mono text-[12.5px] leading-[1.65] text-white/85 md:whitespace-pre">
              <code>{highlight(PROOF, "bash")}</code>
            </pre>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
