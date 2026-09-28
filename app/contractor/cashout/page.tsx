"use client";

import { useState } from "react";
import { Clock, Loader2, X } from "lucide-react";
import {
  Badge,
  Card,
  Field,
  PageTitle,
  inputClass,
} from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/hooks/useMe";
import {
  useCancelCashout,
  useCashouts,
  useRequestCashout,
} from "@/lib/hooks/useCashouts";
import { usdc, when } from "@/lib/format";
import UsdcMark from "@/components/UsdcMark";

/**
 * Request a cash-out. The request is recorded with the amount and where to
 * pay it; the off-ramp that turns USDC into local money is a later phase, so
 * nothing moves yet and the USDC stays in the contractor's wallet.
 */
export default function CashoutPage() {
  const { data: me } = useMe();
  const list = useCashouts();
  const request = useRequestCashout();
  const cancel = useCancelCashout();
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [note, setNote] = useState("");

  const wallet = me?.contractor?.wallet ?? null;
  const balance = Number(wallet?.balances?.usdc ?? "0");
  const currency = me?.contractor?.payoutCurrency ?? "—";
  const open = (list.data ?? []).filter((r) => r.status === "REQUESTED");
  const requested = open.reduce((acc, r) => acc + Number(r.amount), 0);
  const available = Math.max(0, balance - requested);
  const parsed = Number(amount);
  const amountOk =
    Number.isFinite(parsed) && parsed > 0 && parsed <= available + 1e-7;

  const submit = () => {
    if (!amountOk || destination.trim().length < 3) return;
    request.mutate(
      {
        amount: String(parsed),
        destination: destination.trim(),
        ...(note.trim() ? { note: note.trim() } : {}),
      },
      {
        onSuccess: () => {
          setAmount("");
          setNote("");
        },
      },
    );
  };

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-5">
      <PageTitle sub={<>Ask for your USDC to be paid out in {currency}.</>}>
        Cash out
      </PageTitle>

      <Card tone="subtle">
        <div className="flex items-start gap-3 text-[14px] leading-[1.55] text-muted">
          <Clock size={16} className="mt-0.5 shrink-0 text-ink" />
          <p>
            Local payouts through a partner are not live yet. Your request is
            recorded now and paid when they are. Until then your USDC stays in
            your own wallet, and you can send it anywhere on Stellar yourself.
          </p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted">Available to request</span>
          <Button
            variant="link"
            onClick={() => setAmount(available.toString())}
            className="h-auto px-0 tabular text-[13px]"
          >
            Max ${usdc(available)}
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-[34px] font-semibold tracking-[-0.03em] text-ink">
            $
          </span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            aria-label="Amount in USDC"
            className="tabular w-full min-w-0 bg-transparent font-display text-[34px] font-semibold tracking-[-0.03em] text-ink outline-none placeholder:text-faint"
          />
          <span className="inline-flex items-center gap-1.5 text-[15px] text-muted">
            <UsdcMark size={16} /> USDC
          </span>
        </div>
        {requested > 0 && (
          <div className="mt-2 text-[13px] text-muted">
            ${usdc(balance)} in your wallet, ${usdc(requested)} already
            requested.
          </div>
        )}
        <div className="mt-5 grid grid-cols-1 gap-4">
          <Field
            label={`Pay it to (${currency})`}
            hint="Bank or mobile-money details, as you would give them to an employer."
          >
            <input
              className={inputClass}
              maxLength={200}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="GTBank 0123456789 · your name"
            />
          </Field>
          <Field label="Note (optional)">
            <input
              className={inputClass}
              maxLength={300}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything we should know"
            />
          </Field>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            onClick={submit}
            size="lg"
            disabled={
              !amountOk || destination.trim().length < 3 || request.isPending
            }
          >
            {request.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : null}
            <span className="tabular">
              Request {amountOk ? `$${usdc(parsed)}` : "a cash-out"}
            </span>
          </Button>
          {request.isError && (
            <span className="text-[13.5px] text-[#A32D1C]">
              {(request.error as Error).message}
            </span>
          )}
          {request.isSuccess && !request.isPending && (
            <span className="text-[13.5px] font-medium text-accent">
              Request recorded.
            </span>
          )}
        </div>
      </Card>

      <Card padding={0}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="text-[16px] font-medium text-ink">Your requests</h3>
          <span className="text-[13px] text-muted">{open.length} open</span>
        </div>
        {list.isPending ? (
          <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
        ) : (list.data ?? []).length === 0 ? (
          <div className="px-6 py-6 text-[14px] text-muted">
            No requests yet.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {(list.data ?? []).map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="tabular text-[14.5px] text-ink">
                    ${usdc(r.amount)} USDC → {r.currency}
                  </div>
                  <div className="truncate text-[13px] text-muted">
                    {r.destination} · {when(r.createdAt)}
                    {r.note ? ` · ${r.note}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      r.status === "PAID"
                        ? "success"
                        : r.status === "CANCELLED"
                          ? "neutral"
                          : "warn"
                    }
                    dot
                  >
                    {r.status === "REQUESTED"
                      ? "Requested"
                      : r.status === "PAID"
                        ? "Paid"
                        : "Cancelled"}
                  </Badge>
                  {r.status === "REQUESTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancel.mutate(r.id)}
                      disabled={cancel.isPending}
                    >
                      <X size={14} /> Cancel
                    </Button>
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
