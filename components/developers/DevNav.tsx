"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import ModeSwitch from "@/components/landing/ModeSwitch";
import { Container } from "@/components/landing/Section";

type Item = { label: string; desc: string; href: string; tag?: string };
type Menu = { label: string; items: Item[] };

const SPEC = "https://github.com/Disburs/disburs-backend/blob/main/openapi.json";
const REPO = "https://github.com/Disburs/disburs-backend";
const BIBLE = "https://github.com/Disburs/disburs-docs";

const MENUS: Menu[] = [
  {
    label: "Products",
    items: [
      { label: "Payouts", desc: "Pay a payee from a treasury in one idempotent call.", href: "/developers#endpoints", tag: "Live" },
      { label: "Wallets", desc: "Custodial treasury and payout wallets, activated for you.", href: "/developers#endpoints", tag: "Live" },
      { label: "Ledger", desc: "Every money action with its status and tx hash.", href: "/developers#endpoints", tag: "Live" },
      { label: "Payroll runs", desc: "Roster, cadence, draft, approve, execute, reconcile.", href: "/developers#endpoints", tag: "Phase 1" },
      { label: "Webhooks", desc: "payout.settled, payout.failed, wallet.activated.", href: "/developers#endpoints", tag: "Phase 1" },
      { label: "Agent SDK", desc: "A scoped client the agent uses to propose runs.", href: "/developers#agent", tag: "Phase 3" },
      { label: "Private settlement", desc: "Shielded pool with zero-knowledge proofs; salaries never on the public ledger.", href: "/developers#privacy", tag: "Phase 4" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Payroll & EOR platforms", desc: "Add USDC payouts without becoming a crypto company.", href: "/developers#use-cases" },
      { label: "Marketplaces & gig apps", desc: "Pay creators, drivers and freelancers the moment work is done.", href: "/developers#use-cases" },
      { label: "Agents & automations", desc: "Let an agent propose payouts a human authorizes.", href: "/developers#agent" },
      { label: "Stablecoin treasuries", desc: "Hold and move USDC on Stellar with a ledger you trust.", href: "/developers#trust" },
      { label: "Private payroll", desc: "Pay a team without publishing what each person earns.", href: "/developers#privacy" },
    ],
  },
  {
    label: "Developers",
    items: [
      { label: "Quickstart", desc: "Sign in, onboard a payee, fund, pay. Four calls.", href: "/developers#quickstart" },
      { label: "OpenAPI spec", desc: "The file the server serves and the web app generates from.", href: SPEC },
      { label: "Guardrails", desc: "Idempotency, policy checks, failures that move no money.", href: "/developers#trust" },
      { label: "Backend on GitHub", desc: "NestJS, Prisma, Stellar SDK. Read the code.", href: REPO },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "The bible", desc: "Product, architecture, flows and the phase plan.", href: BIBLE },
      { label: "Security & custody", desc: "How keys, limits and revocation work.", href: "/#security" },
      { label: "Changelog", desc: "Every merged change, on GitHub.", href: `${REPO}/commits/main` },
      { label: "Contact", desc: "hello@disburs.io", href: "mailto:hello@disburs.io" },
    ],
  },
];

const TAG: Record<string, string> = { Live: "bg-mint text-ink-deep", "Phase 1": "border border-line bg-subtle text-muted", "Phase 3": "border border-line bg-subtle text-muted", "Phase 4": "border border-line bg-subtle text-muted" };

