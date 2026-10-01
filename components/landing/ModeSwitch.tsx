import Link from "next/link";

export type NavMode = "payroll" | "api";

const MODES: { key: NavMode; label: string; href: string }[] = [
  { key: "payroll", label: "Payroll", href: "/" },
  { key: "api", label: "API", href: "/developers" },
];

/** Two products, one nav. Moves between the payroll landing and the developer landing. */
export default function ModeSwitch({ mode }: { mode: NavMode }) {
  return (
    <div
      role="tablist"
      aria-label="Product"
      className="inline-flex h-11 items-center rounded-full border border-line bg-subtle p-1"
    >
      {MODES.map((m) => {
        const on = m.key === mode;
        return (
          <Link
            key={m.key}
            href={m.href}
            role="tab"
            aria-selected={on}
            className={`inline-flex h-9 items-center rounded-full px-4 text-[14.5px] font-medium transition-colors duration-150 ${
              on ? "bg-ink-deep text-white" : "text-muted hover:text-ink"
            }`}
          >
            {m.label}
          </Link>
        );
      })}
    </div>
  );
}
