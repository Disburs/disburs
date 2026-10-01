"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlight } from "./highlight";

const REQUEST = {
  curl: `curl -X POST https://api.disburs.io/api/payments/pay \\
  -H "Content-Type: application/json" \\
  -b "session=…" \\
  -d '{
    "contractorId": "a1b2c3d4-…",
    "amount": "1200.00",
    "memo": "March salary",
    "idempotencyKey": "run-2026-03-kwabena"
  }'`,
  ts: `import { Disburs } from "@disburs/sdk";

const disburs = new Disburs({ apiKey: process.env.DISBURS_KEY });

// Find the payee by the email they signed up with
const payee = await disburs.contractors.lookup({
  email: "kwabena@example.com",
});

// Pay from the treasury. Same key → never double-pays.
const payout = await disburs.payments.pay({
  contractorId: payee.id,
  amount: "1200.00",
  memo: "March salary",
  idempotencyKey: "run-2026-03-kwabena",
});

console.log(payout.status, payout.txHash);`,
};

const RESPONSE = `{
  "id": "5f9e1c2a-…",
  "type": "PAYOUT",
  "status": "SETTLED",
  "amount": "1200.0000000",
  "assetCode": "USDC",
  "destination": "GCUBHDBN…LKRWW",
  "memo": "March salary",
  "txHash": "57dd5365…",
  "createdAt": "2026-03-01T09:03:07Z"
}`;

type Tab = keyof typeof REQUEST;

/** Two-pane request / response console. The cURL calls an endpoint that exists today. */
export default function Console() {
  const [tab, setTab] = useState<Tab>("curl");
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(REQUEST[tab]).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="on-dark min-w-0 overflow-hidden rounded-[24px] bg-ink-deep">
      <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-white/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-mint px-2.5 font-mono text-[11.5px] font-semibold text-ink-deep">
            POST
          </span>
          <span className="truncate font-mono text-[13px] text-white/80">
            /api/payments/pay
          </span>
        </div>
        <div
          className="flex items-center gap-1"
          role="tablist"
          aria-label="Language"
        >
          {(["curl", "ts"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`h-8 rounded-full px-3 text-[12.5px] font-medium ${tab === t ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
            >
              {t === "curl" ? "cURL" : "TypeScript"}
            </button>
          ))}
          <button
            type="button"
            onClick={copy}
            aria-label="Copy request"
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:text-white"
          >
            {copied ? (
              <Check size={15} className="text-mint" />
            ) : (
              <Copy size={15} />
            )}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words px-5 py-4 font-mono text-[12.5px] leading-[1.65] text-white/85 md:whitespace-pre">
        <code>{highlight(REQUEST[tab], tab === "curl" ? "bash" : "ts")}</code>
      </pre>
      {tab === "curl" ? (
        <>
          <div className="flex items-center justify-between border-y border-white/10 bg-white/[0.04] px-4 py-2.5">
            <span className="text-[12.5px] text-white/60">Response</span>
            <span className="flex items-center gap-3 font-mono text-[11.5px]">
              <span className="text-mint">201 Created</span>
              <span className="text-white/50">4.1s to settle</span>
            </span>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words px-5 py-4 font-mono text-[12.5px] leading-[1.65] text-white/85 md:whitespace-pre">
            <code>{highlight(RESPONSE, "json")}</code>
          </pre>
        </>
      ) : (
        <div className="border-t border-white/10 px-5 py-2.5 text-[12px] text-white/45">
          The typed SDK ships with Phase 3. The REST API is live today.
        </div>
      )}
    </div>
  );
}
