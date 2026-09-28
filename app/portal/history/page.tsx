"use client";

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Badge, Card, PageTitle } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import RunLines, { runVariant } from "@/components/portal/RunLines";
import { useMe } from "@/lib/hooks/useMe";
import { useExecuteRun, useRuns } from "@/lib/hooks/usePayroll";
import { MONEY_ROLES } from "@/lib/api";
import { usdc, when } from "@/lib/format";

/** Every run for the active organization, newest first, with its lines. */
export default function HistoryPage() {
  const { data: me } = useMe();
  const runs = useRuns();
  const retry = useExecuteRun();
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
