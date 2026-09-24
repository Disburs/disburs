"use client";

import { useState } from "react";
import Brand from "@/components/Wordmark";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  ReceiptText,
  History,
  Wallet,
  Settings,
  Bell,
  Menu,
  X,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { company } from "@/lib/mock";
import { Avatar } from "./ui";

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { label: "Agent chat", href: "/portal/chat", icon: MessageSquare },
  { label: "Contractors", href: "/portal/contractors", icon: Users },
  { label: "Payroll", href: "/portal/payroll", icon: ReceiptText },
  { label: "History", href: "/portal/history", icon: History },
  { label: "Wallet", href: "/portal/wallet", icon: Wallet },
  { label: "Settings", href: "/portal/settings", icon: Settings },
];

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function Wordmark() {
  return (
    <Link href="/portal" className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
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
        const active = pathname === item.href || (item.href !== "/portal" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex h-11 items-center gap-3 rounded-full px-4 text-[14.5px] transition-colors duration-150 ${
              active ? "border border-line bg-canvas font-medium text-ink" : "text-muted hover:text-ink"
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
  return (
    <Link href="/portal/wallet" className="block rounded-[20px] border border-line bg-canvas p-4 transition-colors hover:border-ink">
      <div className="text-[12.5px] text-muted">Treasury</div>
      <div className="tabular mt-1.5 font-display text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink">${fmt(company.balance)}</div>
      <div className="mt-1 text-[12px] text-muted">USDC</div>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FBF1DC] px-2.5 py-1 text-[12px] font-medium text-[#8A5A00]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
        Top up before Dec 1
      </div>
    </Link>
  );
}

function Sidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col border-r border-line bg-subtle p-5">
      <div className="flex items-center justify-between px-2 pb-8">
        <Wordmark />
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full text-ink">
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex-1">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="mt-4">
        <WalletMini />
      </div>
    </div>
  );
}

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-[264px] lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-deep/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[280px]">
            <Sidebar onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-4 border-b border-line bg-canvas px-5 md:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <Brand className="text-[20px] font-semibold tracking-[-0.03em] text-ink lg:hidden" />
            <span className="hidden items-center gap-1.5 text-[13px] text-accent lg:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              Agent active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-mint ring-2 ring-canvas" />
            </button>
            <div className="flex items-center gap-2.5">
              <Avatar initials={company.initials} size={38} />
              <div className="hidden md:block">
                <div className="text-[13.5px] font-medium leading-tight text-ink">{company.name}</div>
                <div className="text-[12px] text-muted">{company.plan} plan</div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1240px] px-5 pb-20 pt-8 md:px-8 md:pt-10">{children}</main>
      </div>

      <Link
        href="/portal/contractors/new"
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink-deep lg:hidden"
        aria-label="Add contractor"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}
