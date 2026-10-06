"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Badge, Card, PageTitle } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { kycApi, type KycStatus } from "@/lib/api";
import { ME_KEY, useMe } from "@/lib/hooks/useMe";
import { usdc } from "@/lib/format";

const STATUS: Record<
  KycStatus,
  { label: string; variant: "success" | "warn" | "neutral" | "danger" }
> = {
  NONE: { label: "Not started", variant: "neutral" },
  PENDING: { label: "In progress", variant: "warn" },
  IN_REVIEW: { label: "Being reviewed", variant: "warn" },
  APPROVED: { label: "Verified", variant: "success" },
  DECLINED: { label: "Not accepted", variant: "danger" },
  EXPIRED: { label: "Expired", variant: "neutral" },
};

const ACTION: Partial<Record<KycStatus, string>> = {
  NONE: "Verify business",
  PENDING: "Continue",
  DECLINED: "Try again",
  EXPIRED: "Verify business",
};

export default function VerificationPage() {
  return (
    <Suspense fallback={null}>
      <Verification />
    </Suspense>
  );
}

/**
 * Settings → Verification: where the organization's business check (KYB)
 * stands, how much of the allowance is used, and the button to start it.
 */
function Verification() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const returned = useSearchParams().get("kyb") === "done";
  const q = useQuery({
    queryKey: ["kyb", me?.organization?.id],
    queryFn: kycApi.kyb,
    enabled: Boolean(me?.organization),
    staleTime: 5_000,
  });
  const standing = q.data;
  const start = useMutation({
    mutationFn: kycApi.startKyb,
    onSuccess: ({ url }) => window.location.assign(url),
  });
  const waiting = returned && standing?.status === "PENDING";
  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(async () => {
      const r = await q.refetch();
      if (r.data?.status === "APPROVED")
        void qc.invalidateQueries({ queryKey: ME_KEY });
    }, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting]);

  const status = standing?.status ?? "NONE";
  const action = ACTION[status];
  return (
    <div className="flex max-w-[760px] flex-col gap-5">
      <PageTitle sub="Disburs confirms that your business exists and who runs it. The check happens on our identity partner's page; we keep only the result.">
        Verification
      </PageTitle>

      {q.isError && (
        <p className="text-[14px] text-[#A32D1C]">
          {(q.error as Error).message}
        </p>
      )}

      <Card className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {status === "APPROVED" ? (
              <BadgeCheck size={22} className="mt-0.5 shrink-0 text-accent" />
            ) : (
              <ShieldCheck size={22} className="mt-0.5 shrink-0 text-muted" />
            )}
            <div>
              <div className="text-[17px] font-medium text-ink">
                Business check (KYB)
              </div>
              <div className="mt-1 text-[14.5px] text-muted">
                {!standing
                  ? "Loading…"
                  : waiting
                    ? "Checking your result. This usually takes a few minutes; you can stay on this page."
                    : status === "APPROVED"
                      ? "Your business is verified. There is no limit on what you can pay out."
                      : status === "IN_REVIEW"
                        ? "A person is looking at it. There is nothing more to do."
                        : !standing.required
                          ? "Verification is not required right now."
                          : `You can pay out up to $${usdc(standing.allowanceUsdc)} USDC in total before verifying. You have paid out $${usdc(standing.paidOutUsdc)} so far.`}
              </div>
            </div>
          </div>
          {standing && (
            <Badge variant={STATUS[status].variant} dot>
              {waiting ? "Checking" : STATUS[status].label}
            </Badge>
          )}
        </div>

        {standing && (
          <dl className="grid grid-cols-2 gap-4 border-t border-line pt-5 text-[14px] sm:grid-cols-3">
            <div>
              <dt className="text-muted">Allowance before verifying</dt>
              <dd className="tabular mt-1 font-medium text-ink">
                ${usdc(standing.allowanceUsdc)} USDC
              </dd>
            </div>
            <div>
              <dt className="text-muted">Paid out so far</dt>
              <dd className="tabular mt-1 font-medium text-ink">
                ${usdc(standing.paidOutUsdc)} USDC
              </dd>
            </div>
            <div>
              <dt className="text-muted">What it asks for</dt>
              <dd className="mt-1 text-ink">
                Company details, a director&rsquo;s ID
              </dd>
            </div>
          </dl>
        )}

        {standing && action && !waiting && (
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
            {standing.canManage ? (
              <Button
                onClick={() => start.mutate()}
                disabled={start.isPending || start.isSuccess}
              >
                {start.isPending || start.isSuccess ? "Opening" : action}
              </Button>
            ) : (
              <span className="text-[14px] text-muted">
                Only owners and admins can start the check.
              </span>
            )}
            {start.isError && (
              <span className="text-[13.5px] text-[#A32D1C]">
                {(start.error as Error).message}
              </span>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
