"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { Badge, Card, PageTitle } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import RunLines, { runVariant } from "@/components/portal/RunLines";
import { useMe } from "@/lib/hooks/useMe";
import {
  useApproveAndExecute,
  useDiscardRun,
  useExecuteRun,
  useRuns,
} from "@/lib/hooks/usePayroll";
import { toast } from "@/components/ui/sonner";
import { MONEY_ROLES } from "@/lib/api";
import { usdc, when } from "@/lib/format";

/** Every run for the active organization, newest first, with its lines. */
export default function HistoryPage() {
  const { data: me } = useMe();
  const runs = useRuns();
  const retry = useExecuteRun();
  const pay = useApproveAndExecute();
  const discard = useDiscardRun();
  const balance = Number(me?.organization?.treasuryWallet?.balances?.usdc ?? 0);
  const [open, setOpen] = useState<string | null>(null);
  const network = me?.network ?? "testnet";
  const canManage = Boolean(
    me?.organization?.role && MONEY_ROLES.includes(me.organization.role),
  );

  return (
    <div className="flex flex-col gap-5">
      <PageTitle sub="Every run, every line, with the transaction behind it.">
        History
      </PageTitle>
      <Card padding={0}>
        {runs.isPending ? (
          <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
        ) : runs.data?.length === 0 ? (
          <div className="px-6 py-6 text-[14px] text-muted">
            No runs yet. Draft one from the Payroll page.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {runs.data?.map((r) => {
              const on = open === r.id;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : r.id)}
                    aria-expanded={on}
                    className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-4 text-left"
                  >
                    <div>
                      <div className="text-[15px] font-medium text-ink">
                        {r.label}
                      </div>
                      <div className="text-[13px] text-muted">
                        {r.lineCount} payees ·{" "}
                        {r.executedAt
                          ? `paid ${when(r.executedAt)}`
                          : `drafted ${when(r.createdAt)}`}
                        {r.memo ? ` · memo ${r.memo}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular text-[14.5px] font-medium text-ink">
                        ${usdc(r.totalAmount)}
                      </span>
                      <Badge variant={runVariant(r.status)}>
                        {r.status.toLowerCase()}
                      </Badge>
                      <ChevronDown
                        size={16}
                        className={`text-muted transition-transform ${on ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  {on && (
                    <div className="border-t border-line bg-subtle">
                      <RunLines lines={r.lines} network={network} />
                      {canManage && r.status === "DRAFT" && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3">
                          <span className="text-[13.5px] text-muted">
                            {balance < Number(r.totalAmount)
                              ? `Treasury holds $${usdc(balance)}. Fund it before approving.`
                              : "Nothing moves until you approve."}
                          </span>
                          <span className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                discard.mutate(r.id, {
                                  onSuccess: () =>
                                    toast.success("Draft discarded"),
                                  onError: (e) =>
                                    toast.error("Could not discard", {
                                      description: (e as Error).message,
                                    }),
                                })
                              }
                              disabled={discard.isPending || pay.isPending}
                            >
                              Discard
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                pay.mutate(r.id, {
                                  onSuccess: (run) =>
                                    toast.success(
                                      `Run ${run.status.toLowerCase()}`,
                                      {
                                        description: `${run.lines.filter((l) => l.status === "SETTLED").length} of ${run.lineCount} lines paid.`,
                                      },
                                    ),
                                  onError: (e) =>
                                    toast.error("Could not pay", {
                                      description: (e as Error).message,
                                    }),
                                })
                              }
                              disabled={
                                pay.isPending || balance < Number(r.totalAmount)
                              }
                            >
                              {pay.isPending && pay.variables === r.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : null}{" "}
                              Approve & pay ${usdc(r.totalAmount)}{" "}
                              <ArrowRight size={14} />
                            </Button>
                          </span>
                        </div>
                      )}
                      {canManage &&
                        (r.status === "PARTIAL" || r.status === "FAILED") && (
                          <div className="border-t border-line px-6 py-3">
                            <Button
                              size="sm"
                              onClick={() => retry.mutate(r.id)}
                              disabled={retry.isPending}
                            >
                              {retry.isPending ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : null}{" "}
                              Retry failed lines
                            </Button>
                          </div>
                        )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
