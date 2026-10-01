import Image from "next/image";
import { Bot, ShieldCheck, Fingerprint, UserCheck, Send } from "lucide-react";
import { Container } from "@/components/landing/Section";
import LinkButton from "@/components/landing/Button";
import Reveal from "@/components/landing/Reveal";

const STAGES = [
  {
    icon: Bot,
    name: "Agent proposes",
    body: "Reads contracts and hours, drafts every line, clears routine exceptions. It never holds a key or a balance.",
  },
  {
    icon: ShieldCheck,
    name: "Policy validates",
    body: "Spending limits, per-payee caps, new-wallet holds and raise thresholds are checked before anything is built.",
  },
  {
    icon: Fingerprint,
    name: "Proof verifies",
    body: "Right recipient, within budget, proven without exposing the amount. Zero-knowledge in Phase 4.",
  },
  {
    icon: UserCheck,
    name: "Human authorizes",
    body: "Inside policy, a single approval. Outside it, the run waits for the person the rule names.",
  },
  {
    icon: Send,
    name: "Rails execute",
    body: "Native USDC payments on Stellar, one idempotent call each, every one on the ledger with its hash.",
  },
];

/**
 * The agentic core, as a pipeline. A horizontal stepped flow with a
 * connecting line, deliberately unlike the landing's stacked cards.
 */
export default function AgentSection() {
  return (
    <section id="agent" className="bg-canvas py-24 md:py-32">
      <Container>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="min-w-0 lg:col-span-7">
            <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-accent">
              Autonomous by design
            </p>
            <h2 className="mt-4 max-w-[18ch] font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[56px]">
              Not a payout API with a chatbot. An operator with an API.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.55] text-muted md:text-[19px]">
              Most payment APIs stop at &ldquo;move money&rdquo;. Disburs also
              decides <em>what</em> to move and <em>why</em>: the agent turns
              agreements and timesheets into a proposed run, the policy engine
              checks it, and only an authorized run reaches the rails. Your
              integration gets the outcome of that loop, not the burden of
              building it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="#waitlist" variant="ink">
                Request access
              </LinkButton>
              <LinkButton href="/#how-it-works" variant="outline">
                See it from the employer side
              </LinkButton>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="min-w-0 lg:col-span-5">
            <div className="relative mx-auto max-w-[420px] rounded-[32px] bg-cream p-8">
              <Image
                src="/illustrations/agent.svg"
                alt="The Disburs agent reading contracts and preparing a run"
                width={800}
                height={714}
                className="h-auto w-full"
              />
              <div className="absolute -bottom-4 left-1/2 max-w-[90%] -translate-x-1/2 truncate rounded-full bg-ink-deep px-4 py-2 font-mono text-[12px] text-mint">
                proposes · never executes alone
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-20">
          <ol className="relative grid min-w-0 gap-6 md:grid-cols-5 md:gap-4">
            <div
              className="absolute left-[27px] top-0 h-full w-px bg-line md:left-0 md:top-[27px] md:h-px md:w-full"
              aria-hidden
            />
            {STAGES.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.name} className="relative flex gap-5 md:block">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-canvas text-accent">
                    <Icon size={22} />
                  </span>
                  <div className="md:mt-5 md:pr-4">
                    <div className="font-mono text-[12px] text-muted">
                      0{i + 1}
                    </div>
                    <h3 className="mt-1 text-[17px] font-medium text-ink">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.5] text-muted">
                      {s.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
