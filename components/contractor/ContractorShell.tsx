"use client";

import { useState } from "react";
import Brand from "@/components/Wordmark";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, ArrowLeftRight, MessageCircle, Menu, X, type LucideIcon } from "lucide-react";
import { useMe, useRequireProfile } from "@/lib/hooks/useMe";
import { usdc } from "@/lib/format";
import UsdcMark from "@/components/UsdcMark";
import { Avatar } from "@/components/portal/ui";
import { authClient } from "@/lib/auth-client";

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/contractor", icon: Home },
  { label: "Cash out", href: "/contractor/cashout", icon: ArrowLeftRight },
  { label: "Messages", href: "/contractor/messages", icon: MessageCircle },
];

function Wordmark() {
  return (
    <Link href="/contractor" className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
      <Brand />
    </Link>
  );
}

export default function ContractorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isOnboarding = pathname?.startsWith("/contractor/onboarding");

  const isActive = (href: string) => pathname === href || (href !== "/contractor" && pathname?.startsWith(href + "/"));
  // Signed out → sign in. Signed in without a payee profile → contractor onboarding.
  // The onboarding route itself only needs a session.
  const { ready } = useRequireProfile(
    isOnboarding ? {} : { need: "contractor", onboarding: "/contractor/onboarding" },
  );
  const { data: me } = useMe();
  const payee = me?.contractor ?? null;
  const initials = (payee?.name ?? me?.user.email ?? "?")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!ready) return <div className="min-h-screen bg-canvas" aria-busy="true" />;

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-canvas">
        <header className="flex h-[72px] items-center justify-between border-b border-line px-5 md:px-8">
          <Wordmark />
          <button
            type="button"
            onClick={async () => {
              await authClient.signOut();
              router.replace("/sign-in");
            }}
            className="text-[14px] text-muted hover:text-ink"
          >
            Log out
          </button>
        </header>
        <div className="mx-auto max-w-[680px] px-5 pb-24 pt-12">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas">
        <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-10">
            <Wordmark />
            <nav className="hidden items-center gap-1 md:flex" aria-label="Contractor">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-10 items-center gap-2 rounded-full px-4 text-[14.5px] transition-colors ${
                      active ? "border border-line bg-subtle font-medium text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-accent" : "text-faint"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/contractor/cashout" className="hidden h-10 items-center gap-2 rounded-full border border-line px-4 sm:flex">
              <UsdcMark size={16} />
              <span className="text-[12.5px] text-muted">Balance</span>
              <span className="tabular text-[14px] font-medium text-ink">{payee?.wallet?.balances?.usdc == null ? "—" : `$${usdc(payee.wallet.balances.usdc)}`}</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <Avatar initials={initials} size={36} />
              <div className="hidden lg:block">
                <div className="text-[13.5px] font-medium leading-tight text-ink">{payee?.name?.split(" ")[0] ?? "—"}</div>
                <div className="text-[12px] text-muted">{payee ? `${payee.country} · ${payee.payoutCurrency}` : ""}</div>
              </div>
            </div>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="flex flex-col border-t border-line px-5 py-3 md:hidden" aria-label="Contractor">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex h-12 items-center gap-3 border-b border-line text-[15px] last:border-0 ${active ? "font-medium text-ink" : "text-muted"}`}
                >
                  <Icon size={18} className={active ? "text-accent" : "text-faint"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-[1120px] px-5 pb-20 pt-8 md:px-8 md:pt-10">{children}</main>
    </div>
  );
}
