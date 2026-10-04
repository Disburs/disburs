"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import Brand from "@/components/Wordmark";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  ReceiptText,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useMe, useRequireProfile } from "@/lib/hooks/useMe";
import { usdc } from "@/lib/format";
import UsdcMark from "@/components/UsdcMark";
import { Avatar } from "./ui";
import OrgSwitcher from "./OrgSwitcher";
import PaymentsTabs, { inPayments } from "./PaymentsTabs";

/** Six destinations. Everything about paying people lives under Payments. */
const NAV: {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Also active on these paths (the pages grouped under this link). */
  group?: (pathname: string) => boolean;
}[] = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { label: "Contractors", href: "/portal/contractors", icon: Users },
  {
    label: "Payments",
    href: "/portal/payroll",
    icon: ReceiptText,
    group: inPayments,
  },
  { label: "Treasury", href: "/portal/wallet", icon: Wallet },
  { label: "Team", href: "/portal/team", icon: UsersRound },
  { label: "Settings", href: "/portal/settings", icon: Settings },
];

function Wordmark() {
  return (
    <Link
      href="/portal"
      className="text-[22px] font-semibold tracking-[-0.03em] text-ink"
    >
      <Brand />
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1" aria-label="Portal">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/portal" && pathname.startsWith(item.href + "/")) ||
          Boolean(item.group?.(pathname));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex h-11 items-center gap-3 rounded-full px-4 text-[14.5px] transition-colors duration-150 ${
              active
                ? "border border-line bg-canvas font-medium text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            <Icon size={17} className={active ? "text-accent" : "text-faint"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function WalletMini() {
  const { data: me } = useMe();
  const wallet = me?.organization?.treasuryWallet ?? null;
  const bal = wallet?.balances?.usdc;
  return (
    <Link
      href="/portal/wallet"
      className="block rounded-[20px] border border-line bg-canvas p-4 transition-colors hover:border-ink"
    >
      <div className="text-[12.5px] text-muted">Treasury</div>
      <div className="tabular mt-1.5 font-display text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink">
        {bal == null ? "—" : `$${usdc(bal)}`}
      </div>
      <div className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-muted">
        <UsdcMark size={14} /> USDC · {me?.network ?? "testnet"}
      </div>
      {wallet && !wallet.isActivated && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FBF1DC] px-2.5 py-1 text-[12px] font-medium text-[#8A5A00]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          Not activated
        </div>
      )}
    </Link>
  );
}

function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const signOut = async () => {
    setBusy(true);
    await authClient.signOut();
    router.replace("/sign-in");
  };
  return (
    <Button
      variant="ghost"
      onClick={signOut}
      disabled={busy}
      className="h-11 w-full justify-start gap-3 px-4 text-[14.5px] font-normal"
    >
      <LogOut size={17} className="text-faint" />
      {busy ? "Signing out…" : "Log out"}
    </Button>
  );
}

function Sidebar({
  onNavigate,
  onClose,
}: {
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col border-r border-line bg-subtle p-5">
      <div className="flex items-center justify-between px-2 pb-8">
        <Wordmark />
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
            className="h-10 w-10"
          >
            <X size={20} />
          </Button>
        )}
      </div>
      <div className="mb-5">
        <OrgSwitcher />
      </div>
      <div className="flex-1">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="mt-4">
        <WalletMini />
      </div>
      <div className="mt-2">
        <SignOutButton />
      </div>
    </div>
  );
}

export default function PortalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // Signed out → sign in. Signed in without an organization → employer onboarding.
  const { ready } = useRequireProfile({
    need: "organization",
    onboarding: "/onboarding",
    needName: true,
  });
  const { data: me } = useMe();
  const orgInitials = (me?.organization?.name ?? "?")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!ready)
    return <div className="min-h-screen bg-canvas" aria-busy="true" />;

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-[264px] lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-deep/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[280px]">
            <Sidebar
              onNavigate={() => setOpen(false)}
              onClose={() => setOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-4 border-b border-line bg-canvas px-5 md:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="h-10 w-10 lg:hidden"
            >
              <Menu size={22} />
            </Button>
            <Brand className="text-[20px] font-semibold tracking-[-0.03em] text-ink lg:hidden" />
            <span className="hidden items-center gap-1.5 text-[13px] text-muted lg:inline-flex">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden
              />
              Stellar {me?.network ?? "testnet"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar
                initials={orgInitials}
                size={38}
                src={me?.organization?.logo}
              />
              <div className="hidden md:block">
                <div className="text-[13.5px] font-medium leading-tight text-ink">
                  {me?.organization?.name ?? "—"}
                </div>
                <div className="text-[12px] text-muted">
                  {me?.user.email ?? ""}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1240px] px-5 pb-20 pt-8 md:px-8 md:pt-10">
          <PaymentsTabs />
          {children}
        </main>
      </div>
    </div>
  );
}
