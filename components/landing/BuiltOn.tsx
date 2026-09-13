import { Container } from "./Section";

/** A plain fact line, not a logo wall. We're in private beta — no borrowed logos. */
export default function BuiltOn() {
  return (
    <section aria-label="Built on" className="border-b border-line bg-paper">
      <Container className="flex flex-col gap-2 py-5 font-mono text-[12px] uppercase tracking-[0.1em] text-faint md:flex-row md:items-center md:justify-between">
        <span>Settlement · Stellar network</span>
        <span>Currency · USDC, issued by Circle</span>
        <span>Custody · envelope-encrypted keys, held by Disburs</span>
      </Container>
    </section>
  );
}
