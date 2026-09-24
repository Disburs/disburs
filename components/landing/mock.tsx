import Image from "next/image";
import { Check, Lock } from "lucide-react";
import type { ReactNode } from "react";

/** Product-preview primitives (decorative). Flat: hairline borders, no shadows. */

export type Member = { name: string; place: string; initials: string; avatar?: string };

export const TEAM: Member[] = [
  { name: "Kwabena Mensah", place: "Accra, GH", initials: "KM", avatar: "/avatars/kwabena.jpg" },
  { name: "Thabo Nkosi", place: "Cape Town, ZA", initials: "TN", avatar: "/avatars/thabo.jpg" },
  { name: "Wanjiru Kamau", place: "Nairobi, KE", initials: "WK", avatar: "/avatars/fatou.jpg" },
  { name: "Abena Owusu", place: "Kumasi, GH", initials: "AO" },
  { name: "Sipho Dlamini", place: "Johannesburg, ZA", initials: "SD" },
];

export function Avatar({ m, size = 32 }: { m: Member; size?: number }) {
  if (m.avatar) {
    return (
      <Image src={m.avatar} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
    );
  }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-subtle text-ink"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden
    >
      {m.initials}
    </span>
  );
}

export function Frame({
  children,
  chrome = true,
  active = "Payroll",
  className = "",
  label,
}: {
  children: ReactNode;
  chrome?: boolean;
  active?: string;
  className?: string;
  label: string;
}) {
  return (
    <div role="img" aria-label={label} className={`overflow-hidden rounded-card border border-line bg-canvas text-ink ${className}`}>
      {chrome && (
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-6">
            <span className="text-[15px] font-semibold">Disburs</span>
            <span className="hidden items-center gap-4 text-[13px] sm:flex" aria-hidden>
              {["Payroll", "Contractors", "Treasury"].map((t) => (
                <span key={t} className={t === active ? "font-medium text-ink" : "text-muted"}>
                  {t}
                </span>
              ))}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Agent active
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "ink" | "mint" }) {
  const t = {
    neutral: "border border-line bg-subtle text-muted",
    accent: "bg-accent-soft text-accent",
    ink: "bg-ink-deep text-white",
    mint: "bg-mint text-ink-deep",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-medium ${t}`}>{children}</span>;
}

export function Protected({ className = "", size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "text-[28px] gap-3" : "text-[13px] gap-1.5";
  return (
    <span className={`tabular inline-flex items-center font-mono text-ink ${s} ${className}`}>
      <Lock size={size === "lg" ? 22 : 12} className="text-accent" aria-hidden />
      <span aria-label="amount protected">••••••.••</span>
      <span className="text-muted">USDC</span>
    </span>
  );
}

export function Verified({ label = "Proof verified" }: { label?: string }) {
  return (
    <Pill tone="accent">
      <Check size={12} strokeWidth={3} aria-hidden />
      {label}
    </Pill>
  );
}

export function MockButton({ children, tone = "mint" }: { children: ReactNode; tone?: "mint" | "ink" | "ghost" }) {
  const t = { mint: "bg-mint text-ink-deep", ink: "bg-ink-deep text-white", ghost: "border border-line bg-canvas text-ink" }[tone];
  return <span className={`inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-[13.5px] font-medium ${t}`}>{children}</span>;
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      <div className="text-[12.5px] text-muted">{label}</div>
      <div className="tabular mt-1.5 text-[24px] font-semibold leading-none tracking-[-0.02em] text-ink md:text-[28px]">{value}</div>
      {sub && <div className="mt-1.5 text-[12.5px] text-muted">{sub}</div>}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[16px] border border-line bg-subtle p-4 ${className}`}>{children}</div>;
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`text-[12.5px] text-muted ${className}`}>{children}</div>;
}
