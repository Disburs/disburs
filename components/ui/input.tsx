import * as React from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui Input: sharp corners, hairline border, ink focus. */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-none border border-line bg-canvas px-4 text-[15px] text-ink placeholder:text-faint focus:border-ink focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-subtle",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
