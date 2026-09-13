import { Container } from "./Section";
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
    <footer className="border-t border-line bg-paper">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-[36ch] text-[14.5px] leading-relaxed text-muted">
              Privacy-preserving, autonomous payroll infrastructure. Pay anyone, anywhere — and keep
              what you pay them confidential.
            </p>
            <p className="mt-5 text-[12.5px] text-faint">Settles on Stellar · Paid in USDC</p>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h4 className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-faint">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[14.5px] text-ink transition-colors hover:text-accent">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-faint md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Disburs. All rights reserved.</span>
          <span>Disburs is in private beta. Custodial service; not a bank.</span>
        </div>
      </Container>
    </footer>
  );
}
