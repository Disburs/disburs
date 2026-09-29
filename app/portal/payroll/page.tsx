"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Users } from "lucide-react";
import { Badge, Card, PageTitle } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { runVariant } from "@/components/portal/RunLines";
import CreatePayroll from "@/components/portal/payroll/CreatePayroll";
import { CADENCE_LABEL } from "@/components/portal/payroll/PayrollDetail";
import UsdcMark from "@/components/UsdcMark";
import { useMe } from "@/lib/hooks/useMe";
import { useDefinitions, useRuns } from "@/lib/hooks/usePayroll";
import { MONEY_ROLES } from "@/lib/api";
import { usdc, when } from "@/lib/format";

/**
 * Every payroll the organization has, as cards. An organization can run
 * several (a monthly engineering roster next to a weekly support one); each
 * card opens that payroll's own page with its roster and runs.
 */
export default function PayrollsPage() {
  const { data: me } = useMe();
  const defs = useDefinitions();
  const runs = useRuns();
  const [creating, setCreating] = useState(false);
  const canManage = Boolean(
    me?.organization?.role && MONEY_ROLES.includes(me.organization.role),
  );
  const balance = Number(me?.organization?.treasuryWallet?.balances?.usdc ?? 0);
  const all = defs.data ?? [];
  const showCreate = creating || (!defs.isPending && all.length === 0);

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub={
          all.length
            ? `${all.length} ${all.length === 1 ? "payroll" : "payrolls"} · treasury $${usdc(balance)} USDC`
            : "Set up who gets paid, then run it in one approval."
        }
        action={
          canManage && all.length > 0 && !creating ? (
            <Button onClick={() => setCreating(true)}>
              <Plus size={16} /> New payroll
            </Button>
          ) : undefined
        }
      >
        Payroll
      </PageTitle>

      {showCreate && (
        <div className="max-w-[720px]">
          <CreatePayroll
            canManage={canManage}
            first={all.length === 0}
            onCancel={all.length > 0 ? () => setCreating(false) : undefined}
            onCreated={() => setCreating(false)}
          />
        </div>
      )}

      {defs.isPending ? (
        <Card>
          <span className="text-[14px] text-muted">Loading…</span>
        </Card>
      ) : (
        all.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {all.map((d) => {
              const items = d.items.filter((i) => i.active);
              const total = items.reduce((s, i) => s + Number(i.amount), 0);
              const covered = total <= balance;
              const mine = (runs.data ?? []).filter(
                (r) => r.definitionId === d.id,
              );
              const open =
                mine.find(
                  (r) =>
                    r.status === "DRAFT" ||
                    r.status === "APPROVED" ||
                    r.status === "EXECUTING",
                ) ?? null;
              const last =
                mine.find(
                  (r) =>
                    r.status === "SETTLED" ||
                    r.status === "PARTIAL" ||
                    r.status === "FAILED",
                ) ?? null;
              return (
                <Link
                  key={d.id}
                  href={`/portal/payroll/${d.id}`}
                  className="group flex flex-col justify-between gap-6 rounded-[24px] border border-line bg-canvas p-6 transition-colors hover:border-ink"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-[18px] font-medium text-ink">
                          {d.name}
                        </h3>
                        <div className="mt-0.5 text-[13px] text-muted">
                          {CADENCE_LABEL[d.cadence]}
                        </div>
                      </div>
                      {open ? (
                        <Badge variant={runVariant(open.status)} dot>
                          {open.status === "DRAFT"
                            ? "draft waiting"
                            : open.status.toLowerCase()}
                        </Badge>
                      ) : items.length > 0 ? (
                        <Badge variant={covered ? "success" : "warn"} dot>
                          {covered ? "Covered" : "Short"}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="tabular mt-5 inline-flex items-center gap-2 font-display text-[32px] font-semibold leading-none tracking-[-0.03em] text-ink">
                      <UsdcMark size={22} /> ${usdc(total)}
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[13.5px] text-muted">
                      <Users size={14} /> {items.length}{" "}
                      {items.length === 1 ? "payee" : "payees"} per run
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-line pt-4 text-[13px]">
                    <span className="text-muted">
                      {last ? (
                        <>
                          Last run{" "}
                          {last.executedAt
                            ? when(last.executedAt)
                            : when(last.createdAt)}{" "}
                          ·{" "}
                          <span
                            className={
                              last.status === "SETTLED"
                                ? "text-accent"
                                : "text-[#A32D1C]"
                            }
                          >
                            {last.status.toLowerCase()}
                          </span>
                        </>
                      ) : (
                        "No runs yet"
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-ink group-hover:text-accent">
                      Open <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
