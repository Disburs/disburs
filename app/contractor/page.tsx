"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Copy, ExternalLink } from "lucide-react";
import { Badge, PageTitle } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { useCashouts } from "@/lib/hooks/useCashouts";
import { useFeature, useMe } from "@/lib/hooks/useMe";
import { useLedger } from "@/lib/hooks/usePayments";
import { explorerUrl } from "@/lib/api";
import { shortKey, usdc, when } from "@/lib/format";
import UsdcMark from "@/components/UsdcMark";
import KycBanner from "@/components/contractor/KycBanner";
import SetupNudge from "@/components/two-factor/SetupNudge";

export default function ContractorHome() {
  const { data: me } = useMe();
  const cashoutsOn = useFeature("cashouts");
  const ledger = useLedger();
  const cashouts = useCashouts();
  const wallet = me?.contractor?.wallet ?? null;
  const network = me?.network ?? "testnet";
  const balanceStr = wallet?.balances?.usdc ?? null;
  const firstName = (me?.contractor?.name ?? me?.user.name ?? "there").split(
    " ",
  )[0];
  const received = (ledger.data ?? []).filter(
    (e) =>
      (e.type === "PAYOUT" || e.type === "FUND") &&
      e.contractorId &&
      e.contractorId === me?.contractor?.id,
  );
  const lastPayment =
    received.find((e) => e.status === "SETTLED") ?? received[0] ?? null;

  return (
    <div className="flex flex-col gap-5">
      <PageTitle sub={<>Your USDC on Stellar, in a wallet only you control.</>}>
        Hi {firstName}
      </PageTitle>

      <Suspense fallback={null}>
        <KycBanner />
      </Suspense>
      <SetupNudge href="/contractor/security" />

      {/* Top row: balance + last payment / actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Balance hero */}
        <div className="on-dark rounded-[24px] bg-ink-deep p-7 md:p-8 lg:col-span-2">
          <div className="flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <div className="text-[13px] text-white/60">Available balance</div>
              <div className="tabular mt-2 font-display text-[44px] font-semibold leading-none tracking-[-0.03em] text-white md:text-[56px]">
                {balanceStr === null ? "—" : `$${usdc(balanceStr)}`}
                <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 align-middle font-sans text-[14px] font-medium tracking-normal text-white">
                  <UsdcMark size={18} /> USDC
                </span>
              </div>
              <div className="mt-3 text-[15px] text-mint">
                Pays out in {me?.contractor?.payoutCurrency ?? "—"}
              </div>
            </div>
            {cashoutsOn ? (
              <Button asChild>
                <Link href="/contractor/cashout">
                  Request a cash-out <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <span className="text-[14px] text-white/70">
                Cash-outs are paused for now
              </span>
            )}
          </div>
        </div>

        {/* Last payment + message */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[24px] border border-line bg-canvas p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="text-[13px] text-muted">Last payment</div>
              {lastPayment && (
                <Badge
                  variant={
                    lastPayment.status === "SETTLED" ? "success" : "warn"
                  }
                  dot
                >
                  {lastPayment.status === "SETTLED"
                    ? "Received"
                    : lastPayment.status.toLowerCase()}
                </Badge>
              )}
            </div>
            <div className="tabular mt-2 font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-ink">
              {lastPayment ? `+$${usdc(lastPayment.amount)}` : "—"}{" "}
              <span className="font-sans text-[14px] font-normal tracking-normal text-muted">
                USDC
              </span>
            </div>
            <div className="mt-2 text-[13px] text-muted">
              {lastPayment ? when(lastPayment.createdAt) : "No payments yet"}
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-3 rounded-[24px] border border-line bg-subtle p-5">
            <div>
              <div className="text-[15px] font-medium text-ink">
                Your wallet
              </div>
              <div className="mt-1 text-[13px] text-muted">
                Employers pay USDC on Stellar to this address.
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[13px] text-ink">
              {wallet ? shortKey(wallet.publicKey, 8, 8) : "—"}
              {wallet && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigator.clipboard
                        ?.writeText(wallet.publicKey)
                        .catch(() => {})
                    }
                    aria-label="Copy address"
                    className="h-6 w-6"
                  >
                    <Copy size={13} />
                  </Button>
                  <a
                    href={explorerUrl(network, "account", wallet.publicKey)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View on explorer"
                    className="text-muted hover:text-ink"
                  >
                    <ExternalLink size={13} />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: payments + cashout history */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Payments received">
          {received.map((p) => (
            <Row
              key={p.id}
              title={
                p.type === "FUND"
                  ? "Deposit"
                  : p.memo
                    ? `Payout · ${p.memo}`
                    : "Payout"
              }
              sub={when(p.createdAt)}
              right={
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="tabular text-[14.5px] font-medium text-ink">
                      +${usdc(p.amount)}
                    </div>
                    <div
                      className={`text-[12.5px] ${p.status === "SETTLED" ? "text-accent" : "text-muted"}`}
                    >
                      {p.status === "SETTLED"
                        ? p.reconciledAt
                          ? "Received · on chain"
                          : "Received"
                        : p.status.toLowerCase()}
                    </div>
                  </div>
                  {p.txHash && (
                    <a
                      href={explorerUrl(network, "tx", p.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View transaction"
                      className="text-muted hover:text-ink"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              }
            />
          ))}
          {!ledger.isPending && received.length === 0 && (
            <div className="py-5 text-[13.5px] text-muted">
              No payments yet. When an employer pays you, it shows here.
            </div>
          )}
        </Section>

        <Section title="Cash-out requests">
          {(cashouts.data ?? []).map((c) => (
            <Row
              key={c.id}
              title={`$${usdc(c.amount)} USDC → ${c.currency}`}
              sub={`${c.destination} · ${when(c.createdAt)}`}
              right={
                <Badge
                  variant={
                    c.status === "PAID"
                      ? "success"
                      : c.status === "CANCELLED"
                        ? "neutral"
                        : "warn"
                  }
                  dot
                >
                  {c.status === "REQUESTED"
                    ? "Requested"
                    : c.status === "PAID"
                      ? "Paid"
                      : "Cancelled"}
                </Badge>
              }
            />
          ))}
          {!cashouts.isPending && (cashouts.data ?? []).length === 0 && (
            <div className="py-5 text-[13.5px] text-muted">
              No requests yet. Ask for a cash-out and it shows here with its
              status.
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-line bg-canvas px-5 pb-1 pt-5">
      <h3 className="mb-1 text-[16px] font-medium text-ink">{title}</h3>
      <div className="divide-y divide-line">{children}</div>
    </div>
  );
}

function Row({
  title,
  sub,
  right,
}: {
  title: string;
  sub: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <div className="tabular truncate text-[14.5px] text-ink">{title}</div>
        <div className="mt-0.5 text-[13px] text-muted">{sub}</div>
      </div>
      {right}
    </div>
  );
}
