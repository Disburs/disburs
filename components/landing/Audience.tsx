import { Container, Heading } from "./Section";
import Reveal from "./Reveal";
import LinkButton from "./Button";

const SIDES = [
  {
    title: "For companies",
    points: ["One treasury, funded in USDC", "Runs drafted from your contracts", "Salaries private, every line reconciled", "Spending caps and approval gates you set"],
    cta: "Pay my team",
  },
  {
    title: "For contractors",
    points: ["Nothing to install, no crypto to understand", "Receive USDC, cash out to local currency", "What you earn stays between you and your employer", "A clean record of every payment"],
    cta: "Get paid",
  },
];

export default function Audience() {
  return (
    <section id="audience" className="bg-canvas py-24 md:py-36">
      <Container>
        <Reveal className="max-w-[820px]">
          <Heading size="lg">Two sides of every payment.</Heading>
        </Reveal>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
          {SIDES.map((s, i) => {
            const dark = i === 1;
            return (
              <Reveal
                key={s.title}
                delay={i * 0.06}
                className={`flex flex-col rounded-tile p-8 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 md:p-12 ${dark ? "on-dark bg-ink-deep text-white" : "bg-mint text-ink"}`}
              >
                <h3 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[48px]">{s.title}</h3>
                <ul className={`mt-8 divide-y border-y ${dark ? "divide-white/10 border-white/10" : "divide-ink/15 border-ink/15"}`}>
                  {s.points.map((p) => (
                    <li key={p} className={`py-3.5 text-[16px] md:text-[17px] ${dark ? "text-white/85" : "text-ink"}`}>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <LinkButton href="#waitlist" variant={dark ? "mint" : "ink"}>
                    {s.cta}
                  </LinkButton>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
