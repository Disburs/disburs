"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/portal/ui";
import { useActivateWallets } from "@/lib/hooks/useMe";
import type { WalletState } from "@/lib/api";

/**
 * Shows the custodial wallet onboarding just provisioned, and its on-chain
 * activation state. Creation is instant (keys made, secret encrypted, stored);
 * activation funds the reserve and adds the USDC trustline, so it can lag a
 * little. If it hasn't landed yet, the user can retry from here.
 */
export default function WalletStep({
  kind,
  wallet,
  network,
}: {
  kind: "treasury" | "payout";
  wallet: WalletState | null;
  network: string;
}) {
  const activate = useActivateWallets();
  const [copied, setCopied] = useState(false);
  const active = Boolean(wallet?.isActivated);

  // One automatic retry when the wallet exists but isn't active yet.
  useEffect(() => {
    if (wallet && !wallet.isActivated && activate.isIdle) activate.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.publicKey]);

  const copy = () => {
    if (!wallet) return;
    navigator.clipboard?.writeText(wallet.publicKey).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const title = kind === "treasury" ? "Your treasury is ready." : "Your payout wallet is ready.";
  const blurb =
    kind === "treasury"
      ? "This is the wallet your payroll is paid from. Fund it with USDC on Stellar and every run draws from here."
      : "This is where your pay lands, in USDC on Stellar. You never handle keys; Disburs holds them for you.";

  return (
    <div className="flex flex-col">
      <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">{title}</h1>
      <p className="mt-4 text-[16px] leading-[1.5] text-muted">{blurb}</p>

      <div className="mt-8 rounded-[20px] border border-line bg-subtle p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13.5px] text-muted">{kind === "treasury" ? "Treasury address" : "Wallet address"}</span>
          <span className="text-[12.5px] text-muted">{network}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <code className="min-w-0 flex-1 truncate font-mono text-[14px] text-ink">{wallet?.publicKey ?? "—"}</code>
          <button type="button" onClick={copy} aria-label="Copy address" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink hover:border-ink">
            {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          {active ? (
            <span className="inline-flex items-center gap-2 text-[14px] font-medium text-accent">
              <Check size={16} strokeWidth={2.5} /> Activated on Stellar. It can hold and receive USDC.
            </span>
          ) : activate.isPending ? (
            <span className="inline-flex items-center gap-2 text-[14px] text-muted">
              <Loader2 size={16} className="animate-spin text-accent" /> Activating on Stellar…
            </span>
          ) : (
            <>
              <span className="text-[14px] text-muted">Not activated yet. Usually takes a few seconds.</span>
              <Button size="sm" variant="secondary" onClick={() => activate.mutate()}>
                <RefreshCw size={14} /> Retry
              </Button>
            </>
          )}
        </div>
        {activate.data?.activationErrors?.length ? (
          <p className="mt-3 text-[13px] text-[#A32D1C]">{activate.data.activationErrors[0]}</p>
        ) : null}
      </div>
    </div>
  );
}