function Dropdown({ menu, open, onToggle, onClose }: { menu: Menu; open: boolean; onToggle: () => void; onClose: () => void }) {
  return (
    <div className="relative" onMouseEnter={onToggle} onMouseLeave={onClose}>
      <button type="button" aria-expanded={open} onClick={onToggle} className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[16px] transition-colors ${open ? "bg-subtle text-ink" : "text-ink hover:opacity-[0.84]"}`}>
        {menu.label}
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-[420px] pt-2">
          <div className="rounded-[24px] border border-line bg-canvas p-2">
            {menu.items.map((it) => (
              <Link key={it.label} href={it.href} onClick={onClose} className="flex items-start justify-between gap-3 rounded-[16px] px-4 py-3 transition-colors hover:bg-subtle">
                <span>
                  <span className="block text-[15px] font-medium text-ink">{it.label}</span>
                  <span className="mt-0.5 block text-[13.5px] leading-[1.4] text-muted">{it.desc}</span>
                </span>
                {it.tag && <span className={`mt-1 shrink-0 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${TAG[it.tag]}`}>{it.tag}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DevNav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", mobile);
    return () => document.body.classList.remove("no-scroll");
  }, [mobile]);

  return (
    <header ref={ref} className={`fixed inset-x-0 top-0 z-50 bg-canvas transition-[border-color] duration-200 ${scrolled || mobile || open ? "border-b border-line" : "border-b border-transparent"}`}>
      <Container className="flex h-[88px] items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Link href="/" aria-label="Disburs home" className="text-[24px] font-semibold tracking-[-0.03em] text-ink">
            <Wordmark />
          </Link>
          <span className="hidden sm:inline-flex">
            <ModeSwitch mode="api" />
          </span>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
          {MENUS.map((m) => (
            <Dropdown key={m.label} menu={m} open={open === m.label} onToggle={() => setOpen(m.label)} onClose={() => setOpen((v) => (v === m.label ? null : v))} />
          ))}
          <Link href={SPEC} className="inline-flex h-10 items-center rounded-full px-3.5 text-[16px] text-ink hover:opacity-[0.84]">
            Docs
          </Link>
          <Link href="/developers#pricing" className="inline-flex h-10 items-center rounded-full px-3.5 text-[16px] text-ink hover:opacity-[0.84]">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden text-[16px] text-ink hover:opacity-[0.84] lg:inline-flex">
            Sign in
          </Link>
          <a href="#waitlist" className="hidden h-12 cursor-pointer items-center rounded-full bg-ink-deep px-6 text-[16px] font-medium text-white transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.98] sm:inline-flex">
            Request access
          </a>
          <button type="button" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile} onClick={() => setMobile((v) => !v)} className="inline-flex h-12 w-12 items-center justify-center text-ink xl:hidden">
            {mobile ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {mobile && (
        <div className="max-h-[calc(100dvh-88px)] overflow-y-auto border-t border-line bg-canvas xl:hidden">
          <Container className="flex flex-col py-4">
            <div className="mb-3 sm:hidden">
              <ModeSwitch mode="api" />
            </div>
            {MENUS.map((m) => {
              const on = mobileSection === m.label;
              return (
                <div key={m.label} className="border-b border-line">
                  <button type="button" aria-expanded={on} onClick={() => setMobileSection(on ? null : m.label)} className="flex h-14 w-full items-center justify-between text-[18px] text-ink">
                    {m.label}
                    <ChevronDown size={18} className={`transition-transform ${on ? "rotate-180" : ""}`} />
                  </button>
                  {on && (
                    <div className="pb-3">
                      {m.items.map((it) => (
                        <Link key={it.label} href={it.href} onClick={() => setMobile(false)} className="flex items-center justify-between gap-3 py-2.5 text-[15.5px] text-ink">
                          {it.label}
                          {it.tag && <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${TAG[it.tag]}`}>{it.tag}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link href={SPEC} className="flex h-14 items-center border-b border-line text-[18px] text-ink">
              Docs
            </Link>
            <Link href="/developers#pricing" onClick={() => setMobile(false)} className="flex h-14 items-center border-b border-line text-[18px] text-ink">
              Pricing
            </Link>
            <Link href="/sign-in" className="flex h-14 items-center text-[18px] text-ink">
              Sign in
            </Link>
            <a href="#waitlist" onClick={() => setMobile(false)} className="mt-3 inline-flex h-14 items-center justify-center rounded-full bg-ink-deep text-[17px] font-medium text-white">
              Request access
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
