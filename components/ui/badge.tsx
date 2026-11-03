import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** shadcn/ui Badge with the Disburs status palette. */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        success: "bg-accent-soft text-accent",
        warn: "bg-[#FBF1DC] text-[#8A5A00]",
        danger: "bg-[#FBE5E1] text-[#A32D1C]",
        destructive: "bg-[#FBE5E1] text-[#A32D1C]",
        info: "bg-[#E6EFFB] text-[#0B4C9C]",
        neutral: "border border-line bg-subtle text-muted",
        secondary: "border border-line bg-subtle text-muted",
        outline: "border border-line text-ink",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Leading status dot. */
  dot?: boolean;
}

function Badge({
  className,
  variant,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
