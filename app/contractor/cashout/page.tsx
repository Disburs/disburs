"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  Check,
  Loader2,
  Building2,
  Smartphone,
  Plus,
  Clock,
  ArrowRight,
} from "lucide-react";
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
      <div className="mx-auto flex flex-col items-center text-center" style={{ maxWidth: "440px", paddingTop: "40px" }}>
        <span
          className="flex items-center justify-center"
          style={{ width: "64px", height: "64px", borderRadius: "9999px", background: "#DEF6E9" }}
        >
          <Check size={32} color="#0A9200" />
        </span>
        <h1 className="mt-5 font-medium" style={{ fontSize: "24px", color: "#1A1A1A" }}>
          Cash-out started
        </h1>
        <p className="mt-2" style={{ fontSize: "15px", color: "#5C6068", lineHeight: 1.5, maxWidth: "300px" }}>
          <strong style={{ color: "#1A1A1A" }}>₦{ngn(receive)}</strong> is on its way to{" "}
          {d.label} {d.detail}.
        </p>
        <div
          className="mt-4 flex items-center gap-2"
          style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "12px", padding: "12px 16px" }}
        >
          <Clock size={16} color="#8A8F98" />
          <span style={{ fontSize: "13.5px", color: "#5C6068" }}>
            Funds typically arrive within 2–4 hours
          </span>
        </div>
        <Link
          href="/contractor"
          className="mt-6 flex items-center justify-center gap-2 font-medium"
          style={{ height: "48px", width: "100%", borderRadius: "12px", background: "#12FF80", color: "#1A1A1A", fontSize: "15px" }}
        >
          Back to home <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col gap-4" style={{ maxWidth: "520px" }}>
      <div>
        <h1 className="font-medium" style={{ fontSize: "22px", color: "#1A1A1A" }}>
          Cash out
        </h1>
        <p style={{ fontSize: "13.5px", color: "#8A8F98", marginTop: "2px" }}>
          Convert your USDC to {contractor.currency} and send it home.
        </p>
      </div>

      {/* Amount */}
      <div style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "16px", padding: "16px" }}>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: "13px", color: "#8A8F98" }}>You convert</span>
          <button
            onClick={() => setAmount(String(contractor.balance))}
            className="font-medium"
            style={{ fontSize: "12px", color: "#0A9200" }}
          >
            Max ${ngn(contractor.balance)}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium" style={{ fontSize: "28px", color: "#1A1A1A" }}>
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent font-medium outline-none"
            style={{ fontSize: "28px", color: "#1A1A1A" }}
          />
          <span className="font-medium" style={{ fontSize: "16px", color: "#8A8F98" }}>
            USDC
          </span>
        </div>
      </div>

      {/* arrow */}
      <div className="flex justify-center" style={{ marginTop: "-8px", marginBottom: "-8px" }}>
        <span
          className="flex items-center justify-center"
          style={{ width: "34px", height: "34px", borderRadius: "9999px", background: "#DEF6E9", border: "3px solid #F7F8F9" }}
        >
          <ArrowDown size={16} color="#0A9200" />
        </span>
      </div>

      {/* Receive */}
      <div style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "16px", padding: "16px" }}>
        <span style={{ fontSize: "13px", color: "#8A8F98" }}>They receive</span>
        <div className="mt-2 font-medium" style={{ fontSize: "28px", color: "#1A1A1A" }}>
          ₦{ngn(receive)}
        </div>
        <div
          className="mt-2 inline-flex items-center gap-1.5"
          style={{ background: "#F7FBF8", borderRadius: "8px", padding: "5px 10px", fontSize: "12.5px", color: "#0A7A1E" }}
        >
          <span className="inline-block rounded-full" style={{ width: "6px", height: "6px", background: "#12FF80" }} />
          1 USDC = {ngn(contractor.rate)} {contractor.currency} right now
        </div>
      </div>

      {/* Destination */}
      <div style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "16px", padding: "16px" }}>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
            Send to
          </span>
          <button className="flex items-center gap-1" style={{ fontSize: "12.5px", color: "#0A9200" }}>
            <Plus size={13} /> Add new
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {destinations.map((d) => {
            const active = dest === d.id;
            const Icon = d.type === "Bank account" ? Building2 : Smartphone;
            return (
              <button
                key={d.id}
                onClick={() => setDest(d.id)}
                className="flex items-center gap-3"
                style={{
                  borderRadius: "12px",
                  border: "1.5px solid " + (active ? "#12FF80" : "#ECEDEF"),
                  background: active ? "#F7FBF8" : "#FFFFFF",
                  padding: "12px 14px",
                }}
              >
                <span
                  className="flex items-center justify-center"
                  style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#F0F1F3" }}
                >
                  <Icon size={18} color="#5C6068" />
                </span>
                <div className="flex-1 text-left">
                  <div style={{ fontSize: "14px", color: "#1A1A1A" }}>
                    {d.label} <span style={{ color: "#8A8F98" }}>{d.detail}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#8A8F98" }}>{d.type}</div>
                </div>
                {active && <Check size={18} color="#0A9200" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Arrival + confirm */}
      <div className="flex items-center gap-2" style={{ fontSize: "13px", color: "#8A8F98", padding: "0 2px" }}>
        <Clock size={15} /> Funds typically arrive within 2–4 hours
      </div>

      <button
        onClick={confirm}
        disabled={parsed <= 0 || phase === "sending"}
        className="flex items-center justify-center gap-2 font-medium active:scale-[0.99]"
        style={{
          height: "50px",
          borderRadius: "13px",
          background: "#12FF80",
          color: "#1A1A1A",
          fontSize: "15px",
          opacity: parsed <= 0 ? 0.5 : 1,
        }}
      >
        {phase === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Converting…
          </>
        ) : (
          <>Confirm cash-out of ₦{ngn(receive)}</>
        )}
      </button>
    </div>
  );
}
