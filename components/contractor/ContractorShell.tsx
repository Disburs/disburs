"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ArrowLeftRight, MessageCircle, Menu, X, type LucideIcon } from "lucide-react";
import { contractor, ngn } from "@/lib/contractor";
import { Avatar } from "@/components/portal/ui";

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/contractor", icon: Home },
  { label: "Cash out", href: "/contractor/cashout", icon: ArrowLeftRight },
  { label: "Messages", href: "/contractor/messages", icon: MessageCircle },
];

function Wordmark() {
  return (
    <span className="font-medium" style={{ fontSize: "19px", color: "#1A1A1A" }}>
      disburs<span style={{ color: "#12FF80" }}>.</span>
    </span>
  );
}

export default function ContractorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isOnboarding = pathname?.startsWith("/contractor/onboarding");

  // Onboarding: minimal chrome (logo + skip), centered web layout.
  if (isOnboarding) {
    return (
      <div style={{ background: "#F7F8F9", minHeight: "100vh" }}>
        <header
          className="flex items-center justify-between"
          style={{ height: "64px", padding: "0 24px", background: "#FFFFFF", borderBottom: "1px solid #ECEDEF" }}
        >
          <Wordmark />
          <a href="/contractor" style={{ fontSize: "13px", color: "#8A8F98" }}>
            Skip setup
          </a>
        </header>
        <div className="mx-auto" style={{ maxWidth: "640px", padding: "40px 20px 80px" }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F7F8F9", minHeight: "100vh" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-30"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #ECEDEF" }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-4"
          style={{ maxWidth: "1120px", height: "64px", padding: "0 24px" }}
        >
          <div className="flex items-center gap-8">
            <Link href="/contractor" className="flex items-center gap-2">
              <Wordmark />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/contractor" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 transition-colors"
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: active ? 500 : 400,
                      background: active ? "#DEF6E9" : "transparent",
                      color: active ? "#0A7A1E" : "#5C6068",
                    }}
                  >
                    <Icon size={16} color={active ? "#0A9200" : "#8A8F98"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contractor/cashout"
              className="hidden items-center gap-2 sm:flex"
              style={{
                background: "#F7F8F9",
                border: "1px solid #ECEDEF",
                borderRadius: "9px",
                padding: "7px 12px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#8A8F98" }}>Balance</span>
              <span className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
                ${ngn(contractor.balance)}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Avatar initials={contractor.initials} size={34} flag={contractor.flag} />
              <div className="hidden lg:block">
                <div className="font-medium" style={{ fontSize: "13px", color: "#1A1A1A", lineHeight: 1.2 }}>
                  {contractor.firstName}
                </div>
                <div style={{ fontSize: "11px", color: "#8A8F98" }}>
                  via {contractor.employer}
                </div>
              </div>
            </div>
            <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X size={22} color="#1A1A1A" /> : <Menu size={22} color="#1A1A1A" />}
            </button>
          </div>
        </div>

        {/* mobile nav */}
        {open && (
          <nav className="flex flex-col gap-1 md:hidden" style={{ padding: "8px 16px 16px", borderTop: "1px solid #ECEDEF" }}>
            {NAV.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/contractor" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3"
                  style={{
                    padding: "11px 12px",
                    borderRadius: "8px",
                    fontSize: "15px",
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
        )}
      </header>

      <main className="mx-auto" style={{ maxWidth: "1120px", padding: "28px 24px 64px" }}>
        {children}
      </main>
    </div>
  );
}
