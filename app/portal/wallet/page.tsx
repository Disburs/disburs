"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Badge, Card, PageTitle } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { useActivateWallets, useMe } from "@/lib/hooks/useMe";
import { useFundWallet, useLedger } from "@/lib/hooks/usePayments";
import { explorerUrl, MONEY_ROLES } from "@/lib/api";
import {
  useReconciliation,
  useReconcileNow,
  useResolveDiscrepancy,
} from "@/lib/hooks/useReconciliation";
import { ago, shortKey, usdc, when } from "@/lib/format";
import UsdcMark from "@/components/UsdcMark";

export default function WalletPage() {
  const { data: me, refetch, isFetching } = useMe();
  const ledger = useLedger();
  const fund = useFundWallet();
  const activate = useActivateWallets();
  const recon = useReconciliation();
  const reconcile = useReconcileNow();
  const resolve = useResolveDiscrepancy();
  const [copied, setCopied] = useState(false);

  const wallet = me?.organization?.treasuryWallet ?? null;
  const network = me?.network ?? "testnet";
  const testnet = network !== "mainnet";
  const balance = wallet?.balances?.usdc ?? null;

  const copy = () => {
    if (!wallet) return;
    navigator.clipboard?.writeText(wallet.publicKey).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const activity = (ledger.data ?? []).filter(
    (e) => e.organizationId && e.organizationId === me?.organization?.id,
  );
  const canManage = Boolean(
    me?.organization?.role && MONEY_ROLES.includes(me.organization.role),
  );
  const reconciledAt =
    recon.data?.treasury?.reconciledAt ?? wallet?.reconciledAt ?? null;
  const open = (recon.data?.discrepancies ?? []).filter((d) => !d.resolvedAt);

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub="Your treasury on Stellar. Every payout draws from here."
        action={
          <Button size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />{" "}
            Refresh
          </Button>
        }
      >
        Wallet
      </PageTitle>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card tone="dark" className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-[13.5px] text-white/60">
              <UsdcMark size={22} /> USDC balance
            </div>
            <span className="text-[12.5px] text-white/50">{network}</span>
          </div>
          <div className="tabular mt-3 flex items-center gap-3 font-display text-[44px] font-semibold leading-none tracking-[-0.03em] text-white md:text-[56px]">
            {balance === null ? "—" : `$${usdc(balance)}`}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-sans text-[14px] font-medium tracking-normal text-white">
              <UsdcMark size={18} /> USDC
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            <div>
              <div className="text-[13px] text-white/55">Organization</div>
              <div className="mt-1 text-[16px] font-medium text-white">
                {me?.organization?.name ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-[13px] text-white/55">Status</div>
              <div className="mt-1 text-[16px] font-medium text-mint">
                {wallet
                  ? wallet.isActivated
                    ? "Activated"
                    : "Not activated"
                  : "No wallet"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between gap-5">
          <div>
            <div className="text-[14.5px] font-medium text-ink">
              Pay someone
            </div>
            <p className="mt-1 text-[14px] leading-[1.5] text-muted">
              Send USDC from this treasury to an onboarded contractor.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/portal/pay">Pay a contractor</Link>
          </Button>
        </Card>
      </div>

      <Card padding={0}>
        <div className="border-b border-line px-6 py-4">
          <h3 className="text-[16px] font-medium text-ink">
            Fund your treasury
          </h3>
        </div>
        <div className="px-6 py-5">
          <div className="inline-flex items-center gap-2 text-[13px] text-muted">
            <UsdcMark size={16} /> Send USDC on Stellar from any exchange or
            wallet to this address:
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 border border-line bg-subtle px-4 py-3">
            <span className="break-all font-mono text-[13px] text-ink">
              {wallet?.publicKey ?? "—"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={copy}
              aria-label="Copy address"
              className={`h-6 w-6 shrink-0 ${copied ? "text-accent" : "text-muted hover:text-ink"}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
          <p className="mt-2 text-[13px] text-muted">
            Only send USDC on the Stellar network. Anything else will not
            arrive.
          </p>
          {me?.organization?.payrollContractId && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-[13px] text-muted">
              <span>Payroll contract</span>
              <span className="font-mono text-ink">
                {shortKey(me.organization.payrollContractId, 6, 6)}
              </span>
              <a
                href={explorerUrl(
                  network,
                  "contract",
                  me.organization.payrollContractId,
                )}
                target="_blank"
                rel="noreferrer"
                aria-label="View contract on explorer"
                className="text-muted hover:text-ink"
              >
                <ExternalLink size={13} />
              </a>
              <span>
                · your organization&rsquo;s own treasury contract on Soroban.
              </span>
            </div>
          )}

          {wallet && !wallet.isActivated && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[16px] bg-[#FBF1DC] px-4 py-3 text-[13.5px] text-[#8A5A00]">
              This wallet is not activated yet, so it cannot receive USDC.
              <Button
                size="sm"
                onClick={() => activate.mutate()}
                disabled={activate.isPending}
              >
                {activate.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}{" "}
                Retry activation
              </Button>
            </div>
          )}

          {testnet && wallet && (
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <span className="text-[13.5px] text-muted">Testnet:</span>
              {me?.canMint ? (
                <Button
                  size="sm"
                  onClick={() =>
                    fund.mutate({ publicKey: wallet.publicKey, amount: "100" })
                  }
                  disabled={fund.isPending}
                >
                  {fund.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}{" "}
                  Mint 100 test USDC
                </Button>
              ) : (
                <a
                  href="https://faucet.circle.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent"
                >
                  Get test USDC from Circle&rsquo;s faucet{" "}
                  <ExternalLink size={13} />
                </a>
              )}
              <a
                href={explorerUrl(network, "account", wallet.publicKey)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink"
              >
                View on explorer <ExternalLink size={13} />
              </a>
              {fund.isError && (
                <span className="text-[13px] text-[#A32D1C]">
                  {(fund.error as Error).message}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Reconciliation: the ledger is checked against the chain every minute. */}
      <Card padding={0}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={18}
              className={open.length ? "text-[#8A5A00]" : "text-accent"}
            />
            <div>
              <div className="text-[14.5px] font-medium text-ink">
                {open.length
                  ? `${open.length} ${open.length === 1 ? "discrepancy" : "discrepancies"} to look at`
                  : "Ledger matches the chain"}
              </div>
              <div className="text-[13px] text-muted">
                {reconciledAt
                  ? `Last checked ${ago(reconciledAt)}. `
                  : "Not checked yet. "}
                Every payment on this wallet is compared with Stellar and
                confirmed, recovered or flagged.
              </div>
            </div>
          </div>
          {canManage && (
            <Button
              size="sm"
              onClick={() => reconcile.mutate()}
              disabled={reconcile.isPending || !wallet?.isActivated}
            >
              {reconcile.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}{" "}
              Check now
            </Button>
          )}
        </div>
        {reconcile.isError && (
          <div className="border-t border-line px-6 py-3 text-[13px] text-[#A32D1C]">
            {(reconcile.error as Error).message}
          </div>
        )}
        {open.length > 0 && (
          <ul className="divide-y divide-line border-t border-line">
            {open.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-3 bg-[#FBF1DC]/40 px-6 py-3.5"
              >
                <div className="min-w-0">
                  <div className="text-[14px] text-ink">
                    <span className="font-medium">
                      {d.kind === "UNRECORDED_OUTFLOW"
                        ? "Unrecorded outflow"
                        : d.kind === "MISSING_ON_CHAIN"
                          ? "Missing on chain"
                          : d.kind === "RECOVERED"
                            ? "Recovered"
                            : "Timed out"}
                    </span>
                    {d.amount ? (
                      <span className="tabular"> · ${usdc(d.amount)}</span>
                    ) : null}
                    {d.destination ? (
                      <span className="font-mono text-[12.5px] text-muted">
                        {" "}
                        → {shortKey(d.destination)}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[13px] text-muted">
                    {d.note} {when(d.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {d.txHash && (
                    <a
                      href={explorerUrl(network, "tx", d.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View transaction"
                      className="text-muted hover:text-ink"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {canManage && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolve.mutate(d.id)}
                      disabled={resolve.isPending}
                    >
                      Mark as looked at
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card padding={0}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="text-[16px] font-medium text-ink">
            Treasury activity
          </h3>
          <span className="text-[13px] text-muted">
            {activity.length} on record
          </span>
        </div>
        {ledger.isPending ? (
          <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
        ) : activity.length === 0 ? (
          <div className="px-6 py-6 text-[14px] text-muted">
            Nothing yet. Deposits and payouts show here with their transactions.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {activity.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="text-[14.5px] text-ink">
                    {e.type === "PAYOUT"
                      ? "Payout to"
                      : e.type === "FUND"
                        ? "Deposit from"
                        : "Send to"}{" "}
                    <span className="font-mono">
                      {(e.type === "FUND" ? e.source : e.destination)
                        ? shortKey(
                            (e.type === "FUND" ? e.source : e.destination)!,
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="text-[13px] text-muted">
                    {when(e.createdAt)}
                    {e.memo ? ` · memo ${e.memo}` : ""}
                    {e.error ? ` · ${e.error}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`tabular text-[14.5px] font-medium ${e.type === "FUND" ? "text-accent" : "text-ink"}`}
                  >
                    {e.type === "FUND" ? "+" : "−"}${usdc(e.amount)}
                  </span>
                  {e.reconciledAt && (
                    <ShieldCheck
                      size={14}
                      className="text-accent"
                      aria-label="Confirmed on chain"
                    />
                  )}
                  <Badge
                    variant={
                      e.status === "SETTLED"
                        ? "success"
                        : e.status === "FAILED"
                          ? "danger"
                          : "warn"
                    }
                  >
                    {e.status.toLowerCase()}
                  </Badge>
                  {e.txHash && (
                    <a
                      href={explorerUrl(network, "tx", e.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View transaction"
                      className="text-muted hover:text-ink"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
