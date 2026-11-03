"use client";

import { useState } from "react";
import { Loader2, Paperclip } from "lucide-react";
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
import { useFeature } from "@/lib/hooks/useMe";
import {
  useCompleteMilestone,
  useMyMilestones,
} from "@/lib/hooks/useMilestones";
import type { Milestone, MilestoneStatus } from "@/lib/api";
import {
  day,
  milestoneOverdue,
  milestoneVariant,
} from "@/components/milestones/shared";
import { usdc } from "@/lib/format";

const LABEL: Record<MilestoneStatus, string> = {
  PENDING: "To do",
  SUBMITTED: "Waiting for approval",
  APPROVED: "Approved · payment on its way",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

/**
 * The deliverables companies have agreed with this contractor. When one is
 * done, the contractor marks it complete with a note and a link; the company
 * approves and pays, or sends it back with what to change.
 */
export default function ContractorMilestonesPage() {
  const on = useFeature("milestones");
  const q = useMyMilestones();
  const complete = useCompleteMilestone();
  const [target, setTarget] = useState<Milestone | null>(null);
  const [note, setNote] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const submit = () => {
    if (!target) return;
    complete.mutate(
      {
        id: target.id,
        note: note.trim() || undefined,
        evidenceUrl: evidenceUrl.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`"${target.title}" marked complete`, {
            description: `${target.organization?.name} has been told.`,
          });
          setTarget(null);
          setNote("");
          setEvidenceUrl("");
        },
        onError: (e) =>
          toast.error("Could not mark complete", {
            description: (e as Error).message,
          }),
      },
    );
  };

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-5">
      <PageTitle sub="Work a company agreed with you up front. Mark it complete when it is done; they approve and pay.">
        Milestones
      </PageTitle>
      {!on && (
        <FeaturePaused title="Milestones are paused">
          Disburs has switched milestones off for now. Yours are still listed
          below.
        </FeaturePaused>
      )}
      <Card padding={0}>
        {q.isPending ? (
          <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
        ) : (q.data?.length ?? 0) === 0 ? (
          <div className="px-6 py-6 text-[14px] leading-[1.55] text-muted">
            No milestones yet. A company you work with sets them, with an amount
            for each. They appear here when it does.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {q.data?.map((m) => (
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
                    {m.organization?.name}
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
                  {m.status === "PENDING" && m.decisionNote && (
                    <div className="mt-2 rounded-[10px] bg-[#FBF1DC] px-3 py-2 text-[13px] text-[#8A5A00]">
                      Changes requested: {m.decisionNote}
                    </div>
                  )}
                  {m.evidenceUrl && (
                    <a
                      href={m.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[12.5px] text-ink underline"
                    >
                      <Paperclip size={12} /> what you handed in
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={milestoneVariant(m.status)}>
                    {LABEL[m.status]}
                  </Badge>
                  {m.status === "PENDING" && on && (
                    <Button size="sm" onClick={() => setTarget(m)}>
                      Mark complete
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog
        open={Boolean(target)}
        onOpenChange={(o) => !o && setTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Mark &ldquo;{target?.title}&rdquo; complete?
            </DialogTitle>
            <DialogDescription>
              {target?.organization?.name} reviews it and pays $
              {target ? usdc(target.amount) : ""} on approval, or sends it back
              with what to change.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-3">
            <textarea
              className={`${inputClass} min-h-[80px] py-3`}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What you delivered (optional)"
              aria-label="Completion note"
            />
            <input
              className={inputClass}
              maxLength={500}
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="Link to the work (optional), https://"
              aria-label="Link to the work"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTarget(null)}
              disabled={complete.isPending}
            >
              Not yet
            </Button>
            <Button onClick={submit} disabled={complete.isPending}>
              {complete.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}{" "}
              Mark complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
