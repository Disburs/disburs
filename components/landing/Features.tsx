import {
  Bot,
  CalendarClock,
  EyeOff,
  FileCheck2,
  Fingerprint,
  Landmark,
  Send,
  SlidersHorizontal,
  UserRound,
  UsersRound,
  WalletCards,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container, Heading, Lead } from "./Section";
import Reveal from "./Reveal";

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
  /** Not shipped yet; the card carries a "Coming soon" tag. */
  soon?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: Landmark,
    title: "USDC treasury",
    body: "Fund once in digital dollars. Pay everyone from one balance.",
  },
  {
    icon: UsersRound,
    title: "Payroll runs",
    body: "Pay the whole team in one batch, on your schedule.",
  },
  {
    icon: CalendarClock,
    title: "Scheduled drafts",
    body: "Weekly, twice-monthly or custom runs, drafted for you.",
  },
  {
    icon: FileCheck2,
    title: "Invoices & milestones",
    body: "Pay when the work is delivered and approved.",
  },
  {
    icon: WalletCards,
    title: "Team & approvals",
    body: "Roles for owners, admins and members. Nothing settles unapproved.",
  },
  {
    icon: Send,
    title: "Pay any address",
    body: "Send to any Stellar wallet. No account needed on their side.",
  },
  {
    icon: Fingerprint,
    title: "Identity checks",
    body: "Business and contractor verification, built in.",
  },
  {
    icon: SlidersHorizontal,
    title: "Spending rules",
    body: "Budgets and monthly caps you set.",
  },
  {
    icon: UserRound,
    title: "Contractor portal",
    body: "Contractors see every payment and withdraw when they like.",
  },
  {
    icon: Zap,
    title: "Instant settlement",
    body: "Paid in seconds on Stellar, for a fraction of a cent.",
  },
  {
    icon: Bot,
    title: "Payroll Agent",
    body: "It prepares the run. You approve the outcome.",
    soon: true,
  },
  {
    icon: EyeOff,
    title: "Private salaries",
    body: "Pay amounts stay off the public ledger.",
    soon: true,
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-subtle py-24 md:py-36">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading size="lg">One payroll. Everything it needs.</Heading>
          <Lead className="max-w-[40ch]">
            Each tool works on its own and better together: one treasury, one
            set of rules, and your approval built into every step.
          </Lead>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal
              as="li"
              key={f.title}
              delay={(i % 4) * 0.05}
              className="flex flex-col rounded-[24px] border border-line bg-canvas p-4 transition-colors duration-200 hover:border-ink/30 sm:p-6 md:p-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <f.icon
                  size={28}
                  strokeWidth={1.5}
                  className="text-ink"
                  aria-hidden
                />
                {f.soon && (
                  <span className="rounded-full bg-mint-soft px-2 py-0.5 text-[11px] sm:px-2.5 sm:py-1 sm:text-[12px] font-medium text-accent">
                    Coming soon
                  </span>
                )}
              </div>
              <h3 className="mt-6 text-[16px] font-semibold sm:mt-10 sm:text-[19px] tracking-[-0.01em] text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.45] text-muted sm:text-[16px]">
                {f.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
