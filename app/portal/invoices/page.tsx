"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Badge, Card, PageTitle, inputClass } from "@/components/portal/ui";
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
import {
  useDecideInvoice,
  useDraftRunFromInvoices,
  useOrgInvoices,
} from "@/lib/hooks/useInvoices";
import {
  MONEY_ROLES,
  invoiceLabel,
  type Invoice,
  type InvoiceStatus,
} from "@/lib/api";
import InvoiceDetail, { isOverdue } from "@/components/invoices/InvoiceDetail";
import { usdc, when } from "@/lib/format";

type Tab = "SUBMITTED" | "APPROVED" | "all";

function statusVariant(s: InvoiceStatus) {
  return s === "PAID" || s === "APPROVED"
    ? "success"
    : s === "REJECTED"
      ? "danger"
      : s === "SUBMITTED"
        ? "warn"
        : "neutral";
}

/**
 * The organization's review queue. Owners and admins approve or reject each
 * invoice with a note the contractor sees, then release approved ones as a
 * payroll run drafted from them (reviewed and paid like any other run).
 */
export default function InvoicesPage() {
  const router = useRouter();
  const { data: me } = useMe();
  const invoicesOn = useFeature("invoices");
  const canManage = Boolean(
    me?.organization?.role && MONEY_ROLES.includes(me.organization.role),
  );
  const [tab, setTab] = useState<Tab>("SUBMITTED");
  const q = useOrgInvoices(tab === "all" ? undefined : tab);
  const decide = useDecideInvoice();
  const draft = useDraftRunFromInvoices();
  const [rejecting, setRejecting] = useState<Invoice | null>(null);
  const [note, setNote] = useState("");
  const [releasing, setReleasing] = useState(false);
  const [label, setLabel] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const approved = useOrgInvoices("APPROVED");
  const releasable = (approved.data ?? []).filter((i) => !i.line);
  const releasableTotal = releasable.reduce((a, i) => a + Number(i.amount), 0);

  const approve = (inv: Invoice) =>
    decide.mutate(
      { id: inv.id, decision: "approve" },
      {
        onSuccess: () =>
          toast.success(
            `Approved $${usdc(inv.amount)} for ${inv.contractor?.name}`,
          ),
        onError: (e) =>
          toast.error("Could not approve", {
            description: (e as Error).message,
          }),
      },
    );
  const reject = () => {
    if (!rejecting) return;
    decide.mutate(
      { id: rejecting.id, decision: "reject", note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(`Rejected ${rejecting.contractor?.name}'s invoice`);
          setRejecting(null);
          setNote("");
        },
        onError: (e) =>
          toast.error("Could not reject", {
            description: (e as Error).message,
          }),
      },
    );
  };
  const release = () =>
    draft.mutate(
      {
        label:
          label.trim() ||
          `Invoices · ${new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`,
      },
      {
        onSuccess: (run) => {
          setReleasing(false);
          toast.success(
            `Run drafted: ${run.lineCount} invoice${run.lineCount === 1 ? "" : "s"}`,
            {
              description: "Review and approve it on the History page to pay.",
            },
          );
          router.push("/portal/history");
        },
        onError: (e) =>
          toast.error("Could not draft the run", {
            description: (e as Error).message,
          }),
      },
    );

  const tabs: { key: Tab; label: string }[] = [
    { key: "SUBMITTED", label: "To review" },
    { key: "APPROVED", label: "Approved" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub="Invoices from the people you work with. Approve what is right, reject what is not, release the approved ones as a run."
        action={
          canManage && invoicesOn && releasable.length > 0 ? (
            <Button onClick={() => setReleasing(true)}>
              Release {releasable.length} approved · ${usdc(releasableTotal)}
            </Button>
          ) : undefined
        }
      >
        Invoices
      </PageTitle>

      {!invoicesOn && (
        <FeaturePaused title="Invoices are paused">
          Disburs has switched invoices off for now. Existing invoices stay as
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
        ) : (q.data?.length ?? 0) === 0 ? (
          <div className="px-6 py-6 text-[14px] text-muted">
            {tab === "SUBMITTED"
              ? "Nothing waiting for a decision."
              : "No invoices here."}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {q.data?.map((inv) => {
              const open = openId === inv.id;
              return (
                <li key={inv.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : inv.id)}
                      aria-expanded={open}
                      className="min-w-0 text-left"
                    >
                      <div className="text-[15px] text-ink">
                        <span className="font-medium">
                          {inv.contractor?.name}
                        </span>{" "}
                        <span className="text-muted">asks</span>{" "}
                        <span className="tabular font-medium">
                          ${usdc(inv.amount)}
                        </span>{" "}
                        <span className="tabular text-muted">
                          · {invoiceLabel(inv.number)}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[13.5px] text-muted">
                        {inv.description}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
                        <span>{when(inv.createdAt)}</span>
                        <span>
                          · {inv.items.length} item
                          {inv.items.length === 1 ? "" : "s"}
                        </span>
                        {isOverdue(inv) && (
                          <span className="font-medium text-[#A32D1C]">
                            · overdue
                          </span>
                        )}
                        {inv.decisionNote && (
                          <span>· “{inv.decisionNote}”</span>
                        )}
                        {inv.line && (
                          <span>· in run {inv.line.status.toLowerCase()}</span>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      {inv.status === "SUBMITTED" && canManage && invoicesOn ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejecting(inv)}
                            disabled={decide.isPending}
                            className="hover:text-[#A32D1C]"
                          >
                            <X size={14} /> Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => approve(inv)}
                            disabled={decide.isPending}
                          >
                            {decide.isPending &&
                            decide.variables?.id === inv.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}{" "}
                            Approve
                          </Button>
                        </>
                      ) : (
                        <Badge variant={statusVariant(inv.status)}>
                          {inv.status.toLowerCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {open && <InvoiceDetail invoice={inv} />}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Dialog
        open={Boolean(rejecting)}
        onOpenChange={(o) => !o && setRejecting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject {rejecting?.contractor?.name}&rsquo;s invoice?
            </DialogTitle>
            <DialogDescription>
              ${rejecting ? usdc(rejecting.amount) : ""} for “
              {rejecting?.description}”. Tell them why; they see the note.
            </DialogDescription>
          </DialogHeader>
          <input
            className={`${inputClass} mt-4`}
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason (optional)"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejecting(null)}
              disabled={decide.isPending}
            >
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={reject}
              disabled={decide.isPending}
            >
              {decide.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <X size={16} />
              )}{" "}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={releasing} onOpenChange={setReleasing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Release {releasable.length} approved invoice
              {releasable.length === 1 ? "" : "s"}
            </DialogTitle>
            <DialogDescription>
              This drafts a payroll run of ${usdc(releasableTotal)} with one
              line per invoice. Nothing is paid until you approve the run on the
              History page.
            </DialogDescription>
          </DialogHeader>
          <input
            className={`${inputClass} mt-4`}
            maxLength={60}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Run label, e.g. Invoices · March"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReleasing(false)}
              disabled={draft.isPending}
            >
              Cancel
            </Button>
            <Button onClick={release} disabled={draft.isPending}>
              {draft.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}{" "}
              Draft the run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
