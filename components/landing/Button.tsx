import type { ReactNode } from "react";

type Variant = "mint" | "ink" | "outline" | "outline-dark" | "dark-soft";

const styles: Record<Variant, string> = {
  mint: "bg-mint text-ink-deep",
  ink: "bg-ink-deep text-white",
  outline: "border border-ink text-ink bg-transparent",
  "outline-dark": "border border-white/50 text-white bg-transparent",
  "dark-soft": "bg-white/10 text-mint",
};

/**
 * Pill button-link. Flat, no shadow; hover dims to 0.88, press scales to 0.98.
 * Waitlist CTAs use `href="#waitlist"`, which the global modal intercepts.
 */
export default function LinkButton({
  href,
  children,
  variant = "ink",
  className = "",
  size = "md",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const h = { sm: "h-12 px-6 text-[15px]", md: "h-14 px-8 text-[17px]", lg: "h-[64px] px-10 text-[19px]" }[size];
  return (
    <a
      href={href}
      className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full font-medium transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.98] ${h} ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
