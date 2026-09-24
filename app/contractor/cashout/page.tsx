"use client";

import { useState } from "react";
import { ArrowDown, Check, Loader2, Plus, Clock, ArrowRight } from "lucide-react";
import { Button, PageTitle } from "@/components/portal/ui";
import { contractor, destinations, ngn } from "@/lib/contractor";

export default function CashoutPage() {
  const [amount, setAmount] = useState(String(contractor.balance));
  const [dest, setDest] = useState(destinations[0].id);
  const [phase, setPhase] = useState<"form" | "sending" | "done">("form");

  const parsed = Math.min(parseFloat(amount) || 0, contractor.balance);
  const receive = parsed * contractor.rate;

  const confirm = () => {
    setPhase("sending");
    window.setTimeout(() => setPhase("done"), 2200);
  };

  if (phase === "done") {
    const d = destinations.find((x) => x.id === dest)!;
    return (
      <div className="mx-auto flex max-w-[440px] flex-col items-center pt-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink-deep">
          <Check size={26} strokeWidth={2.5} />
        </span>
        <h1 className="mt-7 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
          Cash-out started
        </h1>
        <p className="mt-4 max-w-[320px] text-[16px] leading-[1.5] text-muted">
          <strong className="tabular font-medium text-ink">₦{ngn(receive)}</strong> is on its way to{" "}
          {d.label} {d.detail}.
        </p>
        <div className="mt-6 flex items-center gap-2 text-[13.5px] text-muted">
          <Clock size={15} />
          <span>Funds typically arrive within 2–4 hours</span>
        </div>
        <div className="mt-8 w-full">
          <Button href="/contractor" variant="ink" size="lg" full>
            Back to home <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[520px] flex-col gap-4">
      <PageTitle sub={<>Convert your USDC to {contractor.currency} and send it home.</>}>Cash out</PageTitle>

      {/* Amount */}
      <div className="rounded-[24px] border border-line bg-canvas p-5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted">You convert</span>
          <button type="button" onClick={() => setAmount(String(contractor.balance))} className="tabular text-[13px] font-medium text-accent hover:underline">
            Max ${ngn(contractor.balance)}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-[34px] font-semibold tracking-[-0.03em] text-ink">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Amount in USDC"
            className="tabular w-full min-w-0 bg-transparent font-display text-[34px] font-semibold tracking-[-0.03em] text-ink outline-none"
          />
          <span className="text-[15px] text-muted">USDC</span>
        </div>
      </div>

      {/* arrow */}
      <div className="-my-2 flex justify-center text-muted">
        <ArrowDown size={18} />
      </div>

      {/* Receive */}
      <div className="rounded-[24px] border border-line bg-subtle p-5">
        <span className="text-[13px] text-muted">They receive</span>
        <div className="tabular mt-2 font-display text-[34px] font-semibold leading-none tracking-[-0.03em] text-ink">
            <span className="font-sans font-medium">₦</span>
            {ngn(receive)}
          </div>
        <div className="tabular mt-3 text-[13px] text-accent">
          1 USDC = {ngn(contractor.rate)} {contractor.currency} right now
        </div>
      </div>

      {/* Destination */}
      <div className="rounded-[24px] border border-line bg-canvas p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[16px] font-medium text-ink">Send to</span>
          <button type="button" className="flex items-center gap-1 text-[13px] font-medium text-accent hover:underline">
            <Plus size={13} /> Add new
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {destinations.map((d) => {
            const active = dest === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDest(d.id)}
                aria-pressed={active}
                className={`flex items-center gap-3 rounded-[16px] border px-4 py-3.5 text-left transition-colors ${
                  active ? "border-ink bg-subtle" : "border-line bg-canvas hover:border-ink"
                }`}
              >
                <div className="flex-1">
                  <div className="text-[14.5px] text-ink">
                    {d.label} <span className="text-muted">{d.detail}</span>
                  </div>
                  <div className="text-[13px] text-muted">{d.type}</div>
                </div>
                {active && <Check size={18} className="text-accent" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Arrival + confirm */}
      <div className="flex items-center gap-2 px-1 text-[13px] text-muted">
        <Clock size={15} /> Funds typically arrive within 2–4 hours
      </div>

      <Button onClick={confirm} disabled={parsed <= 0 || phase === "sending"} size="lg" full>
        {phase === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Converting…
          </>
        ) : (
          <span className="tabular">Confirm cash-out of ₦{ngn(receive)}</span>
        )}
      </Button>
    </div>
  );
}
