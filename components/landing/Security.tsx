import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";

const ITEMS: [string, string][] = [
  ["Key custody", "Keys are envelope-encrypted at rest (AES-256-GCM) and only ever used to sign your own payments. A leaked database alone can't move money."],
  ["Caps and thresholds", "Set limits the agent can never exceed on any run, in any currency."],
  ["Approval gates", "Anything above your threshold waits for a human sign-off before it moves."],
  ["Privacy", "Zero-knowledge proofs keep every amount off the public chain while proving each payment valid."],
  ["Audit trail", "Every agent decision is logged in plain English, with the on-chain reference beside it."],
  ["Encryption in transit and at rest", "Contracts and payroll data are encrypted end to end."],
  ["Verifiable settlement", "Every payment settles on Stellar and can be independently checked."],
  ["Revocation", "Pause or revoke the agent's authority in a single action."],
];

export default function Security() {
  return (
    <section id="security" className="on-dark bg-ink-deep py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Heading tone="dark">How the keys are held.</Heading>
          <Lead tone="dark" className="mt-5 max-w-[38ch]">
            Disburs is custodial so your team never touches a key or a gas fee. That makes custody
            our responsibility — here is how we carry it.
          </Lead>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="grid gap-x-12 md:grid-cols-2">
            {ITEMS.map(([t, d]) => (
              <div key={t} className="border-t border-white/12 py-6">
                <dt className="font-display text-[17px] font-semibold text-white">{t}</dt>
                <dd className="mt-2 text-[14.5px] leading-relaxed text-white/55">{d}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
