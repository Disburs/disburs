"use client";

import { useState } from "react";
import { Loader2, Paperclip, Plus } from "lucide-react";
import {
  Badge,
  Card,
  Field,
  PageTitle,
  inputClass,
} from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import FeaturePaused from "@/components/FeaturePaused";
import { useFeature, useMe } from "@/lib/hooks/useMe";
import { useContractors } from "@/lib/hooks/usePayments";
import {
  useCreateMilestone,
  useDecideMilestone,
  useOrgMilestones,
  usePayMilestoneNow,
} from "@/lib/hooks/useMilestones";
import { MONEY_ROLES, type Milestone, type MilestoneStatus } from "@/lib/api";
import {
  day,
  milestoneOverdue,
  milestoneVariant,
} from "@/components/milestones/shared";
import { usdc } from "@/lib/format";

const AMOUNT = /^\d+(\.\d{1,7})?$/;
type Tab = "SUBMITTED" | "PENDING" | "all";
const LABEL: Record<MilestoneStatus, string> = {
  PENDING: "in progress",
  SUBMITTED: "to review",
  APPROVED: "approved",
  PAID: "paid",
  CANCELLED: "cancelled",
};

/**
 * Milestones the organization has agreed with its contractors. Set one with
 * an amount; when the contractor marks it complete it lands under To review,
 * where an owner or admin approves and pays, or sends it back with a note.
 * Nothing is paid before the work is handed in and approved.
 */
