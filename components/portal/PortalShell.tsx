"use client";

import { useState } from "react";
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
  Search,
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
  { label: "Agent Chat", href: "/portal/chat", icon: MessageSquare },
  { label: "Contractors", href: "/portal/contractors", icon: Users },
  { label: "Payroll", href: "/portal/payroll", icon: ReceiptText },
  { label: "History", href: "/portal/history", icon: History },
  { label: "Wallet", href: "/portal/wallet", icon: Wallet },
  { label: "Settings", href: "/portal/settings", icon: Settings },
];

const TITLES: Record<string, string> = {
  "/portal": "Dashboard",
  "/portal/chat": "Agent Chat",
  "/portal/contractors": "Contractors",
  "/portal/contractors/new": "Add Contractor",
  "/portal/payroll": "Payroll Run",
  "/portal/history": "Payment History",
  "/portal/wallet": "Wallet & Funding",
  "/portal/settings": "Agent Settings",
};

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/portal" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-3 transition-colors"
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: active ? 500 : 400,
              background: active ? "#DEF6E9" : "transparent",
              color: active ? "#0A7A1E" : "#5C6068",
            }}
          >
            <Icon size={18} color={active ? "#0A9200" : "#8A8F98"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Wordmark() {
  return (
    <span className="font-medium" style={{ fontSize: "19px", color: "#1A1A1A" }}>
      disburs<span style={{ color: "#12FF80" }}>.</span>
    </span>
  );
}

function WalletMini() {
  return (
    <Link
      href="/portal/wallet"
      className="block"
      style={{
        background: "#F7F8F9",
        border: "1px solid #E8E8E8",
        borderRadius: "12px",
        padding: "14px",
      }}
    >
      <div style={{ fontSize: "12px", color: "#8A8F98" }}>USDC balance</div>
      <div
        className="mt-1 font-medium"
        style={{ fontSize: "20px", color: "#1A1A1A" }}
      >
        ${fmt(company.balance)}
      </div>
      <div
        className="mt-2 flex items-center gap-1.5 font-medium"
        style={{ fontSize: "12px", color: "#A66A00" }}
      >
        <span
          className="inline-block rounded-full"
          style={{ width: "6px", height: "6px", background: "#A66A00" }}
        />
        Top up before Dec 1
      </div>
    </Link>
  );
}

export default function PortalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <div style={{ background: "#F7F8F9", minHeight: "100vh" }}>
      {/* Desktop sidebar */}
      <aside
        className="fixed left-0 top-0 z-30 hidden h-full flex-col lg:flex"
        style={{
          width: "256px",
          background: "#FFFFFF",
          borderRight: "1px solid #E8E8E8",
          padding: "20px 16px",
        }}
      >
        <div className="px-2 pb-6">
          <Wordmark />
        </div>
        <div className="flex-1">
          <NavList />
        </div>
        <div className="mt-4">
          <WalletMini />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 flex h-full flex-col"
            style={{
              width: "256px",
              background: "#FFFFFF",
              borderRight: "1px solid #E8E8E8",
              padding: "20px 16px",
            }}
          >
            <div className="flex items-center justify-between px-2 pb-6">
              <Wordmark />
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={20} color="#1A1A1A" />
              </button>
            </div>
            <div className="flex-1">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
            <div className="mt-4">
              <WalletMini />
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-[256px]">
        {/* Topbar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between gap-4"
          style={{
            height: "68px",
            background: "rgba(247,248,249,0.85)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #E8E8E8",
            padding: "0 20px",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} color="#1A1A1A" />
            </button>
            <h1
              className="font-medium"
              style={{ fontSize: "18px", color: "#1A1A1A" }}
            >
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="hidden items-center gap-2 sm:flex"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                borderRadius: "8px",
                padding: "0 12px",
                height: "38px",
                width: "220px",
              }}
            >
              <Search size={16} color="#8A8F98" />
              <input
                placeholder="Search…"
                className="w-full bg-transparent outline-none"
                style={{ fontSize: "14px", color: "#1A1A1A" }}
              />
            </div>
            <span
              className="hidden items-center gap-1.5 sm:inline-flex font-medium"
              style={{
                background: "#DEF6E9",
                color: "#0A9200",
                borderRadius: "8px",
                padding: "7px 10px",
                fontSize: "12px",
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: "6px", height: "6px", background: "#12FF80" }}
              />
              Agent active
            </span>
            <button
              className="relative flex items-center justify-center"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
              }}
              aria-label="Notifications"
            >
              <Bell size={18} color="#5C6068" />
              <span
                className="absolute rounded-full"
                style={{
                  top: "8px",
                  right: "9px",
                  width: "7px",
                  height: "7px",
                  background: "#12FF80",
                  border: "1.5px solid #FFFFFF",
                }}
              />
            </button>
            <div className="flex items-center gap-2">
              <Avatar initials={company.initials} size={36} />
              <div className="hidden md:block">
                <div
                  className="font-medium"
                  style={{ fontSize: "13px", color: "#1A1A1A", lineHeight: 1.2 }}
                >
                  {company.name}
                </div>
                <div style={{ fontSize: "11px", color: "#8A8F98" }}>
                  {company.plan} plan
                </div>
              </div>
            </div>
          </div>
        </header>

        <main style={{ padding: "28px 20px 64px", maxWidth: "1280px" }}>
          {children}
        </main>
      </div>

      {/* Floating "new" shortcut on small screens */}
      <Link
        href="/portal/contractors/new"
        className="fixed bottom-6 right-6 z-20 flex items-center justify-center lg:hidden"
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "9999px",
          background: "#12FF80",
          boxShadow: "rgba(0,0,0,0.12) 0px 6px 16px 0px",
        }}
        aria-label="Add contractor"
      >
        <Plus size={24} color="#1A1A1A" />
      </Link>
    </div>
  );
}
