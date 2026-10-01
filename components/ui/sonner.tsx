"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/** shadcn/ui Toaster (sonner), styled to the Disburs system. */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-[20px] !border !border-line !bg-canvas !text-ink !shadow-none !font-sans",
          title: "!text-[14.5px] !font-medium",
          description: "!text-[13px] !text-muted",
          actionButton:
            "!rounded-full !bg-ink-deep !text-white !text-[13px] !font-medium !h-8 !px-3",
          cancelButton:
            "!rounded-full !border !border-line !bg-canvas !text-ink !text-[13px] !h-8 !px-3",
          success: "!border-accent-soft",
          error: "!border-[#FBE5E1]",
        },
      }}
      {...props}
    />
  );
}
export { toast } from "sonner";
