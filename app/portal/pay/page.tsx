"use client";

import { useState } from "react";
import { ArrowRight, Check, ExternalLink, Loader2, Search } from "lucide-react";
import { Badge, Button, Card, Field, PageTitle, inputClass } from "@/components/portal/ui";
import { useMe } from "@/lib/hooks/useMe";
import { useLookupContractor, usePayContractor } from "@/lib/hooks/usePayments";
import { explorerUrl, type ContractorLookup, type LedgerEntry } from "@/lib/api";
import { usdc } from "@/lib/format";

const newKey = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

/**
 * Phase 0 pay surface: find an onboarded contractor by email, enter an amount
 * and optional memo, pay from the org treasury, show the result and the
 * transaction. An idempotency key per attempt means a retry never double-pays.
 */
export default function PayPage() {
  const { data: me } = useMe();
  const lookup = useLookupContractor();
  const pay = usePayContractor();

  const [email, setEmail] = useState("");
  const [payee, setPayee] = useState<ContractorLookup | null>(null);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [key, setKey] = useState(newKey);
  const [result, setResult] = useState<LedgerEntry | null>(null);

  const network = me?.network ?? "testnet";
  const treasury = me?.organization?.treasuryWallet ?? null;
  const balance = Number(treasury?.balances?.usdc ?? 0);
  const amt = Number(amount);
  const amountOk = /^\d+(\.\d{1,7})?$/.test(amount) && amt > 0;
  const overBalance = amountOk && amt > balance;

  const find = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayee(null);
    setResult(null);
    const found = await lookup.mutateAsync(email.trim()).catch(() => null);
    if (found) setPayee(found);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payee || !amountOk || pay.isPending) return;
    const entry = await pay.mutateAsync({ contractorId: payee.id, amount, memoType: "text", ...(memo.trim() ? { memo: memo.trim() } : {}), idempotencyKey: key }).catch(() => null);
    if (entry) {
      setResult(entry);
      setKey(newKey());
    }
  };

  const reset = () => {
    setResult(null);
    setAmount("");
    setMemo("");
    pay.reset();
  };

  if (result) {
    return (
      <div className="mx-auto flex max-w-[560px] flex-col gap-6 pt-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink-deep">
          <Check size={26} strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
            {result.status === "SETTLED" ? "Paid." : result.status === "PENDING" ? "Submitted." : "Not paid."}
          </h1>
          <p className="mt-4 text-[17px] leading-[1.5] text-muted">
            <b className="font-medium text-ink">${usdc(result.amount)} USDC</b> to {payee?.name}
            {result.status === "SETTLED" ? " settled on Stellar." : result.status === "PENDING" ? " is on its way." : ` failed: ${result.error ?? "unknown error"}.`}
          </p>
        </div>
        <Card tone="subtle">
          <dl className="divide-y divide-line text-[14px]">
            <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Status</dt><dd><Badge variant={result.status === "SETTLED" ? "success" : result.status === "FAILED" ? "danger" : "warn"}>{result.status.toLowerCase()}</Badge></dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Memo</dt><dd className="text-ink">{result.memo ?? "—"}</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Transaction</dt>
              <dd className="min-w-0 text-right">
                {result.txHash ? (
                  <a href={explorerUrl(network, "tx", result.txHash)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[13px] text-accent">
                    {result.txHash.slice(0, 8)}…{result.txHash.slice(-6)} <ExternalLink size={13} />
                  </a>
                ) : "—"}
              </dd>
            </div>
          </dl>
        </Card>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>Pay someone else</Button>
          <Button href="/portal/wallet" variant="secondary">Back to wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle sub={<>From {me?.organization?.name ?? "your treasury"} · balance <span className="tabular font-medium text-ink">${usdc(treasury?.balances?.usdc)}</span> USDC</>}>
        Pay a contractor
      </PageTitle>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <form onSubmit={find} className="flex flex-col gap-4">
            <div className="text-[15px] font-medium text-ink">1. Who are you paying?</div>
            <Field label="Contractor's email" hint="The email they signed in to Disburs with.">
              <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kwabena@example.com" />
            </Field>
            {lookup.isError && <p className="text-[13.5px] text-[#A32D1C]">{(lookup.error as Error).message}</p>}
            <div>
              <Button type="submit" variant="secondary" disabled={!email.trim() || lookup.isPending}>
                {lookup.isPending ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />} Find contractor
              </Button>
            </div>
            {payee && (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-line bg-subtle px-4 py-3">
                <div>
                  <div className="text-[14.5px] font-medium text-ink">{payee.name}</div>
                  <div className="text-[13px] text-muted">
                    {payee.country} · {payee.type === "BUSINESS" ? "Business" : "Individual"} · cashes out to {payee.payoutCurrency}
                  </div>
                </div>
                <Badge variant={payee.walletActivated ? "success" : "warn"}>{payee.walletActivated ? "Wallet ready" : "Wallet not active"}</Badge>
              </div>
            )}
          </form>
        </Card>

        <Card className={payee ? "" : "opacity-50"}>
          <form onSubmit={send} className="flex flex-col gap-4">
            <div className="text-[15px] font-medium text-ink">2. How much?</div>
            <Field label="Amount (USDC)">
              <input inputMode="decimal" className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="250.00" disabled={!payee} />
            </Field>
            <Field label="Memo" hint="Optional. Shown on the transaction; some exchanges need one.">
              <input className={inputClass} maxLength={28} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="March invoice" disabled={!payee} />
            </Field>
            {overBalance && <p className="text-[13.5px] text-[#A32D1C]">That is more than the treasury holds (${usdc(balance)} USDC).</p>}
            {pay.isError && <p className="text-[13.5px] text-[#A32D1C]">{(pay.error as Error).message}</p>}
            <div>
              <Button type="submit" disabled={!payee || !payee.walletActivated || !amountOk || overBalance || pay.isPending}>
                {pay.isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Pay {amountOk ? `$${usdc(amount)}` : ""} <ArrowRight size={15} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
