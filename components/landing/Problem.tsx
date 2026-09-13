import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";

const ROWS: { label: string; wire: string; disburs: string }[] = [
  { label: "Time to land", wire: "3–5 business days", disburs: "About 4 seconds" },
  { label: "Cost", wire: "2–4% in fees and FX spread", disburs: "0.5% flat, under $0.01 network fee" },
  { label: "Who can see the amount", wire: "Banks, intermediaries, anyone with the spreadsheet", disburs: "Nobody. Verified by proof, never revealed" },
  { label: "Reconciliation", wire: "By hand, after the fact", disburs: "Every line matched to the chain, automatically" },
  { label: "Who runs it", wire: "Someone on your team, every payday", disburs: "The agent drafts it. You approve." },
];

export default function Problem() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <Heading>What a cross-border payroll actually costs you.</Heading>
            <Lead className="mt-5 max-w-[42ch]">
              The wire is the easy part. It&apos;s the days of waiting, the spread nobody itemises,
              and the fact that a dozen people can see what each person earns.
            </Lead>
          </Reveal>

          <Reveal delay={0.08}>
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-ink/15">
                  <th scope="col" className="pb-3 pr-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint" />
                  <th scope="col" className="pb-3 pr-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint">
                    Bank wire
                  </th>
                  <th scope="col" className="pb-3 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-accent">
                    Disburs
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label} className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium text-ink">
                      {r.label}
                    </th>
                    <td className="py-4 pr-4 text-muted">{r.wire}</td>
                    <td className="py-4 text-ink">{r.disburs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
