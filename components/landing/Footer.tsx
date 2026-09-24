import Image from "next/image";
import { Container, Em, Heading, Lead } from "./Section";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import { Logo } from "./Nav";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Privacy", href: "#privacy" },
      { label: "Security", href: "#security" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "mailto:hello@disburs.io" },
      { label: "Privacy policy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-canvas pb-10 pt-24 md:pt-36">
      <Container>
        <Reveal className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <Heading size="lg" className="max-w-[12ch]">
              Run your next payroll <Em>without</Em> the wire.
            </Heading>
            <Lead className="mt-8 max-w-[36ch]">
              The first 20 companies on the waitlist get three months free and lock in launch pricing.
            </Lead>
            <div className="mt-10 flex flex-wrap gap-3">
              <LinkButton href="#waitlist" variant="mint" size="lg">
                Join the waitlist
              </LinkButton>
              <LinkButton href="mailto:hello@disburs.io" variant="outline" size="lg">
                Talk to us
              </LinkButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:pt-4">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <h4 className="text-[15px] font-medium text-muted">{c.title}</h4>
                <ul className="mt-5 space-y-3.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-[17px] text-ink transition-opacity hover:opacity-[0.84]">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 md:mt-28 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden items-center gap-4 text-[14px] text-muted sm:flex">
              <span className="flex items-center gap-1.5">
                <Image src="/logos/usdc.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                USDC
              </span>
              <span className="flex items-center gap-1.5">
                <Image src="/logos/stellar.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                Stellar
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[14px] text-muted md:items-end">
            <span>© {new Date().getFullYear()} Disburs. All rights reserved.</span>
            <span>Disburs is in private beta. Custodial service; not a bank.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
