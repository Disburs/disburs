import type { ReactNode } from "react";

/** Shared layout + type scaffolding. */

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-container px-4 md:px-8 ${className}`}>{children}</div>;
}

/** Serif display heading. `size`: xl (hero), lg (section), md (sub-section). */
export function Heading({
  children,
  tone = "light",
  size = "lg",
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  size?: "xl" | "lg" | "md";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const color = tone === "dark" ? "text-white" : "text-ink";
  const scale = {
    xl: "text-[56px] leading-[1.02] tracking-[-0.035em] md:text-[84px] lg:text-[100px]",
    lg: "text-[44px] leading-[1.06] tracking-[-0.03em] md:text-[64px] lg:text-[80px]",
    md: "text-[36px] leading-[1.1] tracking-[-0.02em] md:text-[48px]",
  }[size];
  return <Tag className={`font-display font-semibold text-balance ${scale} ${color} ${className}`}>{children}</Tag>;
}

/** Italic emphasis inside a serif heading. */
export function Em({ children }: { children: ReactNode }) {
  return <em className="font-medium italic">{children}</em>;
}

/** Large, light body copy under headings. */
export function Lead({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const color = tone === "dark" ? "text-white/75" : "text-ink";
  return (
    <p className={`text-[20px] font-light leading-[1.35] tracking-[-0.01em] text-pretty md:text-[26px] ${color} ${className}`}>
      {children}
    </p>
  );
}

/** Small label (kept for pricing/FAQ). */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-block text-[15px] font-medium text-muted ${className}`}>{children}</span>;
}
