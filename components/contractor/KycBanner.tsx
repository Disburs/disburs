"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { kycApi, type KycStatus } from "@/lib/api";
import { ME_KEY, useMe } from "@/lib/hooks/useMe";

const COPY: Record<
  Exclude<KycStatus, "APPROVED">,
  { title: string; body: string; action: string | null }
> = {
  NONE: {
    title: "Verify your identity to get paid",
    body: "Companies can only pay you once this is done. It takes a few minutes: a photo of your ID and a selfie.",
    action: "Verify identity",
  },
  PENDING: {
    title: "Finish verifying your identity",
    body: "You started the check but it is not complete yet. Companies cannot pay you until it is.",
    action: "Continue",
  },
  IN_REVIEW: {
    title: "Your identity check is being reviewed",
    body: "A person is looking at it. There is nothing more for you to do; we will update this page when it is decided.",
    action: null,
  },
  DECLINED: {
    title: "Your identity check was not accepted",
    body: "This is often a blurry photo or an expired document. You can try again with a clear, valid ID.",
    action: "Try again",
  },
  EXPIRED: {
    title: "Your identity check ran out",
    body: "It was not finished in time, or an earlier approval has expired. Start again to keep getting paid.",
    action: "Verify identity",
  },
};

/**
 * Shown on the contractor's home until their identity is verified. The check
 * itself happens on the provider's page; we send them there and they come
 * back to ?kyc=done, where we wait for the result to arrive.
 */
export default function KycBanner() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const returned = useSearchParams().get("kyc") === "done";
  // /api/kyc asks the provider when a result is still due; /api/me does not.
  const standing = useQuery({
    queryKey: ["kyc", me?.contractor?.id],
    queryFn: kycApi.status,
    enabled: Boolean(me?.kycRequired && me?.contractor),
    staleTime: 5_000,
  });
  const status = standing.data?.status ?? me?.contractor?.kycStatus;
  const refetch = async () => {
    const r = await standing.refetch();
    if (r.data?.status === "APPROVED")
      void qc.invalidateQueries({ queryKey: ME_KEY });
  };
  const start = useMutation({
    mutationFn: kycApi.start,
    onSuccess: ({ url }) => window.location.assign(url),
  });

  // Just back from the provider: the result arrives a moment later.
  const waiting = returned && status === "PENDING";
  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(() => void refetch(), 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting]);

  if (!me?.kycRequired || !status) return null;
  if (status === "APPROVED")
    return returned ? (
      <div
        role="status"
        className="flex items-center gap-3 rounded-[20px] border border-line bg-subtle px-5 py-4 text-[14.5px] text-ink"
      >
        <ShieldCheck size={18} className="shrink-0 text-accent" />
        Your identity is verified. Companies can pay you now.
      </div>
    ) : null;

  const copy = COPY[status];
  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-[20px] border border-line bg-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-muted" />
        <div>
          <div className="text-[15px] font-medium text-ink">
            {waiting ? "Checking your result" : copy.title}
          </div>
          <div className="mt-0.5 text-[14px] text-muted">
            {waiting
              ? "This usually takes under a minute. You can stay on this page."
              : copy.body}
          </div>
          {start.isError && (
            <div className="mt-1 text-[13.5px] text-[#A32D1C]">
              {(start.error as Error).message}
            </div>
          )}
        </div>
      </div>
      {copy.action && !waiting && (
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
