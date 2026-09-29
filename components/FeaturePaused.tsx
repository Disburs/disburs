import { PauseCircle } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Shown where a product feature would be when Disburs staff have switched it
 * off in the admin console. The backend refuses the action either way; this
 * just says so before anyone fills in a form.
 */
export default function FeaturePaused({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-[16px] border border-line bg-subtle px-5 py-4"
    >
      <PauseCircle size={20} className="mt-0.5 shrink-0 text-muted" />
      <div>
        <div className="text-[15px] font-medium text-ink">{title}</div>
        <p className="mt-1 text-[14px] leading-[1.55] text-muted">
          {children ??
            "Disburs has switched this off for now. Nothing you already have is affected. Check back soon."}
        </p>
      </div>
    </div>
  );
}
