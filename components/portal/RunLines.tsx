"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "./ui";
import { explorerUrl, type RunLine, type RunStatus } from "@/lib/api";
import { shortKey, usdc } from "@/lib/format";

export const runVariant = (s: RunStatus) =>
  s === "SETTLED" ? "success" : s === "FAILED" ? "danger" : s === "PARTIAL" || s === "EXECUTING" || s === "APPROVED" ? "warn" : "neutral";

/** The lines of a run: payee, destination, amount, status, transaction. */
export default function RunLines({ lines, network }: { lines: RunLine[]; network: string }) {
  return (
    <ul className="divide-y divide-line">
      {lines.map((l) => (
        <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <div className="min-w-0">
            <div className="text-[14.5px] text-ink">{l.payeeName}</div>
            <div className="font-mono text-[12px] text-muted">
              {shortKey(l.destination)}
              {l.error ? <span className="ml-2 font-sans text-[#A32D1C]">{l.error}</span> : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="tabular text-[14.5px] font-medium text-ink">${usdc(l.amount)}</span>
            <Badge variant={l.status === "SETTLED" ? "success" : l.status === "FAILED" ? "danger" : "neutral"}>{l.status.toLowerCase()}</Badge>
            {l.txHash ? (
              <a href={explorerUrl(network, "tx", l.txHash)} target="_blank" rel="noreferrer" aria-label="View transaction" className="text-muted hover:text-ink">
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="w-[14px]" />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
