import type { ReactNode, CSSProperties } from "react";

/*
 * App primitives, on the landing design system: white canvas, #FBFBFB
 * surfaces, hairline borders, no shadows, pill buttons and badges, sharp
 * inputs, serif display numbers. The API is unchanged so pages keep working.
 */

/* ---------- Card ---------- */
export function Card({
  children,
  className = "",
  style,
  padding = 24,
  tone = "canvas",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: number;
  tone?: "canvas" | "subtle" | "dark" | "mint";
}) {
  const t = {
    canvas: "border border-line bg-canvas text-ink",
    subtle: "border border-line bg-subtle text-ink",
    dark: "on-dark bg-ink-deep text-white",
    mint: "bg-mint text-ink",
  }[tone];
  return (
    <div className={`rounded-[24px] ${t} ${className}`} style={{ padding, ...style }}>
      {children}
    </div>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h3 className="text-[16px] font-medium text-ink">{title}</h3>
      {action}
    </div>
  );
}

/* ---------- Page title ---------- */
export function PageTitle({ children, sub, action }: { children: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">{children}</h1>
        {sub && <p className="mt-2 text-[16px] text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- Badge ---------- */
type Variant = "success" | "warn" | "danger" | "neutral" | "info";

const BADGE: Record<Variant, string> = {
  success: "bg-accent-soft text-accent",
  warn: "bg-[#FBF1DC] text-[#8A5A00]",
  danger: "bg-[#FBE5E1] text-[#A32D1C]",
  neutral: "border border-line bg-subtle text-muted",
  info: "bg-[#E6EFFB] text-[#0B4C9C]",
};

export function Badge({ children, variant = "neutral", dot = false }: { children: ReactNode; variant?: Variant; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-medium ${BADGE[variant]}`}>
      {dot && <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function statusVariant(status: string): Variant {
  switch (status) {
    case "Active":
    case "Verified":
    case "Completed":
      return "success";
    case "Pending KYC":
    case "Wallet unverified":
    case "Unverified":
    case "Needs approval":
    case "Processing":
      return "warn";
    case "Contract missing":
      return "danger";
    default:
      return "neutral";
  }
}

/* ---------- Avatar ---------- */
export function Avatar({ initials, size = 36, flag }: { initials: string; size?: number; flag?: string }) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className="flex items-center justify-center rounded-full border border-line bg-subtle font-medium text-ink"
        style={{ width: size, height: size, fontSize: size * 0.34 }}
      >
        {initials}
      </span>
      {flag && (
        <span className="absolute" style={{ right: -2, bottom: -2, fontSize: size * 0.42, lineHeight: 1 }}>
          {flag}
        </span>
      )}
    </span>
  );
}

/* ---------- Stat tile ---------- */
export function StatTile({ label, value, sub, tone = "canvas" }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "canvas" | "subtle" | "dark" }) {
  const dark = tone === "dark";
  return (
    <Card tone={tone}>
      <div className={`text-[13.5px] ${dark ? "text-white/60" : "text-muted"}`}>{label}</div>
      <div className={`tabular mt-3 font-display text-[36px] font-semibold leading-none tracking-[-0.03em] ${dark ? "text-white" : "text-ink"}`}>{value}</div>
      {sub && <div className={`mt-3 text-[13px] ${dark ? "text-white/55" : "text-muted"}`}>{sub}</div>}
    </Card>
  );
}

/* ---------- Button ---------- */
export function Button({
  children,
  variant = "primary",
  full = false,
  type = "button",
  onClick,
  disabled = false,
  href,
  size = "md",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "ink";
  full?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  size?: "md" | "sm" | "lg";
}) {
  const h = { sm: "h-9 px-4 text-[13.5px]", md: "h-11 px-5 text-[14.5px]", lg: "h-14 px-8 text-[16px]" }[size];
  const v = {
    primary: "bg-mint text-ink-deep",
    ink: "bg-ink-deep text-white",
    secondary: "border border-line bg-canvas text-ink hover:border-ink",
    ghost: "text-muted hover:text-ink",
    danger: "bg-[#FBE5E1] text-[#A32D1C]",
  }[variant];
  const className = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[opacity,transform,border-color,color] duration-150 ${h} ${v} ${
    full ? "w-full" : ""
  } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-[0.88] active:scale-[0.98]"}`;

  if (href) {
    return (
      <a href={href} className={className} aria-disabled={disabled || undefined}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

/* ---------- Form field + input ---------- */
export const inputClass =
  "h-12 w-full rounded-none border border-line bg-canvas px-4 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none disabled:bg-subtle";

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-[13px] text-muted">{hint}</span>}
    </label>
  );
}

/* ---------- Hairline list row ---------- */
export function Row({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between gap-4 border-b border-line py-4 last:border-0 ${className}`}>{children}</div>;
}

/* ---------- Faux QR code (decorative, deterministic) ---------- */
export function QrCode({ size = 132 }: { size?: number }) {
  const n = 21;
  let seed = 1973;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) cells.push(rand() > 0.5);

  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, n - 7) || inBox(n - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const local = (br: number, bc: number) => {
      const lr = r - br;
      const lc = c - bc;
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
      return false;
    };
    if (r < 7 && c < 7) return local(0, 0);
    if (r < 7 && c >= n - 7) return local(0, n - 7);
    if (r >= n - 7 && c < 7) return local(n - 7, 0);
    return false;
  };

  const unit = size / n;
  return (
    <svg width={size} height={size} role="img" aria-label="Wallet QR code">
      <rect width={size} height={size} fill="#FFFFFF" />
      {cells.map((on, i) => {
        const r = Math.floor(i / n);
        const c = i % n;
        const filled = isFinder(r, c) ? finderOn(r, c) : on;
        if (!filled) return null;
        return <rect key={i} x={c * unit} y={r * unit} width={unit} height={unit} fill="#0E1A14" />;
      })}
    </svg>
  );
}
