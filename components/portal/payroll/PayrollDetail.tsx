"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Card,
  Field,
  PageTitle,
  inputClass,
} from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import RunLines, { runVariant } from "@/components/portal/RunLines";
import UsdcMark from "@/components/UsdcMark";
import { useFeature, useMe } from "@/lib/hooks/useMe";
import FeaturePaused from "@/components/FeaturePaused";
import {
  useApproveAndExecute,
  useCreateRun,
  useDefinitions,
  useDiscardRun,
  useRemoveItem,
  useRuns,
  useUpdateDefinition,
  useUpsertItem,
} from "@/lib/hooks/usePayroll";
import {
  MONEY_ROLES,
  type PayrollDefinition,
  type PayrollRun,
} from "@/lib/api";
import { usdc, when } from "@/lib/format";
import { ArchiveButton, DeleteButton, RestoreButton } from "./PayrollActions";

function monthLabel() {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
}

export const CADENCE_LABEL = {
  MONTHLY: "Monthly",
  BIWEEKLY: "Every two weeks",
  WEEKLY: "Weekly",
  MANUAL: "Manual",
} as const;

/**
 * One payroll: its roster on the left, its current run on the right.
 * Draft → review → approve & pay → per-line result. The backend snapshots
 * lines at draft time and pays them in one transaction per 100.
 */
