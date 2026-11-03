"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Info } from "lucide-react";
import { Card, Field, PageTitle, inputClass } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { sendFromWallet, explorerUrl } from "@/lib/api";
import { ME_KEY, useMe } from "@/lib/hooks/useMe";
import { LEDGER_KEY } from "@/lib/hooks/usePayments";
import { usdc } from "@/lib/format";

const isStellarKey = (v: string) => /^G[A-Z2-7]{55}$/.test(v.trim());

/**
 * Withdraw USDC to a wallet the contractor controls: their own Stellar
 * wallet, or their deposit address at a licensed exchange or anchor, which
 * is where USDC becomes local currency. Disburs never converts to fiat.
 */
export default function WithdrawPage() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const wallet = me?.contractor?.wallet ?? null;
  const balance = Number(wallet?.balances?.usdc ?? 0);
  const network = me?.network ?? "testnet";

  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [memoType, setMemoType] = useState<"text" | "id">("text");
  const [lastHash, setLastHash] = useState<string | null>(null);

  const parsed = Number(amount);
  const amountOk =
    Number.isFinite(parsed) && parsed > 0 && parsed <= balance + 1e-7;
  const memoOk =
    memoType === "text" ? memo.length <= 28 : memo === "" || /^\d+$/.test(memo);
  const ready =
    Boolean(wallet?.isActivated) &&
    isStellarKey(destination) &&
    amountOk &&
    memoOk;

  const send = useMutation({
    mutationFn: () =>
      sendFromWallet({
        fromPublicKey: wallet!.publicKey,
        destination: destination.trim(),
        amount: String(parsed),
        memoType,
        ...(memo.trim() ? { memo: memo.trim() } : {}),
      }),
    onSuccess: (entry) => {
      setLastHash(entry.txHash ?? null);
      setAmount("");
      setMemo("");
      toast.success("Sent", {
        description: `$${usdc(String(parsed))} USDC is on its way.`,
      });
      void qc.invalidateQueries({ queryKey: ME_KEY });
      void qc.invalidateQueries({ queryKey: LEDGER_KEY });
    },
    onError: (e) =>
      toast.error("Could not send", { description: (e as Error).message }),
  });

  return (
    <div className="mx-auto flex max-w-[680px] flex-col gap-5">
      <PageTitle sub="Move your USDC to a wallet you control: your own, or your deposit address at an exchange or anchor that pays out in your currency.">
        Withdraw
      </PageTitle>

      <Card>
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-[13px] text-muted">Available</div>
          <div className="tabular text-[15px] font-medium text-ink">
            ${usdc(String(balance))} USDC
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) send.mutate();
          }}
          className="mt-5 flex flex-col gap-4"
        >
          <Field
            label="Send to (Stellar address)"
            hint="Starts with G and is 56 characters. The wallet must already hold USDC (a USDC trustline)."
          >
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value.trim())}
              placeholder="GB…"
              spellCheck={false}
              className={`${inputClass} font-mono text-[13.5px]`}
            />
            {destination && !isStellarKey(destination) && (
              <p className="mt-1 text-[13px] text-[#A32D1C]">
                That is not a Stellar address.
              </p>
            )}
          </Field>
          <Field label="Amount (USDC)">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="0.00"
              className={`${inputClass} tabular`}
            />
            {amount && !amountOk && (
              <p className="mt-1 text-[13px] text-[#A32D1C]">
                Enter an amount up to ${usdc(String(balance))}.
              </p>
            )}
          </Field>
          <Field
            label="Memo (optional)"
            hint="Exchanges usually give you one with the deposit address. Without it they cannot credit you."
          >
            <div className="flex gap-2">
              <input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder={
                  memoType === "id" ? "1234567" : "Up to 28 characters"
                }
                className={`${inputClass} flex-1`}
              />
              <select
                value={memoType}
                onChange={(e) => setMemoType(e.target.value as "text" | "id")}
                aria-label="Memo type"
                className={`${inputClass} w-[120px]`}
              >
                <option value="text">Text</option>
                <option value="id">ID (number)</option>
              </select>
            </div>
            {!memoOk && (
              <p className="mt-1 text-[13px] text-[#A32D1C]">
                {memoType === "id"
                  ? "An ID memo is digits only."
                  : "Text memos are at most 28 characters."}
              </p>
            )}
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={!ready || send.isPending}>
              {send.isPending
                ? "Sending…"
                : amountOk
                  ? `Send $${usdc(String(parsed))}`
                  : "Send"}
              {!send.isPending && <ArrowUpRight size={16} />}
            </Button>
            {!wallet?.isActivated && (
              <span className="text-[13.5px] text-muted">
                Your wallet is still being set up.
              </span>
            )}
          </div>
          {lastHash && (
            <p className="text-[13.5px] text-muted">
              Sent.{" "}
              <a
                href={explorerUrl(network, "tx", lastHash)}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline underline-offset-4"
              >
                View the transaction
              </a>
            </p>
          )}
        </form>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <Info size={18} className="mt-0.5 shrink-0 text-muted" />
          <div className="text-[14.5px] leading-[1.6] text-muted">
            <div className="font-medium text-ink">
              Turning USDC into your local currency
            </div>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5">
              <li>
                Open an account with a licensed exchange or Stellar anchor that
                supports USDC on Stellar and pays out in your currency.
              </li>
              <li>
                In their app, choose <em>Deposit USDC (Stellar)</em>. They show
                a Stellar address and usually a memo.
              </li>
              <li>Paste both here and send. The USDC arrives in seconds.</li>
              <li>
                Sell or withdraw to your bank or mobile money on their side.
              </li>
            </ol>
            <p className="mt-3">
              Disburs pays you in USDC and never converts it to local money
              itself; the exchange or anchor does that under its own licence.
              Keep the memo exact, and send a small test amount the first time.{" "}
              <a
                href="https://developers.stellar.org/docs/learn/fundamentals/anchors"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline underline-offset-4"
              >
                What a Stellar anchor is
              </a>
              .
            </p>
            <p className="mt-3">
              <Link
                href="/contractor"
                className="text-accent underline underline-offset-4"
              >
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
