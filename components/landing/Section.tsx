import type { ReactNode } from "react";

/** Shared layout scaffolding so every section shares one rhythm. */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-container px-6 md:px-10 ${className}`}>{children}</div>;
}

/** Small uppercase label above a heading. `tone` matches the surface it sits on. */
export function Eyebrow({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const color = tone === "dark" ? "text-mint" : "text-accent";
  return (
    <span
      className={`inline-block font-mono text-[12px] font-medium uppercase tracking-[0.14em] ${color} ${className}`}
    >
      {children}
    </span>
  );
}

export function Heading({
  children,
  tone = "light",
  size = "md",
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  size?: "md" | "lg";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const color = tone === "dark" ? "text-white" : "text-ink";
  const scale =
    size === "lg"
      ? "text-[2.75rem] leading-[1.02] md:text-[3.75rem] lg:text-[4.5rem]"
      : "text-[2rem] leading-[1.08] md:text-[2.5rem] lg:text-[2.75rem]";
  return (
    <Tag
      className={`font-display font-semibold tracking-[-0.03em] text-balance ${scale} ${color} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Lead({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const color = tone === "dark" ? "text-white/70" : "text-muted";
  return (
    <p className={`text-[17px] leading-[1.6] md:text-[19px] text-pretty ${color} ${className}`}>
      {children}
    </p>
  );
}
