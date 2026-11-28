"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { kycApi, type KycStatus } from "@/lib/api";
import { useMe } from "@/lib/hooks/useMe";
import { usdc } from "@/lib/format";

const COPY: Record<
  Exclude<KycStatus, "APPROVED">,
  { title: string; action: string | null }
> = {
  NONE: { title: "Verify your business", action: "Verify business" },
  PENDING: { title: "Finish verifying your business", action: "Continue" },
  IN_REVIEW: { title: "Your business check is being reviewed", action: null },
  DECLINED: {
    title: "Your business check was not accepted",
    action: "Try again",
  },
  EXPIRED: { title: "Your business check ran out", action: "Verify business" },
};

/**
 * Shown on the company dashboard until the business is verified. Until then
 * the organization may pay out a small allowance; the banner shows how much
 * of it is used. The check runs on the provider's page and comes back to
 * ?kyb=done, where we wait for the result.
 */
export default function KybBanner() {
  const { data: me } = useMe();
  const returned = useSearchParams().get("kyb") === "done";
  const enabled = Boolean(me?.kybRequired && me?.organization);
  const q = useQuery({
    queryKey: ["kyb", me?.organization?.id],
    queryFn: kycApi.kyb,
    enabled,
    staleTime: 15_000,
  });
  const standing = q.data;
  const status = standing?.status;
  const start = useMutation({
    mutationFn: kycApi.startKyb,
    onSuccess: ({ url }) => window.location.assign(url),
  });

  const waiting = returned && status === "PENDING";
  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(() => void q.refetch(), 4000);
    return () => clearInterval(t);
  }, [waiting, q]);

  if (!enabled || !standing || !status || !standing.required) return null;
  // The floating KybNotice shows the standing everywhere; this banner only
  // covers the moment someone returns from the provider.
  if (!returned) return null;
  if (status === "APPROVED")
    return returned ? (
      <div
        role="status"
        className="flex items-center gap-3 rounded-[24px] border border-line bg-subtle px-5 py-4 text-[14.5px] text-ink"
      >
        <ShieldCheck size={18} className="shrink-0 text-accent" />
        Your business is verified. There is no limit on what you can pay out.
      </div>
    ) : null;

  const paid = Number(standing.paidOutUsdc);
  const allowance = Number(standing.allowanceUsdc);
  const exhausted = paid >= allowance;
  const copy = COPY[status];
  const body = waiting
    ? "This usually takes a few minutes. You can stay on this page."
    : status === "IN_REVIEW"
      ? "A person is looking at it. There is nothing more to do; payments past the allowance wait until it is decided."
      : exhausted
        ? `You have paid out $${usdc(standing.paidOutUsdc)} of the $${usdc(standing.allowanceUsdc)} USDC allowed before verification. Payments are paused until the business is verified.`
        : `You can pay out up to $${usdc(standing.allowanceUsdc)} USDC before verifying ($${usdc(standing.paidOutUsdc)} so far). Verifying takes a few minutes: company details and an ID for a director.`;

  return (
    <div
      role="status"
      className={`flex flex-col gap-4 rounded-[24px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${exhausted && !waiting ? "bg-[#FBF1DC] text-[#8A5A00]" : "border border-line bg-subtle"}`}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 opacity-70" />
        <div>
          <div className="text-[15px] font-medium">
            {waiting ? "Checking your result" : copy.title}
          </div>
          <div className="mt-0.5 text-[14px] opacity-80">{body}</div>
          {start.isError && (
            <div className="mt-1 text-[13.5px] text-[#A32D1C]">
              {(start.error as Error).message}
            </div>
          )}
        </div>
      </div>
      {copy.action && !waiting && standing.canManage && (
        <Button
          onClick={() => start.mutate()}
          disabled={start.isPending || start.isSuccess}
          className="shrink-0"
        >
          {start.isPending || start.isSuccess ? "Opening" : copy.action}
        </Button>
      )}
    </div>
  );
}
