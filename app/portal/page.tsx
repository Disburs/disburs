"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Send,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  PageTitle,
  StatTile,
} from "@/components/portal/ui";
import { runVariant } from "@/components/portal/RunLines";
import { useMe } from "@/lib/hooks/useMe";
import { useContractors, useLedger } from "@/lib/hooks/usePayments";
import { useDefinitions, useRuns } from "@/lib/hooks/usePayroll";
import { MONEY_ROLES, explorerUrl } from "@/lib/api";
import { shortKey, usdc, when } from "@/lib/format";

const CADENCE = {
  MONTHLY: "Monthly",
  BIWEEKLY: "Every two weeks",
  WEEKLY: "Weekly",
  MANUAL: "Manual",
} as const;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/**
 * The employer dashboard, entirely from the backend: treasury balance, the
 * payrolls set up for this organization and whether the treasury covers
 * them, a few figures, the latest runs, and the ledger of what moved.
 */
export default function DashboardPage() {
  const { data: me } = useMe();
  const defs = useDefinitions();
  const runs = useRuns();
  const ledger = useLedger();
  const contractors = useContractors();

  const org = me?.organization ?? null;
  const firstName = (me?.user.name || me?.user.email || "there").split(
    /[\s@]/,
  )[0];
  const network = me?.network ?? "testnet";
  const canManage = Boolean(org?.role && MONEY_ROLES.includes(org.role));
  const balance = org?.treasuryWallet?.balances?.usdc ?? null;
  const balanceNum = balance == null ? null : Number(balance);

  const payrolls = (defs.data ?? []).map((d) => {
    const items = d.items.filter((i) => i.active);
    const total = items.reduce((acc, i) => acc + Number(i.amount), 0);
    return { ...d, payees: items.length, total };
  });
  const largest = payrolls.reduce<(typeof payrolls)[number] | null>(
    (best, p) => (!best || p.total > best.total ? p : best),
    null,
  );
  const shortfall =
    largest && balanceNum != null && largest.total > balanceNum
      ? largest.total - balanceNum
      : 0;

  const orgLedger = (ledger.data ?? []).filter(
    (e) => e.organizationId && e.organizationId === org?.id,
  );
  const now = new Date();
  const paidThisMonth = orgLedger
    .filter(
      (e) =>
        e.status === "SETTLED" &&
        new Date(e.createdAt).getMonth() === now.getMonth() &&
        new Date(e.createdAt).getFullYear() === now.getFullYear(),
    )
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const settledRuns = (runs.data ?? []).filter(
    (r) => r.status === "SETTLED",
  ).length;
  const countries = new Set((contractors.data ?? []).map((c) => c.country))
    .size;
  const nameOf = (contractorId: string | null) =>
    (contractors.data ?? []).find((c) => c.id === contractorId)?.name ?? null;

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub={
          org ? (
            <>Here&rsquo;s where {org.name} stands.</>
          ) : (
            "Loading your organization…"
          )
        }
        action={
          canManage ? (
            <Button href="/portal/pay" variant="secondary">
              <Send size={16} className="text-accent" /> Pay someone
            </Button>
          ) : undefined
        }
      >
        {greeting()}, {firstName}.
      </PageTitle>

      {shortfall > 0 && largest && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-[#FBF1DC] px-5 py-4 text-[#8A5A00]">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="shrink-0" />
            <span className="text-[14.5px]">
              Balance is{" "}
              <strong className="font-semibold">${usdc(balance)}</strong>. Your{" "}
              {largest.name} payroll needs{" "}
              <strong className="font-semibold">${usdc(largest.total)}</strong>.
              Top up{" "}
              <strong className="font-semibold">${usdc(shortfall)}</strong> to
              stay covered.
            </span>
          </div>
          <Button href="/portal/wallet" size="sm">
            Top up treasury
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Payrolls */}
          <Card padding={0}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
              <h3 className="text-[16px] font-medium text-ink">
                Your payrolls
              </h3>
              <Link
                href="/portal/payroll"
                className="flex items-center gap-1 text-[13px] font-medium text-accent"
              >
                Manage <ArrowUpRight size={14} />
              </Link>
            </div>
            {defs.isPending ? (
              <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
            ) : payrolls.length === 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6">
                <p className="max-w-[440px] text-[14.5px] leading-[1.5] text-muted">
                  No payroll yet. Set up who gets paid and how often, then run
                  it in one approval.
                </p>
                {canManage && (
                  <Button href="/portal/payroll" variant="ink">
                    Create a payroll <ArrowRight size={16} />
                  </Button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {payrolls.map((p) => {
                  const covered = balanceNum == null || p.total <= balanceNum;
                  return (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                    >
                      <div>
                        <div className="text-[15px] font-medium text-ink">
                          {p.name}
                        </div>
                        <div className="text-[13px] text-muted">
                          {CADENCE[p.cadence]} · {p.payees}{" "}
                          {p.payees === 1 ? "payee" : "payees"}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="tabular font-display text-[22px] font-semibold tracking-[-0.03em] text-ink">
                          ${usdc(p.total)}
                        </span>
                        <Badge variant={covered ? "success" : "warn"} dot>
                          {covered ? "Covered" : "Short"}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Figures */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatTile
              label="Contractors"
              value={
                contractors.isPending
                  ? "—"
                  : String(contractors.data?.length ?? 0)
              }
              sub={
                countries > 0
                  ? `across ${countries} ${countries === 1 ? "country" : "countries"}`
                  : "on a roster or paid before"
              }
            />
            <StatTile
              label="Paid this month"
              value={ledger.isPending ? "—" : `$${usdc(paidThisMonth)}`}
              sub={now.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            />
            <StatTile
              label="Runs settled"
              value={runs.isPending ? "—" : String(settledRuns)}
              sub={`${runs.data?.length ?? 0} in total`}
            />
          </div>

          {/* Recent runs */}
          <Card padding={0}>
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="text-[16px] font-medium text-ink">
                Recent payroll runs
              </h3>
              <Link
                href="/portal/history"
                className="flex items-center gap-1 text-[13px] font-medium text-accent"
              >
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            {runs.isPending ? (
              <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
            ) : (runs.data ?? []).length === 0 ? (
              <div className="px-6 py-6 text-[14px] text-muted">
                No runs yet. Your first run will show here with its transaction.
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {(runs.data ?? []).slice(0, 3).map((r) => {
                  const tx = r.lines.find((l) => l.txHash)?.txHash ?? null;
                  return (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                    >
                      <div className="min-w-0">
                        <div className="text-[14.5px] text-ink">{r.label}</div>
                        <div className="text-[13px] text-muted">
                          {r.lineCount} {r.lineCount === 1 ? "payee" : "payees"}{" "}
                          ·{" "}
                          {r.executedAt
                            ? when(r.executedAt)
                            : `drafted ${when(r.createdAt)}`}
                          {tx && (
                            <>
                              {" · "}
                              <a
                                href={explorerUrl(network, "tx", tx)}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono hover:text-ink"
                              >
                                {shortKey(tx, 6, 4)}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="tabular text-[14.5px] font-medium text-ink">
                          ${usdc(r.totalAmount)}
                        </span>
                        <Badge variant={runVariant(r.status)}>
                          {r.status.toLowerCase()}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        {/* Activity: the org's ledger */}
        <div className="lg:col-span-1">
          <Card padding={0} className="h-full">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="text-[16px] font-medium text-ink">Activity</h3>
              <span className="text-[13px] text-muted">
                {orgLedger.length} on record
              </span>
            </div>
            <div className="px-6 pb-5">
              {ledger.isPending ? (
                <div className="py-6 text-[14px] text-muted">Loading…</div>
              ) : orgLedger.length === 0 ? (
                <div className="py-6 text-[14px] leading-[1.5] text-muted">
                  Nothing has moved yet. Payouts and sends from the treasury
                  will appear here with their transactions.
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {orgLedger.slice(0, 8).map((e) => {
                    const who = nameOf(e.contractorId);
                    return (
                      <li key={e.id} className="flex gap-3 py-4">
                        <span
                          className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                            e.status === "SETTLED"
                              ? "bg-accent"
                              : e.status === "FAILED"
                                ? "bg-[#A32D1C]"
                                : "bg-[#8A5A00]"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] leading-[1.5] text-ink">
                            {e.type === "PAYOUT" ? "Paid" : "Sent"}{" "}
                            <span className="tabular font-medium">
                              ${usdc(e.amount)}
                            </span>{" "}
                            to{" "}
                            {who ?? (
                              <span className="font-mono">
                                {e.destination ? shortKey(e.destination) : "—"}
                              </span>
                            )}
                            {e.status === "FAILED" && (
                              <span className="text-[#A32D1C]"> · failed</span>
                            )}
                            {e.status === "PENDING" && (
                              <span className="text-[#8A5A00]"> · pending</span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-[13px] text-muted">
                            {when(e.createdAt)}
                            {e.txHash && (
                              <a
                                href={explorerUrl(network, "tx", e.txHash)}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="View transaction"
                                className="hover:text-ink"
                              >
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link
                href="/portal/contractors"
                className="mt-2 flex items-center gap-1 text-[13px] font-medium text-accent"
              >
                <Users size={14} /> See your contractors{" "}
                <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
