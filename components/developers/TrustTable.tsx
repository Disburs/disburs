import Image from "next/image";
import { Check, Minus, X } from "lucide-react";
import { Container } from "@/components/landing/Section";
import Reveal from "@/components/landing/Reveal";

type Cell = true | false | "partial" | string;
const ROWS: [string, Cell, Cell, Cell][] = [
  ["Settlement time", "~4 seconds", "Minutes to hours", "3–5 business days"],
  [
    "Fee per payout",
    "<$0.01 network + 0.5%",
    "Network + spread",
    "$25–45 + FX spread",
  ],
  ["Idempotent by default", true, "partial", false],
  ["Failures move no money", true, "partial", false],
  ["Custody handled for you", true, false, true],
  ["Ledger matches the chain", true, "partial", false],
  ["Policy engine before execution", true, false, false],
  ["Agent that proposes runs", true, false, false],
  [
    "Salary amounts off the public ledger",
    "By proof (Phase 4)",
    false,
    "Bank sees all",
  ],
];

function CellView({ v, strong }: { v: Cell; strong?: boolean }) {
  if (v === true)
    return (
      <Check
        size={18}
        strokeWidth={2.5}
        className="text-accent"
        aria-label="Yes"
      />
    );
  if (v === false)
    return <X size={18} className="text-faint" aria-label="No" />;
  if (v === "partial")
    return <Minus size={18} className="text-muted" aria-label="Depends" />;
  return (
    <span
      className={`text-[14px] ${strong ? "font-medium text-ink" : "text-muted"}`}
    >
      {v}
    </span>
  );
}

/** A plain comparison table: the landing has no tables, so this reads as its own thing. */
export default function TrustTable() {
  return (
    <section id="trust" className="bg-canvas py-24 md:py-32">
      <Container>
        <Reveal className="grid min-w-0 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-7">
            <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-accent">
              Guardrails
            </p>
            <h2 className="mt-4 max-w-[18ch] font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[56px]">
              Rails you can reason about.
            </h2>
          </div>
          <p className="max-w-[44ch] text-[16px] leading-[1.5] text-muted lg:col-span-5">
            Money-moving endpoints are built so the careless call and the
            malicious call both fail safely. Here is how that compares with the
            alternatives your team would otherwise wire up.
          </p>
        </Reveal>

        <Reveal
          delay={0.06}
          className="mt-12 min-w-0 max-w-full overflow-x-auto"
        >
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[34%] py-4 pr-4 text-[13px] font-medium text-muted">
                  Capability
                </th>
                <th className="py-4 pr-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-ink-deep px-3 py-1 text-[13px] font-medium text-white">
                    <Image
                      src="/logos/usdc.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />{" "}
                    Disburs API
                  </span>
                </th>
                <th className="py-4 pr-4 text-[13px] font-medium text-muted">
                  Raw chain SDK
                </th>
                <th className="py-4 text-[13px] font-medium text-muted">
                  Bank wires
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, a, b, c]) => (
                <tr key={label} className="border-b border-line">
                  <td className="py-4 pr-4 text-[15px] text-ink">{label}</td>
                  <td className="py-4 pr-4">
                    <CellView v={a} strong />
                  </td>
                  <td className="py-4 pr-4">
                    <CellView v={b} />
                  </td>
                  <td className="py-4">
                    <CellView v={c} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Container>
    </section>
  );
}
