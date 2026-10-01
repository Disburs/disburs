import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** A native select styled like the Input (no popover; keyboard and mobile friendly). */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full appearance-none rounded-none border border-line bg-canvas px-4 pr-10 text-[15px] text-ink focus:border-ink focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
    />
  </div>
));
Select.displayName = "Select";

export { Select };
