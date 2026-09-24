import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";

const ITEMS: [string, string][] = [
  ["Separation of duties", "The agent proposes. A policy engine validates. Zero-knowledge proofs verify. You authorize. Only then does payment infrastructure execute. The agent never holds keys or a balance."],
  ["Key custody", "Keys are envelope-encrypted at rest (AES-256-GCM) and only ever used to sign your own payments. A leaked database alone can't move money."],
  ["Approval gates", "You write the rules and the agent operates inside them. Runs above your threshold wait for a sign-off. A new wallet waits for contractor verification. A raise over 20% waits for a human."],
  ["Spending limits", "Policy limits the agent can never propose past, on any run, in any currency."],
  ["Privacy", "Zero-knowledge proofs keep every amount off the public chain while proving each payment valid."],
  ["Encryption", "Contracts and payroll data are encrypted in transit and at rest."],
  ["Audit trail", "Every agent decision is logged in plain English, with the on-chain reference beside it."],
  ["Verifiable settlement", "Every payment settles on Stellar and can be independently checked."],
  ["Revocation", "Pause the agent in a single action. Nothing in flight can settle without you."],
];

export default function Security() {
  return (
    <section id="security" className="bg-subtle py-24 md:py-36">
      <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Heading size="lg">
            Built for the responsibility of payroll.
          </Heading>
          <Lead className="mt-6 max-w-[36ch]">
            Disburs is custodial so your team never touches a key or a gas fee. That makes custody
            our responsibility — here is how we carry it.
          </Lead>
        </Reveal>
        <dl className="border-t border-line">
          {ITEMS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.05} className="grid gap-2 border-b border-line py-6 md:grid-cols-[240px_1fr] md:gap-8">
              <dt className="text-[19px] font-medium text-ink">{t}</dt>
              <dd className="text-[16px] leading-[1.5] text-muted md:text-[17px]">{d}</dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
