"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Feature } from "@/lib/api";
import { useMe } from "@/lib/hooks/useMe";

/**
 * The ways a company pays people, as one group. The sidebar shows a single
 * "Payments" link; these tabs sit above each page in the group. Addresses
 * are unchanged, so bookmarks and emails keep working.
 */
export const PAYMENT_TABS: {
  label: string;
  href: string;
  feature?: Feature;
}[] = [
  { label: "Payroll", href: "/portal/payroll" },
  { label: "Invoices", href: "/portal/invoices", feature: "invoices" },
  { label: "Milestones", href: "/portal/milestones", feature: "milestones" },
  { label: "One-off", href: "/portal/pay", feature: "oneOffPay" },
  { label: "History", href: "/portal/history" },
];

export const inPayments = (pathname: string) =>
  PAYMENT_TABS.some(
    (t) => pathname === t.href || pathname.startsWith(t.href + "/"),
  );

export default function PaymentsTabs() {
  const pathname = usePathname();
  const features = useMe().data?.features;
  if (!inPayments(pathname)) return null;
  return (
    <nav
      aria-label="Payments"
      className="-mx-1 mb-7 flex gap-1 overflow-x-auto border-b border-line px-1"
    >
      {PAYMENT_TABS.filter(
        (t) => !t.feature || features?.[t.feature] !== false,
      ).map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 pb-3 pt-1 text-[14.5px] transition-colors ${
              active
                ? "border-accent font-medium text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
