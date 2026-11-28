"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, X } from "lucide-react";
import { kycApi } from "@/lib/api";
import { useMe } from "@/lib/hooks/useMe";
import { usdc } from "@/lib/format";

/** Remembered for this browser tab only, and cleared on sign-out, so it returns next session. */
export const KYB_NOTICE_KEY = "disburs.kybNotice.dismissed";

/**
 * A small floating notice, top right of the company app, until the business
 * check (KYB) is passed. While there is allowance left it says how much can
 * still be paid out before verification is required; once used up it says
 * payments are paused. The X hides it for this session.
 */
export default function KybNotice() {
  const { data: me } = useMe();
  const orgId = me?.organization?.id;
  const enabled = Boolean(me?.kybRequired && orgId);
  const q = useQuery({
    queryKey: ["kyb", orgId],
    queryFn: kycApi.kyb,
    enabled,
    staleTime: 15_000,
  });
  // Read on each render: the server never renders this (no profile there),
  // so there is nothing to mismatch. `bump` re-renders after hiding.
  const [, bump] = useState(0);
  const key = `${KYB_NOTICE_KEY}.${orgId}`;
  let dismissed = false;
  try {
    dismissed =
      typeof window !== "undefined" && sessionStorage.getItem(key) === "1";
  } catch {
    dismissed = false;
  }

  const s = q.data;
  if (!enabled || !s || !s.required || s.status === "APPROVED" || dismissed)
    return null;

  const left = Math.max(0, Number(s.allowanceUsdc) - Number(s.paidOutUsdc));
  const exhausted = left <= 0;
  const text =
    s.status === "IN_REVIEW"
      ? "Your business check is being reviewed."
      : s.status === "PENDING"
        ? "Finish verifying your business."
        : exhausted
          ? "Payments are paused until your business is verified."
          : `$${usdc(String(left))} USDC left to pay out before your business must be verified.`;
  const action =
    s.status === "IN_REVIEW"
      ? null
      : s.status === "PENDING"
        ? "Continue"
        : "Verify";

  const hide = () => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      /* nothing to remember into */
    }
    bump((n) => n + 1);
  };

  return (
    <div
      role="status"
      className={`fixed right-4 top-[84px] z-30 flex max-w-[360px] items-start gap-3 rounded-[18px] border px-4 py-3 text-[13.5px] leading-[1.45] shadow-[0_12px_32px_rgba(8,17,13,0.10)] md:right-8 ${exhausted ? "border-[#E8CFA0] bg-[#FBF1DC] text-[#8A5A00]" : "border-line bg-canvas text-ink"}`}
    >
      <ShieldAlert size={17} className="mt-0.5 shrink-0 opacity-70" />
      <div className="min-w-0 flex-1">
        <span>{text}</span>
        {action && (
          <>
            {" "}
            <Link
              href="/portal/verification"
              className="font-medium underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              {action}
            </Link>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={hide}
        aria-label="Hide for now"
        className="-mr-1 -mt-0.5 rounded-full p-1 opacity-60 hover:bg-subtle hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}
