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
import { Card, Button, QrCode } from "@/components/portal/ui";
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
      {/* Balance + recommendation */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" style={{ background: "#1A1A1A", border: "none" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
            USDC balance
          </div>
          <div className="mt-1 font-medium" style={{ fontSize: "44px", color: "#FFFFFF", lineHeight: 1.1 }}>
            ${fmt(company.balance)}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                Next payroll ({nextPayroll.date})
              </div>
              <div className="mt-0.5 font-medium" style={{ fontSize: "18px", color: "#FFFFFF" }}>
                ${fmt(nextPayroll.total)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                Shortfall
              </div>
              <div className="mt-0.5 font-medium" style={{ fontSize: "18px", color: "#12FF80" }}>
                ${fmt(shortfall)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between" style={{ background: "#F7FBF8", border: "1px solid #DEF6E9" }}>
          <div className="flex items-start gap-2">
            <Sparkles size={18} color="#0A9200" className="mt-0.5 shrink-0" />
            <div>
              <div className="font-medium" style={{ fontSize: "14px", color: "#0A7A1E" }}>
                Agent recommendation
              </div>
              <p className="mt-1" style={{ fontSize: "13.5px", color: "#1A5028", lineHeight: 1.5 }}>
                Top up <strong>$2,600</strong> before {nextPayroll.date} to fully
                cover the December run with a small buffer.
              </p>
            </div>
          </div>
          <Button size="sm" full>
            <ArrowDownToLine size={15} /> Top up now
          </Button>
        </Card>
      </div>

      {/* Funding */}
      <Card padding={0}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0F1F3" }}>
          <h3 className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
            Fund your wallet
          </h3>
        </div>

        {/* method tabs */}
        <div className="flex flex-wrap gap-2" style={{ padding: "16px 24px 0" }}>
          {METHODS.map((m) => {
            const Icon = m.icon;
            const active = method === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className="flex items-center gap-2"
                style={{
                  borderRadius: "8px",
                  padding: "9px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  background: active ? "#DEF6E9" : "#FFFFFF",
                  color: active ? "#0A7A1E" : "#5C6068",
                  border: "1px solid " + (active ? "#BFEBD0" : "#E8E8E8"),
                }}
              >
                <Icon size={15} color={active ? "#0A9200" : "#8A8F98"} />
                {m.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "20px 24px 24px" }}>
          {method === "crypto" && (
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <div
                style={{ border: "1px solid #E8E8E8", borderRadius: "14px", padding: "14px" }}
              >
                <QrCode size={140} />
              </div>
              <div className="flex-1">
                <div style={{ fontSize: "13px", color: "#8A8F98" }}>
                  Send USDC (Stellar) from any exchange or wallet to:
                </div>
                <div
                  className="mt-2 flex items-center justify-between gap-3"
                  style={{ background: "#F7F8F9", border: "1px solid #E8E8E8", borderRadius: "10px", padding: "12px 14px" }}
                >
                  <span className="font-mono" style={{ fontSize: "13px", color: "#1A1A1A", wordBreak: "break-all" }}>
                    {WALLET_ADDRESS}
                  </span>
                  <button onClick={copy} className="shrink-0" aria-label="Copy address">
                    {copied ? <Check size={16} color="#0A9200" /> : <Copy size={16} color="#8A8F98" />}
                  </button>
                </div>
                <p className="mt-2" style={{ fontSize: "12px", color: "#8A8F98" }}>
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
                <li key={i} className="flex gap-3" style={{ fontSize: "14px", color: "#1A1A1A" }}>
                  <span
                    className="flex shrink-0 items-center justify-center font-medium"
                    style={{ width: "22px", height: "22px", borderRadius: "9999px", background: "#DEF6E9", color: "#0A9200", fontSize: "12px" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
              <li
                style={{ background: "#F7F8F9", border: "1px solid #E8E8E8", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "#5C6068" }}
              >
                <div>Cowrie Integrated Systems · GTBank</div>
                <div className="font-mono" style={{ color: "#1A1A1A" }}>0123 4567 89 · Ref DSB-4821</div>
              </li>
            </ol>
          )}

          {method === "card" && (
            <div style={{ maxWidth: "360px" }}>
              <div style={{ fontSize: "13px", color: "#8A8F98", marginBottom: "8px" }}>
                Pay by card via Flutterwave. A 1.4% processing fee applies.
              </div>
              <input
                placeholder="Amount in USD"
                style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid #E8E8E8", padding: "0 12px", fontSize: "14px", marginBottom: "10px" }}
              />
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
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0F1F3" }}>
            <h3 className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
              Funding history
            </h3>
          </div>
          {fundingHistory.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
              style={{ padding: "14px 24px", borderBottom: i < fundingHistory.length - 1 ? "1px solid #F0F1F3" : "none" }}
            >
              <div>
                <div style={{ fontSize: "14px", color: "#1A1A1A" }}>{f.method}</div>
                <div style={{ fontSize: "12px", color: "#8A8F98" }}>{f.date}</div>
              </div>
              <span className="font-medium" style={{ fontSize: "14px", color: "#0A9200" }}>
                + ${fmt(f.amount)}
              </span>
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
            Auto top-up alert
          </h3>
          <p className="mt-1" style={{ fontSize: "13px", color: "#8A8F98" }}>
            Get an alert when your balance falls below a threshold.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span style={{ fontSize: "16px", color: "#8A8F98" }}>$</span>
            <input
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid #E8E8E8", padding: "0 12px", fontSize: "14px" }}
            />
          </div>
          <Button variant="secondary" size="sm" full>
            Save alert
          </Button>
        </Card>
      </div>
    </div>
  );
}
