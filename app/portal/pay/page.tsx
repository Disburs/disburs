"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Globe,
  Loader2,
  Search,
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  Badge,
  Card,
  Field,
  PageTitle,
  inputClass,
} from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { useFeature, useMe } from "@/lib/hooks/useMe";
import FeaturePaused from "@/components/FeaturePaused";
import {
  useContractorSearch,
  useExternalPayeeUsage,
  useExternalPayees,
  usePayContractor,
} from "@/lib/hooks/usePayments";
import { explorerUrl, type ExternalPayee, type LedgerEntry } from "@/lib/api";
import { shortKey, usdc } from "@/lib/format";

type Who = "contractor" | "address";

const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

/**
 * Pay surface: type a contractor's email and they are looked up as you type
 * (debounced, no button), enter an amount and optional memo, pay from the org
 * treasury, show the result and the transaction. An idempotency key per
 * attempt means a retry never double-pays.
 */
export default function PayPage() {
  const { data: me } = useMe();
  const payOn = useFeature("oneOffPay");
  const pay = usePayContractor();

  const externalOn = useFeature("externalPayees");
  const [who, setWho] = useState<Who>("contractor");
  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounce(email);
  const search = useContractorSearch(debouncedEmail);
  // The payee is whoever the current (settled) email resolves to.
  const settled =
    email.trim().toLowerCase() === debouncedEmail.trim().toLowerCase();
  const payee =
    who === "contractor" && settled && search.isSuccess ? search.data : null;
  const searching = search.isFetching || (!settled && email.trim().length > 0);
  const notFound = settled && search.isError;
  // Address-book payee: paid in plain USDC on Stellar, so the line is public.
  const book = useExternalPayees();
  const usage = useExternalPayeeUsage();
  const [externalId, setExternalId] = useState("");
  const external: ExternalPayee | null =
    who === "address"
      ? (book.data?.find((p) => p.id === externalId) ?? null)
      : null;
  const externalReady = Boolean(
    external && external.screenStatus !== "FLAGGED",
  );
  const chosen = who === "contractor" ? Boolean(payee) : externalReady;
  const payeeName = payee?.name ?? external?.name ?? "";
  const capLeft = usage.data
    ? Math.max(0, usage.data.capUsdc - usage.data.usedUsdc)
    : null;
  const amountRef = useRef<HTMLInputElement>(null);
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

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosen || !amountOk || pay.isPending) return;
    const entry = await pay
      .mutateAsync({
        ...(payee ? { contractorId: payee.id } : {}),
        ...(external ? { externalPayeeId: external.id } : {}),
        amount,
        memoType: "text",
        ...(memo.trim() ? { memo: memo.trim() } : {}),
        idempotencyKey: key,
      })
      .catch(() => null);
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
            {result.status === "SETTLED"
              ? "Paid."
              : result.status === "PENDING"
                ? "Submitted."
                : "Not paid."}
          </h1>
          <p className="mt-4 text-[17px] leading-[1.5] text-muted">
            <b className="font-medium text-ink">${usdc(result.amount)} USDC</b>{" "}
            to {payeeName}
            {result.status === "SETTLED"
              ? " settled on Stellar."
              : result.status === "PENDING"
                ? " is on its way."
                : ` failed: ${result.error ?? "unknown error"}.`}
          </p>
        </div>
        <Card tone="subtle">
          <dl className="divide-y divide-line text-[14px]">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted">Status</dt>
              <dd>
                <Badge
                  variant={
                    result.status === "SETTLED"
                      ? "success"
                      : result.status === "FAILED"
                        ? "danger"
                        : "warn"
                  }
                >
                  {result.status.toLowerCase()}
                </Badge>
              </dd>
            </div>
            {result.externalPayee && (
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Address</dt>
                <dd className="flex items-center gap-2 font-mono text-[13px] text-ink">
                  {shortKey(result.externalPayee.address)}
                  <Badge variant="warn">Public</Badge>
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted">Memo</dt>
              <dd className="text-ink">{result.memo ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted">Transaction</dt>
              <dd className="min-w-0 text-right">
                {result.txHash ? (
                  <a
                    href={explorerUrl(network, "tx", result.txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[13px] text-accent"
                  >
                    {result.txHash.slice(0, 8)}…{result.txHash.slice(-6)}{" "}
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </Card>
        {result.externalPayee?.emailSent === false && (
          <p className="text-[13.5px] leading-[1.5] text-[#A32D1C]">
            The payment stands, but we could not email {payeeName} about it.
            Tell them yourself if they are expecting a notice.
          </p>
        )}
        {result.externalPayee?.onDisburs && (
          <p className="text-[13.5px] leading-[1.5] text-muted">
            {payeeName} already has a Disburs account. Add them as a contractor
            on the{" "}
            <Link
              href="/portal/contractors"
              className="text-accent underline-offset-2 hover:underline"
            >
              Contractors
            </Link>{" "}
            page to pay them privately next time.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>Pay someone else</Button>
          <Button asChild>
            <Link href="/portal/wallet">Back to wallet</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!payOn)
    return (
      <div className="flex flex-col gap-5">
        <PageTitle sub="Pay one contractor from your treasury.">Pay</PageTitle>
        <FeaturePaused title="One-off payments are paused">
          Disburs has switched one-off payments off for now. Payroll runs and
          your treasury are not affected.
        </FeaturePaused>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub={
          <>
            From {me?.organization?.name ?? "your treasury"} · balance{" "}
            <span className="tabular font-medium text-ink">
              ${usdc(treasury?.balances?.usdc)}
            </span>{" "}
            USDC
          </>
        }
      >
        {externalOn ? "Pay someone" : "Pay a contractor"}
      </PageTitle>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (chosen) amountRef.current?.focus();
            }}
            className="flex flex-col gap-4"
          >
            <div className="text-[15px] font-medium text-ink">
              1. Who are you paying?
            </div>
            {externalOn && (
              <div
                role="tablist"
                className="flex w-fit rounded-full border border-line bg-subtle p-1 text-[13.5px]"
              >
                {(
                  [
                    ["contractor", "A contractor"],
                    ["address", "A Stellar address"],
                  ] as [Who, string][]
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={who === k}
                    onClick={() => setWho(k)}
                    className={`rounded-full px-3.5 py-1.5 transition-colors ${
                      who === k
                        ? "bg-ink text-white"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            {who === "address" ? (
              <>
                <Field
                  label="From your address book"
                  hint="Addresses you added on the Contractors page. Each one was screened when added."
                >
                  <select
                    className={inputClass}
                    value={externalId}
                    onChange={(e) => setExternalId(e.target.value)}
                    aria-label="Address-book payee"
                  >
                    <option value="">
                      {book.isPending
                        ? "Loading…"
                        : (book.data?.length ?? 0) === 0
                          ? "No addresses yet"
                          : "Choose a payee"}
                    </option>
                    {(book.data ?? []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {shortKey(p.address)}
                      </option>
                    ))}
                  </select>
                </Field>
                {(book.data?.length ?? 0) === 0 && !book.isPending && (
                  <p className="text-[13.5px] text-muted">
                    Add one under{" "}
                    <Link
                      href="/portal/contractors"
                      className="text-accent underline-offset-2 hover:underline"
                    >
                      Contractors → Address book
                    </Link>
                    .
                  </p>
                )}
                {external && (
                  <div className="mt-2 flex flex-col gap-3 rounded-[16px] border border-line bg-subtle px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[14.5px] font-medium text-ink">
                          {external.name}
                        </div>
                        <div className="font-mono text-[12.5px] text-muted">
                          {external.address}
                        </div>
                        {external.memo && (
                          <div className="text-[13px] text-muted">
                            memo {external.memo} ({external.memoType ?? "text"})
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          external.screenStatus === "FLAGGED"
                            ? "danger"
                            : external.screenStatus === "CLEAR"
                              ? "success"
                              : "warn"
                        }
                      >
                        {external.screenStatus === "FLAGGED"
                          ? "Flagged"
                          : external.screenStatus === "CLEAR"
                            ? "Screened"
                            : "Not screened"}
                      </Badge>
                    </div>
                    <p className="flex items-start gap-2 text-[13px] leading-[1.5] text-muted">
                      <Globe size={14} className="mt-0.5 shrink-0" />
                      <span>
                        Payments to this address are public on Stellar: anyone
                        can see the amount and the address. Invite them to
                        Disburs for private pay.
                      </span>
                    </p>
                    {external.screenStatus === "FLAGGED" && (
                      <p className="text-[13.5px] text-[#A32D1C]">
                        This address was flagged by screening and cannot be
                        paid. See Compliance.
                      </p>
                    )}
                  </div>
                )}
                {capLeft !== null && (
                  <p className="text-[13px] text-muted">
                    {capLeft > 0
                      ? `$${usdc(capLeft)} USDC left this month for address payments.`
                      : "Address payments have reached this month's cap."}
                  </p>
                )}
              </>
            ) : (
              <>
                <Field
                  label="Contractor's email"
                  hint="The email they signed in to Disburs with. We look them up as you type."
                >
                  <div className="relative">
                    <input
                      type="email"
                      autoComplete="off"
                      className={`${inputClass} pr-11`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kwabena@example.com"
                      aria-busy={searching || undefined}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted">
                      {searching ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : payee ? (
                        <Check size={15} className="text-accent" />
                      ) : (
                        <Search size={15} />
                      )}
                    </span>
                  </div>
                </Field>
                {notFound && (
                  <p className="text-[13.5px] text-[#A32D1C]">
                    {(search.error as Error).message}
                  </p>
                )}
                {payee && (
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-line bg-subtle px-4 py-3">
                    <div>
                      <div className="text-[14.5px] font-medium text-ink">
                        {payee.name}
                      </div>
                      <div className="text-[13px] text-muted">
                        {payee.country} ·{" "}
                        {payee.type === "BUSINESS" ? "Business" : "Individual"}{" "}
                        · cashes out to {payee.payoutCurrency}
                      </div>
                    </div>
                    <Badge variant={payee.walletActivated ? "success" : "warn"}>
                      {payee.walletActivated
                        ? "Wallet ready"
                        : "Wallet not active"}
                    </Badge>
                  </div>
                )}
              </>
            )}
          </form>
        </Card>

        <Card className={chosen ? "" : "opacity-50"}>
          <form onSubmit={send} className="flex flex-col gap-4">
            <div className="text-[15px] font-medium text-ink">2. How much?</div>
            <Field label="Amount (USDC)">
              <input
                ref={amountRef}
                inputMode="decimal"
                className={inputClass}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250.00"
                disabled={!chosen}
              />
            </Field>
            <Field
              label="Memo"
              hint="Optional. Shown on the transaction; some exchanges need one."
            >
              <input
                className={inputClass}
                maxLength={28}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="March invoice"
                disabled={!chosen}
              />
            </Field>
            {overBalance && (
              <p className="text-[13.5px] text-[#A32D1C]">
                That is more than the treasury holds (${usdc(balance)} USDC).
              </p>
            )}
            {pay.isError && (
              <p className="text-[13.5px] text-[#A32D1C]">
                {(pay.error as Error).message}
              </p>
            )}
            <div>
              <Button
                type="submit"
                disabled={
                  !chosen ||
                  (payee ? !payee.walletActivated : false) ||
                  !amountOk ||
                  overBalance ||
                  pay.isPending
                }
              >
                {pay.isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Pay {amountOk ? `$${usdc(amount)}` : ""}{" "}
                    <ArrowRight size={15} />
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
