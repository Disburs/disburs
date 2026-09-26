"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Badge, Button, Card, PageTitle } from "@/components/portal/ui";
import { useActivateWallets, useMe } from "@/lib/hooks/useMe";
import { useFundWallet, useLedger } from "@/lib/hooks/usePayments";
import { explorerUrl } from "@/lib/api";
import { shortKey, usdc, when } from "@/lib/format";

export default function WalletPage() {
  const { data: me, refetch, isFetching } = useMe();
  const ledger = useLedger();
  const fund = useFundWallet();
  const activate = useActivateWallets();
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

  const outgoing = (ledger.data ?? []).filter((e) => e.organizationId && e.organizationId === me?.organization?.id);

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub="Your treasury on Stellar. Every payout draws from here."
        action={
          <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} /> Refresh
          </Button>
        }
      >
        Wallet
      </PageTitle>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card tone="dark" className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[13.5px] text-white/60">USDC balance</div>
            <span className="text-[12.5px] text-white/50">{network}</span>
          </div>
          <div className="tabular mt-3 font-display text-[44px] font-semibold leading-none tracking-[-0.03em] text-white md:text-[56px]">
            {balance === null ? "—" : `$${usdc(balance)}`}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            <div>
              <div className="text-[13px] text-white/55">Organization</div>
              <div className="mt-1 text-[16px] font-medium text-white">{me?.organization?.name ?? "—"}</div>
            </div>
            <div>
              <div className="text-[13px] text-white/55">Status</div>
              <div className="mt-1 text-[16px] font-medium text-mint">
                {wallet ? (wallet.isActivated ? "Activated" : "Not activated") : "No wallet"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between gap-5">
          <div>
            <div className="text-[14.5px] font-medium text-ink">Pay someone</div>
            <p className="mt-1 text-[14px] leading-[1.5] text-muted">Send USDC from this treasury to an onboarded contractor.</p>
          </div>
          <Button href="/portal/pay" variant="ink" full>
            Pay a contractor
          </Button>
        </Card>
      </div>

      <Card padding={0}>
        <div className="border-b border-line px-6 py-4">
          <h3 className="text-[16px] font-medium text-ink">Fund your treasury</h3>
        </div>
        <div className="px-6 py-5">
          <div className="text-[13px] text-muted">Send USDC on Stellar from any exchange or wallet to this address:</div>
          <div className="mt-2 flex items-center justify-between gap-3 border border-line bg-subtle px-4 py-3">
            <span className="break-all font-mono text-[13px] text-ink">{wallet?.publicKey ?? "—"}</span>
            <button type="button" onClick={copy} className={`shrink-0 ${copied ? "text-accent" : "text-muted hover:text-ink"}`} aria-label="Copy address">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="mt-2 text-[13px] text-muted">Only send USDC on the Stellar network. Anything else will not arrive.</p>

          {wallet && !wallet.isActivated && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[16px] bg-[#FBF1DC] px-4 py-3 text-[13.5px] text-[#8A5A00]">
              This wallet is not activated yet, so it cannot receive USDC.
              <Button size="sm" variant="secondary" onClick={() => activate.mutate()} disabled={activate.isPending}>
                {activate.isPending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Retry activation
              </Button>
            </div>
          )}

          {testnet && wallet && (
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <span className="text-[13.5px] text-muted">Testnet:</span>
              {me?.canMint ? (
                <Button size="sm" variant="secondary" onClick={() => fund.mutate({ publicKey: wallet.publicKey, amount: "100" })} disabled={fund.isPending}>
                  {fund.isPending ? <Loader2 size={14} className="animate-spin" /> : null} Mint 100 test USDC
                </Button>
              ) : (
                <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
                  Get test USDC from Circle&rsquo;s faucet <ExternalLink size={13} />
                </a>
              )}
              <a href={explorerUrl(network, "account", wallet.publicKey)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink">
                View on explorer <ExternalLink size={13} />
              </a>
              {fund.isError && <span className="text-[13px] text-[#A32D1C]">{(fund.error as Error).message}</span>}
            </div>
          )}
        </div>
      </Card>

      <Card padding={0}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="text-[16px] font-medium text-ink">Outgoing payments</h3>
          <span className="text-[13px] text-muted">{outgoing.length} on record</span>
        </div>
        {ledger.isPending ? (
          <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
        ) : outgoing.length === 0 ? (
          <div className="px-6 py-6 text-[14px] text-muted">Nothing yet. Your first payout will show here with its transaction.</div>
        ) : (
          <ul className="divide-y divide-line">
            {outgoing.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div className="min-w-0">
                  <div className="text-[14.5px] text-ink">
                    {e.type === "PAYOUT" ? "Payout" : "Send"} to <span className="font-mono">{e.destination ? shortKey(e.destination) : "—"}</span>
                  </div>
                  <div className="text-[13px] text-muted">
                    {when(e.createdAt)}
                    {e.memo ? ` · memo ${e.memo}` : ""}
                    {e.error ? ` · ${e.error}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular text-[14.5px] font-medium text-ink">−${usdc(e.amount)}</span>
                  <Badge variant={e.status === "SETTLED" ? "success" : e.status === "FAILED" ? "danger" : "warn"}>{e.status.toLowerCase()}</Badge>
                  {e.txHash && (
                    <a href={explorerUrl(network, "tx", e.txHash)} target="_blank" rel="noreferrer" aria-label="View transaction" className="text-muted hover:text-ink">
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