export default function PayrollDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: me } = useMe();
  const payrollOn = useFeature("payroll");
  const active = useDefinitions(false);
  const archived = useDefinitions(true);
  const defs = {
    isPending: active.isPending || archived.isPending,
    data:
      active.data && archived.data
        ? [...active.data, ...archived.data]
        : undefined,
  };
  const runs = useRuns();
  const canManage = Boolean(
    me?.organization?.role && MONEY_ROLES.includes(me.organization.role),
  );
  const network = me?.network ?? "testnet";
  const balance = Number(me?.organization?.treasuryWallet?.balances?.usdc ?? 0);

  const def = defs.data?.find((d) => d.id === id) ?? null;

  // Runs drafted from this payroll only.
  const forDef = (r: PayrollRun) => r.definitionId === id;
  // A run that just finished stays on screen until dismissed, so the result is seen.
  const [completed, setCompleted] = useState<PayrollRun | null>(null);
  const openRun = useMemo(
    () =>
      runs.data?.find(
        (r) =>
          forDef(r) &&
          (r.status === "DRAFT" ||
            r.status === "APPROVED" ||
            r.status === "EXECUTING"),
      ) ?? null,
    [runs.data, def?.id], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const shownRun =
    openRun ?? (completed && forDef(completed) ? completed : null);
  const lastRun =
    runs.data?.find(
      (r) =>
        forDef(r) &&
        (r.status === "SETTLED" ||
          r.status === "PARTIAL" ||
          r.status === "FAILED"),
    ) ?? null;

  if (!defs.isPending && !def) {
    return (
      <div className="flex flex-col gap-5">
        <Link
          href="/portal/payroll"
          className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink"
        >
          <ArrowLeft size={15} /> All payrolls
        </Link>
        <Card>
          <span className="text-[14px] text-muted">
            That payroll no longer exists.
          </span>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/portal/payroll"
        className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> All payrolls
      </Link>
      {def?.archivedAt && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-[#FBF1DC] px-5 py-4 text-[#8A5A00]">
          <span className="text-[14.5px]">
            Archived {when(def.archivedAt)}. It will be deleted for good{" "}
            {def.purgeAt
              ? when(def.purgeAt)
              : `in ${me?.settings?.archiveRetentionDays ?? 30} days`}{" "}
            unless you restore it. No runs can be drafted meanwhile.
          </span>
          {canManage && <RestoreButton def={def} />}
        </div>
      )}
      <PageTitle
        sub={
          def ? (
            <>
              {CADENCE_LABEL[def.cadence]} ·{" "}
              {def.items.filter((i) => i.active).length} on the roster
            </>
          ) : (
            "Loading…"
          )
        }
      >
        {def?.name ?? "Payroll"}
      </PageTitle>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {defs.isPending ? (
            <Card>
              <span className="text-[14px] text-muted">Loading…</span>
            </Card>
          ) : def ? (
            <Roster
              def={def}
              canManage={canManage}
              onDeleted={() => router.replace("/portal/payroll")}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-5 lg:col-span-2">
          {shownRun ? (
            <RunPanel
              run={shownRun}
              network={network}
              balance={balance}
              canManage={canManage}
              onDone={setCompleted}
              onDismiss={() => setCompleted(null)}
            />
          ) : (
            def &&
            !def.archivedAt &&
            (payrollOn ? (
              <DraftPanel
                key={def.id}
                def={def}
                canManage={canManage}
                balance={balance}
              />
            ) : (
              <FeaturePaused title="Payroll runs are paused">
                Disburs has switched payroll runs off for now. This payroll and
                its past runs are safe; drafting and paying resume when it is
                back on.
              </FeaturePaused>
            ))
          )}
          {lastRun && (
            <Card padding={0}>
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <div>
                  <div className="text-[13px] text-muted">Last run</div>
                  <div className="text-[15px] font-medium text-ink">
                    {lastRun.label}
                  </div>
                </div>
                <Badge variant={runVariant(lastRun.status)}>
                  {lastRun.status.toLowerCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between px-6 py-4 text-[14px]">
                <span className="text-muted">
                  {lastRun.lineCount} payees ·{" "}
                  {lastRun.executedAt
                    ? when(lastRun.executedAt)
                    : when(lastRun.createdAt)}
                </span>
                <span className="tabular font-medium text-ink">
                  ${usdc(lastRun.totalAmount)}
                </span>
              </div>
              <div className="border-t border-line px-6 py-3">
                <Link
                  href="/portal/history"
                  className="inline-flex items-center gap-1 text-[13.5px] font-medium text-accent"
                >
                  All runs <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- roster -------------------------------- */

function Roster({
  def,
  canManage,
  onDeleted,
}: {
  def: PayrollDefinition;
  canManage: boolean;
  onDeleted: () => void;
}) {
  const upsert = useUpsertItem(def.id);
  const remove = useRemoveItem(def.id);
  const update = useUpdateDefinition(def.id);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(def.name);
  const [draftCadence, setDraftCadence] = useState(def.cadence);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const items = def.items.filter((i) => i.active);
  const total = items.reduce((s, i) => s + Number(i.amount), 0);
  const amountOk = /^\d+(\.\d{1,7})?$/.test(amount) && Number(amount) > 0;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !amountOk || upsert.isPending) return;
    upsert.mutate(
      { email: email.trim(), amount, active: true },
      {
        onSuccess: () => {
          setEmail("");
          setAmount("");
        },
      },
    );
  };

  return (
    <Card padding={0}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        {editing ? (
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              update.mutate(
                { name: draftName.trim() || def.name, cadence: draftCadence },
                { onSuccess: () => setEditing(false) },
              );
            }}
          >
            <input
              className={`${inputClass} h-10 w-[220px]`}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              maxLength={120}
              autoFocus
            />
            <select
              className={`${inputClass} h-10 w-[170px]`}
              value={draftCadence}
              onChange={(e) =>
                setDraftCadence(e.target.value as PayrollDefinition["cadence"])
              }
            >
              {(
                Object.keys(CADENCE_LABEL) as PayrollDefinition["cadence"][]
              ).map((c) => (
                <option key={c} value={c}>
                  {CADENCE_LABEL[c]}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" disabled={update.isPending}>
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-[16px] font-medium text-ink">{def.name}</h3>
              <div className="text-[13px] text-muted">
                {CADENCE_LABEL[def.cadence]}
              </div>
            </div>
            {canManage && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Rename payroll"
                  onClick={() => {
                    setDraftName(def.name);
                    setDraftCadence(def.cadence);
                    setEditing(true);
                  }}
                  className="h-8 w-8"
                >
                  <Pencil size={13} />
                </Button>
                {def.archivedAt ? (
                  <RestoreButton def={def} size="icon" />
                ) : (
                  <ArchiveButton def={def} onArchived={onDeleted} />
                )}
                <DeleteButton def={def} onDeleted={onDeleted} />
              </>
            )}
          </div>
        )}
        <div className="text-right">
          <div className="text-[12.5px] text-muted">Per run</div>
          <div className="tabular inline-flex items-center gap-1.5 text-[16px] font-medium text-ink">
            <UsdcMark size={16} /> ${usdc(total)}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-6 text-[14px] text-muted">
          Nobody on the roster yet. Add contractors by the email they signed in
          with.
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((i) => (
            <li
              key={i.id}
              className="flex items-center justify-between gap-3 px-6 py-3.5"
            >
              <div className="min-w-0">
                <div className="truncate text-[14.5px] text-ink">
                  {i.contractor?.name ?? <RosterName id={i.contractorId} />}
                </div>
                {i.note && (
                  <div className="text-[13px] text-muted">{i.note}</div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="tabular text-[14.5px] font-medium text-ink">
                  ${usdc(i.amount)}
                </span>
                {canManage && (
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Remove from roster"
                    onClick={() => remove.mutate(i.id)}
                    disabled={remove.isPending}
                    className="h-8 w-8"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {canManage && (
        <form
          onSubmit={add}
          className="grid grid-cols-1 gap-3 border-t border-line px-6 py-4 sm:grid-cols-[1fr_140px_auto] sm:items-end"
        >
          <Field label="Contractor email">
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kwabena@example.com"
            />
          </Field>
          <Field label="Amount (USDC)">
            <input
              inputMode="decimal"
              className={inputClass}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1200.00"
            />
          </Field>
          <Button
            type="submit"
            size="lg"
            disabled={!email.trim() || !amountOk || upsert.isPending}
          >
            {upsert.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Plus size={15} />
            )}{" "}
            Add
          </Button>
          {upsert.isError && (
            <p className="text-[13.5px] text-[#A32D1C] sm:col-span-3">
              {(upsert.error as Error).message}
            </p>
          )}
        </form>
      )}
    </Card>
  );
}

/** Items from the list endpoint carry only contractorId; the last run's lines know the name. */
function RosterName({ id }: { id: string }) {
  const runs = useRuns();
  const name = runs.data
    ?.flatMap((r) => r.lines)
    .find((l) => l.contractorId === id)?.payeeName;
  return <>{name ?? "Contractor"}</>;
}

/* ------------------------------- run panels ------------------------------ */

function DraftPanel({
  def,
  canManage,
  balance,
}: {
  def: PayrollDefinition;
  canManage: boolean;
  balance: number;
}) {
  const create = useCreateRun();
  const [label, setLabel] = useState(monthLabel());
  const [memo, setMemo] = useState(def.memo ?? "");
  const items = def.items.filter((i) => i.active);
  const total = items.reduce((s, i) => s + Number(i.amount), 0);
  return (
    <Card>
      <h3 className="text-[16px] font-medium text-ink">Draft a run</h3>
      <p className="mt-1 text-[14px] leading-[1.5] text-muted">
        Snapshots the roster as it is now. Nothing moves until you approve.
      </p>
      <dl className="mt-4 divide-y divide-line border-y border-line text-[14px]">
        <div className="flex justify-between py-2.5">
          <dt className="text-muted">Payees</dt>
          <dd className="text-ink">{items.length}</dd>
        </div>
        <div className="flex justify-between py-2.5">
          <dt className="text-muted">Total</dt>
          <dd className="tabular font-medium text-ink">${usdc(total)}</dd>
        </div>
        <div className="flex justify-between py-2.5">
          <dt className="text-muted">Treasury</dt>
          <dd
            className={`tabular ${balance >= total ? "text-ink" : "text-[#A32D1C]"}`}
          >
            ${usdc(balance)}
          </dd>
        </div>
      </dl>
      {canManage ? (
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate({
              definitionId: def.id,
              label: label.trim() || monthLabel(),
              ...(memo.trim() ? { memo: memo.trim() } : {}),
            });
          }}
        >
          <Field label="Label">
            <input
              className={inputClass}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={60}
            />
          </Field>
          <Field
            label="Memo"
            hint="Optional. One memo for the whole run; shows on the transaction."
          >
            <input
              className={inputClass}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              maxLength={28}
              placeholder="March salary"
            />
          </Field>
          {create.isError && (
            <p className="text-[13.5px] text-[#A32D1C]">
              {(create.error as Error).message}
            </p>
          )}
          <Button
            type="submit"
            disabled={items.length === 0 || create.isPending}
            className="w-full"
          >
            {create.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : null}{" "}
            Draft run
          </Button>
        </form>
      ) : (
        <p className="mt-4 text-[14px] text-muted">
          Owners and admins draft and approve runs.
        </p>
      )}
    </Card>
  );
}

function RunPanel({
  run,
  network,
  balance,
  canManage,
  onDone,
  onDismiss,
}: {
  run: PayrollRun;
  network: string;
  balance: number;
  canManage: boolean;
  onDone: (r: PayrollRun) => void;
  onDismiss: () => void;
}) {
  const go = useApproveAndExecute();
  const discard = useDiscardRun();
  const total = Number(run.totalAmount);
  const shown = run;
  const settled = shown.lines.filter((l) => l.status === "SETTLED").length;

  return (
    <Card padding={0}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <div>
          <div className="text-[13px] text-muted">
            {shown.status === "DRAFT" ? "Ready to approve" : "Run"}
          </div>
          <div className="text-[16px] font-medium text-ink">{shown.label}</div>
        </div>
        <Badge variant={runVariant(shown.status)} dot>
          {shown.status.toLowerCase()}
        </Badge>
      </div>
      <RunLines lines={shown.lines} network={network} />
      <div className="border-t border-line px-6 py-4">
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-muted">Total · {shown.lineCount} payees</span>
          <span className="tabular inline-flex items-center gap-1.5 font-medium text-ink">
            <UsdcMark size={15} /> ${usdc(total)}
          </span>
        </div>
        {shown.status === "DRAFT" && balance < total && (
          <p className="mt-2 text-[13.5px] text-[#A32D1C]">
            Treasury holds ${usdc(balance)}. Fund it before approving.
          </p>
        )}
        {go.isError && (
          <p className="mt-2 text-[13.5px] text-[#A32D1C]">
            {(go.error as Error).message}
          </p>
        )}
        {shown.status === "SETTLED" && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
              <Check size={14} strokeWidth={2.5} /> {settled} of{" "}
              {shown.lineCount} paid in one transaction.
            </p>
            <Button size="sm" onClick={onDismiss}>
              Start next run
            </Button>
          </div>
        )}
        {canManage &&
          (shown.status === "DRAFT" ||
            shown.status === "APPROVED" ||
            shown.status === "PARTIAL" ||
            shown.status === "FAILED") && (
            <div className="mt-4 flex flex-col gap-2">
              <Button
                disabled={
                  go.isPending || (shown.status === "DRAFT" && balance < total)
                }
                onClick={() => go.mutate(run.id, { onSuccess: onDone })}
                className="w-full"
              >
                {go.isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Paying…
                  </>
                ) : shown.status === "DRAFT" ? (
                  <>
                    Approve & pay ${usdc(total)} <ArrowRight size={15} />
                  </>
                ) : (
                  "Retry failed lines"
                )}
              </Button>
              {shown.status === "DRAFT" && (
                <Button
                  variant="outline"
                  onClick={() => discard.mutate(run.id)}
                  disabled={discard.isPending || go.isPending}
                  className="w-full"
                >
                  Discard draft
                </Button>
              )}
            </div>
          )}
      </div>
    </Card>
  );
}
