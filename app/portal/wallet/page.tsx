"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Coins,
  Building2,
  CreditCard,
  Sparkles,
  ArrowDownToLine,
} from "lucide-react";
import { Card, Button, PageTitle, QrCode, inputClass } from "@/components/portal/ui";
import { company, nextPayroll, fundingHistory, WALLET_ADDRESS } from "@/lib/mock";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

const METHODS = [
  { key: "crypto", label: "Crypto deposit", icon: Coins },
  { key: "bank", label: "Bank transfer", icon: Building2 },
  { key: "card", label: "Card (Flutterwave)", icon: CreditCard },
] as const;

export default function WalletPage() {
  const [method, setMethod] = useState<(typeof METHODS)[number]["key"]>("crypto");
  const [copied, setCopied] = useState(false);
  const [threshold, setThreshold] = useState("5000");
  const shortfall = nextPayroll.total - company.balance;

  const copy = () => {
    navigator.clipboard?.writeText(WALLET_ADDRESS).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle sub="Fund your treasury and keep the next run covered.">Wallet</PageTitle>

      {/* Balance + recommendation */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card tone="dark" className="lg:col-span-2">
          <div className="text-[13.5px] text-white/60">USDC balance</div>
          <div className="tabular mt-3 font-display text-[44px] font-semibold leading-none tracking-[-0.03em] text-white md:text-[56px]">
            ${fmt(company.balance)}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            <div>
              <div className="text-[13px] text-white/55">Next payroll ({nextPayroll.date})</div>
              <div className="tabular mt-1 font-display text-[22px] font-semibold tracking-[-0.03em] text-white">
                ${fmt(nextPayroll.total)}
              </div>
            </div>
            <div>
              <div className="text-[13px] text-white/55">Shortfall</div>
              <div className="tabular mt-1 font-display text-[22px] font-semibold tracking-[-0.03em] text-mint">
                ${fmt(shortfall)}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col justify-between gap-5 rounded-[24px] bg-accent-soft p-6">
          <div className="flex items-start gap-2">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <div className="text-[14.5px] font-medium text-accent">Agent recommendation</div>
              <p className="mt-1 text-[14px] leading-[1.5] text-ink">
                Top up <strong className="font-semibold">$2,600</strong> before {nextPayroll.date} to fully
                cover the December run with a small buffer.
              </p>
            </div>
          </div>
          <Button size="sm" full variant="ink">
            <ArrowDownToLine size={15} /> Top up now
          </Button>
        </div>
      </div>

      {/* Funding */}
      <Card padding={0}>
        <div className="border-b border-line px-6 py-4">
          <h3 className="text-[16px] font-medium text-ink">Fund your wallet</h3>
        </div>

        {/* method tabs */}
        <div className="flex flex-wrap gap-2 px-6 pt-5">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const active = method === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMethod(m.key)}
                aria-pressed={active}
                className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13.5px] font-medium transition-colors ${
                  active
                    ? "border-ink-deep bg-ink-deep text-white"
                    : "border-line bg-canvas text-muted hover:border-ink hover:text-ink"
                }`}
              >
                <Icon size={15} />
                {m.label}
              </button>
            );
          })}
        </div>

        <div className="px-6 pb-6 pt-5">
          {method === "crypto" && (
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <div className="rounded-[24px] border border-line bg-canvas p-4">
                <QrCode size={140} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-muted">
                  Send USDC (Stellar) from any exchange or wallet to:
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 border border-line bg-subtle px-4 py-3">
                  <span className="break-all font-mono text-[13px] text-ink">{WALLET_ADDRESS}</span>
                  <button
                    type="button"
                    onClick={copy}
                    className={`shrink-0 ${copied ? "text-accent" : "text-muted hover:text-ink"}`}
                    aria-label="Copy address"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="mt-2 text-[13px] text-muted">
                  Coinbase, Binance, or any Stellar wallet. Funds usually arrive in
                  under a minute. Only send USDC on Stellar.
                </p>
              </div>
            </div>
          )}

          {method === "bank" && (
            <ol className="flex flex-col gap-3">
              {[
                "Transfer to the Cowrie anchor account below from your business bank.",
                "Reference your account ID DSB-4821 so the agent can match it.",
                "The anchor converts your deposit to USDC and credits your wallet.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-[14.5px] text-ink">
                  <span className="tabular w-5 shrink-0 text-[13px] font-medium text-muted">{i + 1}.</span>
                  {step}
                </li>
              ))}
              <li className="border border-line bg-subtle px-4 py-3 text-[13.5px] text-muted">
                <div>Cowrie Integrated Systems · GTBank</div>
                <div className="font-mono text-ink">0123 4567 89 · Ref DSB-4821</div>
              </li>
            </ol>
          )}

          {method === "card" && (
            <div className="max-w-[360px]">
              <div className="mb-2 text-[13px] text-muted">
                Pay by card via Flutterwave. A 1.4% processing fee applies.
              </div>
              <input placeholder="Amount in USD" className={`${inputClass} mb-3`} />
              <Button full>
                <CreditCard size={15} /> Continue to Flutterwave
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* History + auto top-up */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" padding={0}>
          <div className="border-b border-line px-6 py-4">
            <h3 className="text-[16px] font-medium text-ink">Funding history</h3>
          </div>
          <ul className="divide-y divide-line">
            {fundingHistory.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <div className="text-[14.5px] text-ink">{f.method}</div>
                  <div className="text-[13px] text-muted">{f.date}</div>
                </div>
                <span className="tabular text-[14.5px] font-medium text-accent">+ ${fmt(f.amount)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <h3 className="text-[16px] font-medium text-ink">Auto top-up alert</h3>
          <p className="mt-1 text-[13px] text-muted">
            Get an alert when your balance falls below a threshold.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[16px] text-muted">$</span>
            <input
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className={inputClass}
              inputMode="numeric"
            />
          </div>
          <div className="mt-3">
            <Button variant="secondary" size="sm" full>
              Save alert
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
