"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  MessageCircle,
  ArrowDownLeft,
  Check,
} from "lucide-react";
import { Badge } from "@/components/portal/ui";
import { contractor, payments, cashouts, ngn } from "@/lib/contractor";

export default function ContractorHome() {
  const localValue = contractor.balance * contractor.rate;
  const lastPayment = payments[0];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-medium" style={{ fontSize: "22px", color: "#1A1A1A" }}>
          Hi {contractor.firstName} 👋
        </h1>
        <p style={{ fontSize: "14px", color: "#8A8F98", marginTop: "2px" }}>
          Here&rsquo;s your money from {contractor.employer}.
        </p>
      </div>

      {/* Top row: balance + last payment / actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Balance hero */}
        <div
          className="lg:col-span-2"
          style={{ background: "#1A1A1A", borderRadius: "20px", padding: "28px", position: "relative", overflow: "hidden" }}
        >
          <div
            aria-hidden
            className="mint-glow absolute"
            style={{ top: "-80px", right: "-40px", width: "260px", height: "260px", borderRadius: "9999px" }}
          />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                Available balance
              </div>
              <div className="mt-1 font-medium" style={{ fontSize: "46px", color: "#FFFFFF", lineHeight: 1.05 }}>
                ${ngn(contractor.balance)}
                <span style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)" }}> USDC</span>
              </div>
              <div className="mt-1" style={{ fontSize: "15px", color: "#12FF80" }}>
                ≈ ₦{ngn(localValue)} {contractor.currency}
              </div>
            </div>
            <Link
              href="/contractor/cashout"
              className="flex items-center justify-center gap-2 font-medium active:scale-[0.99]"
              style={{ height: "48px", padding: "0 22px", borderRadius: "12px", background: "#12FF80", color: "#1A1A1A", fontSize: "15px" }}
            >
              <ArrowLeftRight size={18} /> Convert to local currency
            </Link>
          </div>
        </div>

        {/* Last payment + message */}
        <div className="flex flex-col gap-4">
          <div
            className="flex items-center gap-3"
            style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "16px", padding: "18px" }}
          >
            <span
              className="flex shrink-0 items-center justify-center"
              style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#DEF6E9" }}
            >
              <ArrowDownLeft size={22} color="#0A9200" />
            </span>
            <div className="flex-1">
              <div style={{ fontSize: "13px", color: "#8A8F98" }}>Last payment</div>
              <div className="font-medium" style={{ fontSize: "17px", color: "#1A1A1A" }}>
                +${ngn(lastPayment.amount)} USDC
              </div>
              <div style={{ fontSize: "12px", color: "#8A8F98" }}>{lastPayment.date}</div>
            </div>
            <Badge variant="success" dot>
              Received
            </Badge>
          </div>

          <Link
            href="/contractor/messages"
            className="flex flex-1 items-center gap-3"
            style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "16px", padding: "18px" }}
          >
            <span
              className="flex shrink-0 items-center justify-center"
              style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#F0F1F3" }}
            >
              <MessageCircle size={22} color="#0A9200" />
            </span>
            <div>
              <div className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
                Message the agent
              </div>
              <div style={{ fontSize: "12.5px", color: "#8A8F98" }}>
                Something looks off? Ask in plain words.
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom row: payments + cashout history */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Payments received">
          {payments.map((p, i) => (
            <Row
              key={i}
              last={i === payments.length - 1}
              icon={<ArrowDownLeft size={17} color="#0A9200" />}
              title={p.company}
              sub={p.date}
              right={
                <div className="text-right">
                  <div className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
                    +${ngn(p.amount)}
                  </div>
                  <div style={{ fontSize: "11.5px", color: p.status === "Received" ? "#0A9200" : "#8A8F98" }}>
                    {p.status}
                  </div>
                </div>
              }
            />
          ))}
        </Section>

        <Section title="Cash-out history">
          {cashouts.map((c, i) => (
            <Row
              key={i}
              last={i === cashouts.length - 1}
              icon={<ArrowLeftRight size={16} color="#5C6068" />}
              title={`${c.usdc} USDC → ₦${ngn(c.local)}`}
              sub={`${c.method} · ${c.date}`}
              right={<Check size={16} color="#0A9200" />}
            />
          ))}
          {cashouts.length === 0 && (
            <div style={{ padding: "20px 0", fontSize: "13px", color: "#8A8F98" }}>
              No cash-outs yet.
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "16px", padding: "8px 18px 10px" }}>
      <h3 className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A", padding: "14px 0 4px" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({
  icon,
  title,
  sub,
  right,
  last,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  right: React.ReactNode;
  last: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "13px 0", borderBottom: last ? "none" : "1px solid #F0F1F3" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#F0F1F3" }}
        >
          {icon}
        </span>
        <div>
          <div style={{ fontSize: "14px", color: "#1A1A1A" }}>{title}</div>
          <div style={{ fontSize: "12px", color: "#8A8F98" }}>{sub}</div>
        </div>
      </div>
      {right}
    </div>
  );
}
