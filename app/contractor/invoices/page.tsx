"use client";

import { useState } from "react";
import { Loader2, Paperclip } from "lucide-react";
import {
  Badge,
  Card,
  Field,
  PageTitle,
  inputClass,
} from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import FeaturePaused from "@/components/FeaturePaused";
import UsdcMark from "@/components/UsdcMark";
import { useFeature } from "@/lib/hooks/useMe";
import {
  useCancelInvoice,
  useInvoiceOrganizations,
  useMyInvoices,
  useSubmitInvoice,
} from "@/lib/hooks/useInvoices";
import type { Invoice, InvoiceStatus } from "@/lib/api";
import { usdc, when } from "@/lib/format";

const AMOUNT = /^\d+(\.\d{1,7})?$/;

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  SUBMITTED: "Waiting for a decision",
  APPROVED: "Approved · paid with their next run",
  REJECTED: "Rejected",
  CANCELLED: "Withdrawn",
  PAID: "Paid",
};

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
 * A contractor invoices an organization they work with. The organization
 * approves or rejects; an approved invoice is paid with that organization's
 * next payroll run. Everything the contractor submitted is listed below.
 */
export default function ContractorInvoicesPage() {
  const invoicesOn = useFeature("invoices");
  const orgs = useInvoiceOrganizations();
  const mine = useMyInvoices();
  const submit = useSubmitInvoice();
  const cancel = useCancelInvoice();
  const [organizationId, setOrganizationId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const org = organizationId || orgs.data?.[0]?.id || "";
  const amountOk = AMOUNT.test(amount) && Number(amount) > 0;
  const canSubmit =
    invoicesOn &&
    org &&
    amountOk &&
    description.trim().length >= 3 &&
    !submit.isPending;

  const send = async () => {
    if (!canSubmit) return;
    const ok = await submit
      .mutateAsync({
        organizationId: org,
        amount,
        description: description.trim(),
        ...(evidenceUrl.trim() ? { evidenceUrl: evidenceUrl.trim() } : {}),
      })
      .then(() => true)
      .catch(() => false);
    if (ok) {
      setAmount("");
      setDescription("");
      setEvidenceUrl("");
    }
  };

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-5">
      <PageTitle sub="Bill the companies you work with. They approve, and it is paid with their next payroll run.">
        Invoices
      </PageTitle>

      {!invoicesOn && (
        <FeaturePaused title="Invoices are paused">
          Disburs has switched invoices off for now. Invoices you already sent
          are still listed below.
        </FeaturePaused>
      )}

      {invoicesOn && !orgs.isPending && (orgs.data?.length ?? 0) === 0 && (
        <Card tone="subtle">
          <p className="text-[14px] leading-[1.55] text-muted">
            You can invoice a company once it has added you to a payroll or paid
            you. Nothing to invoice yet.
          </p>
        </Card>
      )}

      {invoicesOn && (orgs.data?.length ?? 0) > 0 && (
        <Card>
          <div className="flex items-end gap-3 border-b border-line pb-4">
            <input
              className="tabular w-full min-w-0 bg-transparent font-display text-[34px] font-semibold tracking-[-0.03em] text-ink outline-none placeholder:text-faint"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0.00"
              aria-label="Amount in USDC"
            />
            <span className="inline-flex items-center gap-1.5 text-[15px] text-muted">
              <UsdcMark size={16} /> USDC
            </span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4">
            <Field label="Bill to">
              <select
                className={inputClass}
                value={org}
                onChange={(e) => setOrganizationId(e.target.value)}
                aria-label="Organization"
              >
                {orgs.data?.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="What it is for"
              hint="One or two lines. This is what they will read before approving."
            >
              <textarea
                className={`${inputClass} min-h-[88px] py-3`}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="March design work: onboarding screens and the empty states"
              />
            </Field>
            <Field
              label="Evidence link (optional)"
              hint="A document, a repository, a shared folder."
            >
              <input
                className={inputClass}
                maxLength={500}
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://"
              />
            </Field>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={send} size="lg" disabled={!canSubmit}>
              {submit.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              <span className="tabular">
                Send {amountOk ? `$${usdc(Number(amount))}` : "invoice"}
              </span>
            </Button>
            {submit.isError && (
              <span className="text-[13.5px] text-[#A32D1C]">
                {(submit.error as Error).message}
              </span>
            )}
            {submit.isSuccess && !submit.isPending && (
              <span className="text-[13.5px] font-medium text-accent">
                Sent.
              </span>
            )}
          </div>
        </Card>
      )}

      <Card padding={0}>
        <div className="border-b border-line px-6 py-4 text-[15px] font-medium text-ink">
          Your invoices
        </div>
        {mine.isPending ? (
          <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
        ) : (mine.data?.length ?? 0) === 0 ? (
          <div className="px-6 py-6 text-[14px] text-muted">
            No invoices yet.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {mine.data?.map((inv: Invoice) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-start justify-between gap-3 px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="text-[15px] text-ink">
                    <span className="tabular font-medium">
                      ${usdc(inv.amount)}
                    </span>{" "}
                    <span className="text-muted">to</span>{" "}
                    {inv.organization?.name}
                  </div>
                  <div className="mt-0.5 text-[13.5px] text-muted">
                    {inv.description}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
                    <span>{when(inv.createdAt)}</span>
                    {inv.evidenceUrl && (
                      <a
                        href={inv.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-ink underline"
                      >
                        <Paperclip size={12} /> evidence
                      </a>
                    )}
                    {inv.decisionNote && <span>· “{inv.decisionNote}”</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(inv.status)}>
                    {STATUS_LABEL[inv.status]}
                  </Badge>
                  {inv.status === "SUBMITTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancel.mutate(inv.id)}
                      disabled={cancel.isPending}
                    >
                      Withdraw
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
