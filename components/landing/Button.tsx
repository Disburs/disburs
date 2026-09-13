import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "mint" | "ink" | "ghost-dark" | "ghost-light";

const styles: Record<Variant, string> = {
  mint: "bg-mint text-ink-deep hover:bg-[#3dff96]",
  ink: "bg-ink text-white hover:bg-[#1a2a22]",
  "ghost-dark": "border border-white/20 text-white hover:border-white/40",
  "ghost-light": "border border-ink/20 text-ink hover:border-ink/50",
};

/**
 * A link styled as a button. Waitlist CTAs use `href="#waitlist"`, which the
 * global WaitlistModal intercepts and opens. 48px tall for comfortable touch.
 */
export default function LinkButton({
  href,
  children,
  variant = "ink",
  arrow = false,
  className = "",
  size = "md",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  size?: "md" | "lg";
}) {
  const h = size === "lg" ? "h-[50px] px-6 text-[15.5px]" : "h-12 px-5 text-[15px]";
  return (
    <a
      href={href}
      className={`group inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 ${h} ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <ArrowRight
          size={16}
          strokeWidth={2}
          className="transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
    </a>
  );
}
