"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
import { invoiceLabel, type Invoice, type InvoiceStatus } from "@/lib/api";
import InvoiceDetail from "@/components/invoices/InvoiceDetail";
import { usdc, when } from "@/lib/format";

const AMOUNT = /^\d+(\.\d{1,7})?$/;
const QUANTITY = /^\d+(\.\d{1,3})?$/;

type Row = { description: string; quantity: string; rate: string };
const emptyRow = (): Row => ({ description: "", quantity: "1", rate: "" });
const rowOk = (r: Row) =>
  r.description.trim().length > 0 &&
  QUANTITY.test(r.quantity) &&
  AMOUNT.test(r.rate);
/** Display-only total; the server computes the exact figure. */
const rowTotal = (r: Row) =>
  QUANTITY.test(r.quantity) && AMOUNT.test(r.rate)
    ? Number(r.quantity) * Number(r.rate)
    : 0;

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  SUBMITTED: "Waiting for a decision",
  APPROVED: "Approved · payment on its way",
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
 * own or together with others. Everything the contractor submitted is listed below.
 */
export default function ContractorInvoicesPage() {
  const invoicesOn = useFeature("invoices");
  const orgs = useInvoiceOrganizations();
  const mine = useMyInvoices();
  const submit = useSubmitInvoice();
  const cancel = useCancelInvoice();
  const [organizationId, setOrganizationId] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const org = organizationId || orgs.data?.[0]?.id || "";
  const evidenceAbove =
    orgs.data?.find((o) => o.id === org)?.requireEvidenceAbove ?? null;
  const total = rows.reduce((a, r) => a + rowTotal(r), 0);
  const periodOk = !periodStart || !periodEnd || periodEnd >= periodStart;
  const canSubmit =
    invoicesOn &&
    Boolean(org) &&
    description.trim().length >= 3 &&
    rows.length > 0 &&
    rows.every(rowOk) &&
    total > 0 &&
    periodOk &&
    !submit.isPending;

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, k) => (k === i ? { ...r, ...patch } : r)));

  const send = async () => {
    if (!canSubmit) return;
    const ok = await submit
      .mutateAsync({
        organizationId: org,
        description: description.trim(),
        items: rows.map((r) => ({
          description: r.description.trim(),
          quantity: r.quantity,
          rate: r.rate,
        })),
        ...(periodStart ? { periodStart } : {}),
        ...(periodEnd ? { periodEnd } : {}),
        ...(dueDate ? { dueDate } : {}),
        ...(evidenceUrl.trim() ? { evidenceUrl: evidenceUrl.trim() } : {}),
      })
      .then(() => true)
      .catch(() => false);
    if (ok) {
      setDescription("");
      setRows([emptyRow()]);
      setPeriodStart("");
      setPeriodEnd("");
      setDueDate("");
      setEvidenceUrl("");
    }
  };

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-5">
      <PageTitle sub="Bill the companies you work with. They approve it and pay you; you get a receipt by email.">
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
            You can invoice a company once it has added you as a contractor. Ask
            them to add the email you signed in with, on their Contractors page.
            Companies that have paid you before are listed automatically.
          </p>
        </Card>
      )}

      {invoicesOn && (orgs.data?.length ?? 0) > 0 && (
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <Field label="Summary" hint="One line: what this invoice is for.">
              <input
                className={inputClass}
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="March design work"
                aria-label="Summary"
              />
            </Field>
          </div>

          <div className="mt-5">
            <div className="mb-2 grid grid-cols-[1fr_72px_104px_96px_32px] gap-2 text-[12px] font-medium text-muted">
              <span>Item</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Rate (USDC)</span>
              <span className="text-right">Amount</span>
              <span />
            </div>
            <div className="flex flex-col gap-2">
              {rows.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_72px_104px_96px_32px] items-center gap-2"
                >
                  <input
                    className={inputClass}
                    maxLength={200}
                    value={r.description}
                    onChange={(e) => setRow(i, { description: e.target.value })}
                    placeholder="Onboarding screens"
                    aria-label={`Item ${i + 1} description`}
                  />
                  <input
                    className={`${inputClass} tabular text-right`}
                    inputMode="decimal"
                    value={r.quantity}
                    onChange={(e) =>
                      setRow(i, {
                        quantity: e.target.value.replace(/[^\d.]/g, ""),
                      })
                    }
                    aria-label={`Item ${i + 1} quantity`}
                  />
                  <input
                    className={`${inputClass} tabular text-right`}
                    inputMode="decimal"
                    value={r.rate}
                    onChange={(e) =>
                      setRow(i, { rate: e.target.value.replace(/[^\d.]/g, "") })
                    }
                    placeholder="0.00"
                    aria-label={`Item ${i + 1} rate`}
                  />
                  <span className="tabular text-right text-[14px] text-ink">
                    ${usdc(rowTotal(r))}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Remove item ${i + 1}`}
                    onClick={() =>
                      setRows((rs) => rs.filter((_, k) => k !== i))
                    }
                    disabled={rows.length === 1}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRows((rs) => [...rs, emptyRow()])}
                disabled={rows.length >= 50}
              >
                <Plus size={14} /> Add item
              </Button>
              <div className="flex items-center gap-2 text-[14px] text-muted">
                Total
                <span className="tabular font-display text-[26px] font-semibold tracking-[-0.02em] text-ink">
                  ${usdc(total)}
                </span>
                <span className="inline-flex items-center gap-1 text-[13px]">
                  <UsdcMark size={14} /> USDC
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Period from (optional)">
              <input
                type="date"
                className={inputClass}
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                aria-label="Period from"
              />
            </Field>
            <Field label="Period to (optional)">
              <input
                type="date"
                className={inputClass}
                value={periodEnd}
                min={periodStart || undefined}
                onChange={(e) => setPeriodEnd(e.target.value)}
                aria-label="Period to"
              />
            </Field>
            <Field label="Due date (optional)">
              <input
                type="date"
                className={inputClass}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Due date"
              />
            </Field>
          </div>
          {!periodOk && (
            <p className="mt-2 text-[13px] text-[#A32D1C]">
              The period cannot end before it starts.
            </p>
          )}
          <div className="mt-4">
            <Field
              label={
                evidenceAbove && total > Number(evidenceAbove)
                  ? "Evidence link (required)"
                  : "Evidence link (optional)"
              }
              hint={
                evidenceAbove
                  ? `This company requires it for invoices above $${usdc(evidenceAbove)}.`
                  : "A document, a repository, a shared folder."
              }
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
                Send {total > 0 ? `$${usdc(total)}` : "invoice"}
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
            {mine.data?.map((inv: Invoice) => {
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
                        <span className="tabular text-muted">
                          {invoiceLabel(inv.number)}
                        </span>{" "}
                        <span className="tabular font-medium">
                          ${usdc(inv.amount)}
                        </span>{" "}
                        <span className="text-muted">to</span>{" "}
                        {inv.organization?.name}
                      </div>
                      <div className="mt-0.5 text-[13.5px] text-muted">
                        {inv.description}
                      </div>
                      <div className="mt-1 text-[12.5px] text-muted">
                        {when(inv.createdAt)}
                        {inv.decisionNote ? ` · “${inv.decisionNote}”` : ""}
                      </div>
                    </button>
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
                  </div>
                  {open && <InvoiceDetail invoice={inv} />}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
