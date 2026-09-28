"use client";

import type { ReactNode, CSSProperties } from "react";
import { Card as UiCard } from "@/components/ui/card";
import {
  Badge as UiBadge,
  type BadgeProps as UiBadgeProps,
} from "@/components/ui/badge";
import {
  Avatar as UiAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/*
 * App-level conveniences on top of the shadcn/ui primitives in components/ui.
 * Pages may use either; these keep the older call sites (tone, padding, href,
 * full, statusVariant) working while everything renders through shadcn.
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
    canvas: "",
    subtle: "bg-subtle",
    dark: "on-dark border-transparent bg-ink-deep text-white",
    mint: "border-transparent bg-mint text-ink",
  }[tone];
  return (
    <UiCard className={cn(t, className)} style={{ padding, ...style }}>
      {children}
    </UiCard>
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
    <div className="mb-4 flex items-center justify-between gap-4">
      <h3 className="text-[16px] font-medium text-ink">{title}</h3>
      {action}
    </div>
  );
}

/* ---------- Page title ---------- */
export function PageTitle({
  children,
  sub,
  action,
}: {
  children: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
          {children}
        </h1>
        {sub && <p className="mt-2 text-[16px] text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- Badge ---------- */
type Variant = "success" | "warn" | "danger" | "neutral" | "info";

export function Badge({
  children,
  variant = "neutral",
  dot = false,
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}) {
  return (
    <UiBadge
      variant={variant as UiBadgeProps["variant"]}
      dot={dot}
      className={className}
    >
      {children}
    </UiBadge>
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
  src,
}: {
  initials: string;
  size?: number;
  flag?: string;
  src?: string | null;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <UiAvatar style={{ width: size, height: size }}>
        {src && <AvatarImage src={src} alt="" />}
        <AvatarFallback style={{ fontSize: size * 0.34 }}>
          {initials}
        </AvatarFallback>
      </UiAvatar>
      {flag && (
        <span
          className="absolute"
          style={{
            right: -2,
            bottom: -2,
            fontSize: size * 0.42,
            lineHeight: 1,
          }}
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
  tone = "canvas",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "canvas" | "subtle" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Card tone={tone}>
      <div className={`text-[13.5px] ${dark ? "text-white/60" : "text-muted"}`}>
        {label}
      </div>
      <div
        className={`tabular mt-3 font-display text-[36px] font-semibold leading-none tracking-[-0.03em] ${dark ? "text-white" : "text-ink"}`}
      >
        {value}
      </div>
      {sub && (
        <div
          className={`mt-3 text-[13px] ${dark ? "text-white/55" : "text-muted"}`}
        >
          {sub}
        </div>
      )}
    </Card>
  );
}

/* ---------- Form field + input ---------- */
/** Class string for a bare <input>/<select>; prefer `Input`/`Select` from components/ui. */
export const inputClass =
  "h-12 w-full rounded-none border border-line bg-canvas px-4 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none disabled:bg-subtle";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Label className="block">
      <span className="mb-2 block text-[14px] font-medium text-ink">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-2 block text-[13px] font-normal text-muted">
          {hint}
        </span>
      )}
    </Label>
  );
}
