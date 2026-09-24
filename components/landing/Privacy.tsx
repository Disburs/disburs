import Image from "next/image";
import { Container, Heading, Lead } from "./Section";
import LinkButton from "./Button";
import Reveal from "./Reveal";
import { Avatar, Protected, TEAM, Verified } from "./mock";

export default function Privacy() {
  return (
    <section id="privacy" className="bg-canvas py-24 md:py-36">
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading size="lg">Private by design.</Heading>
          <div>
            <Lead className="max-w-[40ch]">
              Every payment is verified by the network without the amount ever being revealed. When
              an auditor needs specifics, you disclose deliberately — with a view key.
            </Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="#waitlist" variant="ink">
                Join the waitlist
              </LinkButton>
              <LinkButton href="#security" variant="outline">
                Security details
              </LinkButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 md:mt-20">
          <div className="grid overflow-hidden rounded-tile border border-line bg-accent-soft lg:grid-cols-2">
            <div className="group flex items-center justify-center p-10 md:p-16">
              <Image
                src="/illustrations/privacy.svg"
                alt="A person walking past a padlock: salaries stay locked away from the public ledger"
                width={854}
                height={800}
                className="h-auto w-full max-w-[380px] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="bg-canvas p-6 md:p-10">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-ink">March payroll</span>
                <span className="text-[14px] text-muted">18 of 18 protected</span>
              </div>
              <ul className="mt-5 divide-y divide-line border-y border-line" aria-label="Payroll lines with amounts protected">
                {TEAM.map((m) => (
                  <li key={m.name} className="flex items-center justify-between gap-3 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar m={m} size={36} />
                      <div className="min-w-0">
                        <div className="truncate text-[15px] text-ink">{m.name}</div>
                        <div className="text-[12.5px] text-muted">{m.place}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Protected />
                      <span className="hidden sm:block">
                        <Verified />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[14px] leading-[1.5] text-muted">
                Verified by proof: right recipient, within budget. The amount itself never leaves
                your records.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
