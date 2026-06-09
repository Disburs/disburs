import type { ReactNode, CSSProperties } from "react";

/* ---------- Card ---------- */
export function Card({
  children,
  className = "",
  style,
  padding = 24,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: number;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E8",
        borderRadius: "16px",
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
        {title}
      </h3>
      {action}
    </div>
  );
}

/* ---------- Badge ---------- */
type Variant = "success" | "warn" | "danger" | "neutral" | "info";

const BADGE_STYLES: Record<Variant, { bg: string; color: string }> = {
  success: { bg: "#DEF6E9", color: "#0A9200" },
  warn: { bg: "#FBEFD6", color: "#A66A00" },
  danger: { bg: "#FDE6E2", color: "#B42318" },
  neutral: { bg: "#F0F1F3", color: "#5C6068" },
  info: { bg: "#E6EFFB", color: "#0550AE" },
};

export function Badge({
  children,
  variant = "neutral",
  dot = false,
}: {
  children: ReactNode;
  variant?: Variant;
  dot?: boolean;
}) {
  const s = BADGE_STYLES[variant];
  return (
    <span
      className="inline-flex items-center gap-1.5 font-medium"
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: "6px",
        padding: "3px 9px",
        fontSize: "12px",
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          className="inline-block rounded-full"
          style={{ width: "6px", height: "6px", background: s.color }}
        />
      )}
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
export function Avatar({
  initials,
  size = 36,
  flag,
}: {
  initials: string;
  size?: number;
  flag?: string;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className="flex items-center justify-center font-medium"
        style={{
          width: size,
          height: size,
          borderRadius: "9999px",
          background: "#F0F1F3",
          color: "#1A1A1A",
          fontSize: size * 0.36,
        }}
      >
        {initials}
      </span>
      {flag && (
        <span
          className="absolute"
          style={{ right: -2, bottom: -2, fontSize: size * 0.42, lineHeight: 1 }}
        >
          {flag}
        </span>
      )}
    </span>
  );
}

/* ---------- Stat tile ---------- */
export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Card>
      <div style={{ fontSize: "13px", color: "#8A8F98" }}>{label}</div>
      <div
        className="mt-2 font-medium"
        style={{ fontSize: "28px", color: "#1A1A1A", lineHeight: 1.1 }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "12px", color: "#8A8F98", marginTop: "4px" }}>
          {sub}
        </div>
      )}
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
  variant?: "primary" | "secondary" | "ghost" | "danger";
  full?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  size?: "md" | "sm";
}) {
  const base: CSSProperties = {
    height: size === "sm" ? "34px" : "40px",
    padding: size === "sm" ? "0 14px" : "0 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    width: full ? "100%" : undefined,
    transition: "transform 150ms ease, background 150ms ease",
  };
  const variants: Record<string, CSSProperties> = {
    primary: { background: "#12FF80", color: "#1A1A1A" },
    secondary: {
      background: "#FFFFFF",
      color: "#1A1A1A",
      border: "1px solid #E8E8E8",
    },
    ghost: { background: "transparent", color: "#5C6068" },
    danger: { background: "#FDE6E2", color: "#B42318" },
  };
  const style = { ...base, ...variants[variant] };
  const className = "hover:brightness-[0.98] active:scale-[0.99]";

  if (href) {
    return (
      <a href={href} style={style} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
    >
      {children}
    </button>
  );
}

/* ---------- Faux QR code (decorative, deterministic) ---------- */
export function QrCode({ size = 132 }: { size?: number }) {
  const n = 21;
  // deterministic pseudo-random grid from a fixed seed (no Math.random)
  let seed = 1973;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) cells.push(rand() > 0.5);

  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7;
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
        return (
          <rect
            key={i}
            x={c * unit}
            y={r * unit}
            width={unit}
            height={unit}
            fill="#1A1A1A"
            rx={unit * 0.18}
          />
        );
      })}
    </svg>
  );
}
