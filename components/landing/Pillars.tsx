import Image from "next/image";
import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";

const ROWS = [
  {
    id: "privacy",
    kicker: "Privacy",
    title: "Proof, not disclosure.",
    body: "Salaries never sit in plaintext on a public ledger. A zero-knowledge proof lets the network confirm each payment is valid — the right person, within budget — without revealing the amount to anyone. When an auditor needs specifics, you disclose deliberately, with a view key.",
    image: { src: "/illustrations/privacy.svg", w: 854, h: 800 },
    flip: false,
  },
  {
    kicker: "Autonomy",
    title: "The run is drafted before you open your laptop.",
    body: "The agent reads the contracts, applies rate changes, picks the FX window and clears the routine exceptions. Every decision is written down in plain English. Nothing moves until you approve it, and anything above your threshold waits for you.",
    image: { src: "/illustrations/agent.svg", w: 800, h: 714 },
    flip: true,
  },
  {
    kicker: "Reach and compliance",
    title: "Paid in USDC. Spent in cedis.",
    body: "Payments settle in seconds and convert to local currency through licensed anchor partners — Kenya, Ghana and South Africa today. Verification scales with volume, and every line lands in a ledger reconciled against the chain.",
    image: { src: "/illustrations/fx.svg", w: 960, h: 743 },
    flip: false,
  },
];

export default function Pillars() {
  return (
    <section id="features" className="bg-paper py-24 md:py-32">
      <Container>
        <Reveal className="max-w-[640px]">
          <Heading>Built to be trusted with what it knows.</Heading>
          <Lead className="mt-5">Three things, designed together.</Lead>
        </Reveal>

        <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          {ROWS.map((r, i) => (
            <Reveal key={r.kicker} delay={0.04}>
              <div id={r.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <div className={r.flip ? "lg:order-2" : ""}>
                  <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent">
                    {String(i + 1).padStart(2, "0")} — {r.kicker}
                  </p>
                  <h3 className="mt-4 font-display text-[28px] font-semibold leading-[1.12] tracking-[-0.025em] text-ink md:text-[34px]">
                    {r.title}
                  </h3>
                  <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-muted">{r.body}</p>
                </div>
                <div
                  className={`flex items-center justify-center rounded-card border border-line bg-surface p-8 md:p-12 ${
                    r.flip ? "lg:order-1" : ""
                  }`}
                >
                  <Image
                    src={r.image.src}
                    alt=""
                    width={r.image.w}
                    height={r.image.h}
                    unoptimized
                    className="h-auto w-full max-w-[440px]"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