export default function MilestonesPage() {
  const { data: me } = useMe();
  const on = useFeature("milestones");
  const canManage = Boolean(
    me?.organization?.role && MONEY_ROLES.includes(me.organization.role),
  );
  const balance = Number(me?.organization?.treasuryWallet?.balances?.usdc ?? 0);
  const q = useOrgMilestones();
  const contractors = useContractors();
  const create = useCreateMilestone();
  const decide = useDecideMilestone();
  const payNow = usePayMilestoneNow();
  const [tab, setTab] = useState<Tab>("SUBMITTED");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    contractorId: "",
    title: "",
    amount: "",
    project: "",
    description: "",
    dueDate: "",
  });
  const [sendingBack, setSendingBack] = useState<Milestone | null>(null);
  const [note, setNote] = useState("");

  const all = q.data ?? [];
  const rows = tab === "all" ? all : all.filter((m) => m.status === tab);
  const count = (s: MilestoneStatus) =>
    all.filter((m) => m.status === s).length;
  const busy = decide.isPending || payNow.isPending;
  const contractorId = form.contractorId || contractors.data?.[0]?.id || "";
  const formOk =
    Boolean(contractorId) &&
    form.title.trim().length >= 3 &&
    AMOUNT.test(form.amount) &&
    Number(form.amount) > 0;

  const submitCreate = () =>
    create.mutate(
      {
        contractorId,
        title: form.title.trim(),
        amount: form.amount,
        ...(form.project.trim() ? { project: form.project.trim() } : {}),
        ...(form.description.trim()
          ? { description: form.description.trim() }
          : {}),
        ...(form.dueDate ? { dueDate: form.dueDate } : {}),
      },
      {
        onSuccess: (m) => {
          toast.success(`Milestone set for ${m.contractor?.name}`, {
            description: "They have been emailed.",
          });
          setCreating(false);
          setForm({
            contractorId: "",
            title: "",
            amount: "",
            project: "",
            description: "",
            dueDate: "",
          });
          setTab("PENDING");
        },
      },
    );
  const pay = (m: Milestone) =>
    payNow.mutate(m.id, {
      onSuccess: (r) =>
        r.milestone.status === "PAID"
          ? toast.success(`Paid $${usdc(m.amount)} to ${m.contractor?.name}`, {
              description: `"${m.title}" is settled.`,
            })
          : toast.error("The payment did not settle", {
              description: "See History for the reason and to retry.",
            }),
      onError: (e) =>
        toast.error("Could not pay", { description: (e as Error).message }),
    });
  const act = (m: Milestone, action: "approve" | "cancel") =>
    decide.mutate(
      { id: m.id, action },
      {
        onSuccess: () =>
          toast.success(
            action === "approve"
              ? `Approved "${m.title}"`
              : `Cancelled "${m.title}"`,
          ),
        onError: (e) =>
          toast.error("Could not update", {
            description: (e as Error).message,
          }),
      },
    );
  const sendBack = () => {
    if (!sendingBack) return;
    decide.mutate(
      { id: sendingBack.id, action: "changes", note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(`Sent "${sendingBack.title}" back`);
          setSendingBack(null);
          setNote("");
        },
        onError: (e) =>
          toast.error("Could not send back", {
            description: (e as Error).message,
          }),
      },
    );
  };

  const tabs: { key: Tab; label: string }[] = [
    {
      key: "SUBMITTED",
      label: `To review${count("SUBMITTED") ? ` (${count("SUBMITTED")})` : ""}`,
    },
    { key: "PENDING", label: "In progress" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub="Agree the work and the price up front. You pay when it is delivered and you approve it."
        action={
          canManage && on ? (
            <Button onClick={() => setCreating(true)}>
              <Plus size={16} /> New milestone
            </Button>
          ) : undefined
        }
      >
        Milestones
      </PageTitle>

      {!on && (
        <FeaturePaused title="Milestones are paused">
          Disburs has switched milestones off for now. Existing ones stay as
          they are.
        </FeaturePaused>
      )}

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`h-10 rounded-full px-4 text-[14px] font-medium transition-colors ${
              tab === t.key
                ? "bg-ink-deep text-white"
                : "border border-line bg-canvas text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card padding={0}>
        {q.isPending ? (
          <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="px-6 py-6 text-[14px] text-muted">
            {tab === "SUBMITTED"
              ? "Nothing waiting for your review."
              : tab === "PENDING"
                ? "No milestones in progress."
                : "No milestones yet. Set one with New milestone."}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-start justify-between gap-3 px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="text-[15px] text-ink">
                    <span className="font-medium">{m.title}</span>{" "}
                    <span className="tabular text-muted">
                      · ${usdc(m.amount)}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[13.5px] text-muted">
                    {m.contractor?.name}
                    {m.project ? ` · ${m.project}` : ""}
                    {m.dueDate ? (
                      <span
                        className={
                          milestoneOverdue(m)
                            ? "font-medium text-[#A32D1C]"
                            : ""
                        }
                      >
                        {" "}
                        · due {day(m.dueDate)}
                        {milestoneOverdue(m) ? " (overdue)" : ""}
                      </span>
                    ) : null}
                  </div>
                  {m.description && (
                    <div className="mt-1 text-[13px] text-muted">
                      {m.description}
                    </div>
                  )}
                  {m.status !== "PENDING" &&
                    (m.completionNote || m.evidenceUrl) && (
                      <div className="mt-2 rounded-[10px] bg-subtle px-3 py-2 text-[13px] text-ink">
                        {m.completionNote && (
                          <span>&ldquo;{m.completionNote}&rdquo; </span>
                        )}
                        {m.evidenceUrl && (
                          <a
                            href={m.evidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 underline"
                          >
                            <Paperclip size={12} /> the work
                          </a>
                        )}
                      </div>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {m.status === "SUBMITTED" && canManage && on ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSendingBack(m)}
                        disabled={busy}
                      >
                        Request changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => act(m, "approve")}
                        disabled={busy}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => pay(m)}
                        disabled={busy || balance < Number(m.amount)}
                        title={
                          balance < Number(m.amount)
                            ? `Treasury holds $${usdc(balance)}`
                            : undefined
                        }
                      >
                        {payNow.isPending && payNow.variables === m.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : null}{" "}
                        Approve & pay
                      </Button>
                    </>
                  ) : m.status === "APPROVED" && !m.line && canManage && on ? (
                    <Button
                      size="sm"
                      onClick={() => pay(m)}
                      disabled={busy || balance < Number(m.amount)}
                      title={
                        balance < Number(m.amount)
                          ? `Treasury holds $${usdc(balance)}`
                          : undefined
                      }
                    >
                      {payNow.isPending && payNow.variables === m.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : null}{" "}
                      Pay now
                    </Button>
                  ) : (
                    <>
                      <Badge variant={milestoneVariant(m.status)}>
                        {LABEL[m.status]}
                      </Badge>
                      {m.status === "PENDING" && canManage && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => act(m, "cancel")}
                          disabled={busy}
                          className="hover:text-[#A32D1C]"
                        >
                          Cancel
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog
        open={creating}
        onOpenChange={(o) => {
          setCreating(o);
          if (!o) create.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New milestone</DialogTitle>
            <DialogDescription>
              The contractor is emailed. Nothing is paid until they mark it
              complete and you approve.
            </DialogDescription>
          </DialogHeader>
          {(contractors.data?.length ?? 0) === 0 ? (
            <p className="mt-4 text-[14px] text-muted">
              Add a contractor first, on the Contractors page.
            </p>
          ) : (
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (formOk) submitCreate();
              }}
            >
              <Field label="Contractor">
                <select
                  className={inputClass}
                  value={contractorId}
                  onChange={(e) =>
                    setForm({ ...form, contractorId: e.target.value })
                  }
                  aria-label="Contractor"
                >
                  {contractors.data?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="What is delivered">
                <input
                  className={inputClass}
                  maxLength={120}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Homepage design, final"
                  aria-label="Milestone title"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Amount (USDC)">
                  <input
                    className={`${inputClass} tabular`}
                    inputMode="decimal"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value.replace(/[^\d.]/g, ""),
                      })
                    }
                    placeholder="800"
                    aria-label="Milestone amount"
                  />
                </Field>
                <Field label="Due (optional)">
                  <input
                    type="date"
                    className={inputClass}
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                    aria-label="Milestone due date"
                  />
                </Field>
              </div>
              <Field label="Project (optional)">
                <input
                  className={inputClass}
                  maxLength={80}
                  value={form.project}
                  onChange={(e) =>
                    setForm({ ...form, project: e.target.value })
                  }
                  placeholder="Website redesign"
                  aria-label="Project"
                />
              </Field>
              <Field label="What done means (optional)">
                <textarea
                  className={`${inputClass} min-h-[72px] py-3`}
                  maxLength={500}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  aria-label="Milestone description"
                />
              </Field>
              {create.isError && (
                <p className="text-[13.5px] text-[#A32D1C]">
                  {(create.error as Error).message}
                </p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreating(false)}
                  disabled={create.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!formOk || create.isPending}>
                  {create.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}{" "}
                  Set milestone
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(sendingBack)}
        onOpenChange={(o) => !o && setSendingBack(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Request changes on &ldquo;{sendingBack?.title}&rdquo;
            </DialogTitle>
            <DialogDescription>
              It goes back to {sendingBack?.contractor?.name} with your note.
              They mark it complete again when it is ready.
            </DialogDescription>
          </DialogHeader>
          <input
            className={`${inputClass} mt-4`}
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What to change"
            aria-label="What to change"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSendingBack(null)}
              disabled={decide.isPending}
            >
              Cancel
            </Button>
            <Button onClick={sendBack} disabled={decide.isPending}>
              {decide.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}{" "}
              Send back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
