import Image from "next/image";
import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";

const POINTS: [string, string][] = [
  ["Stable value", "USDC is a fully reserved dollar stablecoin issued by Circle. What you send is what arrives, with no rate surprise between approval and settlement."],
  ["Four-second finality", "Stellar confirms payments in seconds and charges a fraction of a cent. Batch payouts to every contractor land at once."],
  ["Local cash-out", "Contractors convert USDC to shillings, cedis or rand through Stellar anchor partners. Nothing to install, no crypto to understand."],
  ["Verifiable settlement", "Every payment has an on-chain reference that can be independently checked, while the amount itself stays private."],
];

export default function Rails() {
  return (
    <section id="rails" className="bg-subtle py-24 md:py-36">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading size="lg">Why USDC on Stellar.</Heading>
          <Lead className="max-w-[40ch]">
            Dollar stability with settlement rails built for small, frequent, global payments.
          </Lead>
        </Reveal>

        <Reveal delay={0.06} className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
          {/* Currency card */}
          <div className="flex flex-col justify-between rounded-tile bg-canvas p-8 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 md:p-10">
            <div className="flex items-center gap-4">
              <Image src="/logos/usdc.svg" alt="USDC" width={64} height={64} className="h-16 w-16" />
              <div>
                <div className="text-[22px] font-medium text-ink">USDC</div>
                <div className="text-[15px] text-muted">USD Coin · issued by Circle</div>
              </div>
            </div>
            <dl className="mt-10 divide-y divide-line border-y border-line text-[15px]">
              {[
                ["Peg", "1 USDC = 1 USD"],
                ["Reserves", "Cash and short-dated U.S. Treasuries"],
                ["Network", "Stellar"],
                ["Settlement", "About 4 seconds"],
                ["Network fee", "Under $0.01 per payment"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-6 py-3.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex items-center gap-6" aria-label="Built with">
              <span className="flex items-center gap-2 text-[14px] text-muted">
                <Image src="/logos/stellar.svg" alt="" width={20} height={20} className="h-5 w-5" />
                Stellar
              </span>
              <span className="flex items-center gap-2 text-[14px] text-muted">
                <Image src="/logos/circle.svg" alt="" width={20} height={20} className="h-5 w-5" />
                Circle
              </span>
            </div>
          </div>

          {/* Illustration card */}
          <div className="group flex items-center justify-center rounded-tile bg-canvas p-8 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 md:p-14">
            <Image
              src="/illustrations/fx.svg"
              alt="A dashboard converting between currencies, with USDC settling in the middle"
              width={960}
              height={743}
              className="h-auto w-full max-w-[520px] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </Reveal>

        <dl className="mt-4 grid gap-x-10 border-t border-line md:grid-cols-2 lg:mt-6">
          {POINTS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.06} className="border-b border-line py-7">
              <dt className="text-[19px] font-medium text-ink">{t}</dt>
              <dd className="mt-2 text-[16px] leading-[1.5] text-muted md:text-[17px]">{d}</dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
