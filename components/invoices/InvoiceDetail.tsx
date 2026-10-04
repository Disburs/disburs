import { Paperclip } from "lucide-react";
import { invoiceLabel, type Invoice } from "@/lib/api";
import { usdc } from "@/lib/format";

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

/** "1 Mar 2026 – 31 Mar 2026", or a single date when only one end is set. */
export function periodText(inv: Pick<Invoice, "periodStart" | "periodEnd">) {
  if (inv.periodStart && inv.periodEnd)
    return `${day(inv.periodStart)} – ${day(inv.periodEnd)}`;
  if (inv.periodStart) return `from ${day(inv.periodStart)}`;
  if (inv.periodEnd) return `until ${day(inv.periodEnd)}`;
  return null;
}

/** Whether an unpaid invoice is past its due date. */
export function isOverdue(inv: Pick<Invoice, "dueDate" | "status">) {
  if (
    !inv.dueDate ||
    inv.status === "PAID" ||
    inv.status === "REJECTED" ||
    inv.status === "CANCELLED"
  )
    return false;
  return new Date(inv.dueDate).getTime() + 24 * 60 * 60_000 < Date.now();
}

/**
 * The body of an invoice as both sides read it: number, period, due date,
 * the lines with quantity × rate, and the total. Used in the contractor's
 * list and the organization's review queue, so they always agree.
 */
export default function InvoiceDetail({ invoice }: { invoice: Invoice }) {
  const period = periodText(invoice);
  return (
    <div className="mt-3 rounded-[14px] border border-line bg-canvas">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-line px-4 py-2.5 text-[12.5px] text-muted">
        <span className="tabular font-medium text-ink">
          {invoiceLabel(invoice.number)}
        </span>
        {period && <span>Period {period}</span>}
        {invoice.dueDate && (
          <span
            className={isOverdue(invoice) ? "font-medium text-[#A32D1C]" : ""}
          >
            Due {day(invoice.dueDate)}
            {isOverdue(invoice) ? " · overdue" : ""}
          </span>
        )}
        {invoice.evidenceUrl && (
          <a
            href={invoice.evidenceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-ink underline"
          >
            <Paperclip size={12} /> evidence
          </a>
        )}
      </div>
      <table className="w-full text-left text-[13.5px]">
        <thead>
          <tr className="text-[12px] text-muted">
            <th className="px-4 py-2 font-medium">Item</th>
            <th className="px-2 py-2 text-right font-medium">Qty</th>
            <th className="px-2 py-2 text-right font-medium">Rate</th>
            <th className="px-4 py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line border-t border-line">
          {invoice.items.map((it, i) => (
            <tr key={i}>
              <td className="px-4 py-2 text-ink">{it.description}</td>
              <td className="tabular px-2 py-2 text-right text-muted">
                {it.quantity}
              </td>
              <td className="tabular px-2 py-2 text-right text-muted">
                ${usdc(it.rate)}
              </td>
              <td className="tabular px-4 py-2 text-right text-ink">
                ${usdc(it.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-line">
            <td
              colSpan={3}
              className="px-4 py-2 text-right text-[12.5px] text-muted"
            >
              Total
            </td>
            <td className="tabular px-4 py-2 text-right font-medium text-ink">
              ${usdc(invoice.amount)} USDC
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
