"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";
import CountUp from "./CountUp";

const STATS: { to?: number; display?: string; label: string }[] = [
  { to: 4, label: "Countries served" },
  { display: "~4s", label: "Avg. settlement time" },
  { display: "< $0.01", label: "Network fee per payment" },
  { display: "0.5%", label: "Flat fee vs 2–4% elsewhere" },
];

type CurrencyKey = "NGN" | "KES" | "GHS" | "ZAR";

const CURRENCIES: Record<
  CurrencyKey,
  { rate: number; flag: string; name: string }
> = {
  NGN: { rate: 1618, flag: "🇳🇬", name: "Nigerian Naira" },
  KES: { rate: 129, flag: "🇰🇪", name: "Kenyan Shilling" },
  GHS: { rate: 15.5, flag: "🇬🇭", name: "Ghanaian Cedi" },
  ZAR: { rate: 18.2, flag: "🇿🇦", name: "South African Rand" },
};

export default function FxSection() {
  const [amount, setAmount] = useState("1000");
  const [currency, setCurrency] = useState<CurrencyKey>("NGN");

  const parsed = parseFloat(amount) || 0;
  const received = parsed * CURRENCIES[currency].rate;
  const receivedFmt = received.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

  return (
    <section
      className="px-5 md:px-10"
      style={{ background: "#F5F5F5", paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>Cross-Border</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              maxWidth: "560px",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            Send more. Lose less.
          </h2>
          <p
            className="mx-auto mt-4 text-center"
            style={{ fontSize: "18px", color: "#8A8F98", maxWidth: "520px" }}
          >
            Pay your contractors in seconds, for a fraction of what banks and money
            transfer services charge.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stats */}
          <FadeIn>
            <div className="grid h-full grid-cols-2 gap-6">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col justify-center"
                  style={{
                    borderRadius: "20px",
                    border: "2px solid #E8E8E8",
                    background: "#FFFFFF",
                    padding: "28px",
                  }}
                >
                  <div
                    className="font-medium"
                    style={{ fontSize: "36px", color: "#1A1A1A", lineHeight: 1 }}
                  >
                    {s.to !== undefined ? <CountUp to={s.to} /> : s.display}
                  </div>
                  <div
                    style={{ fontSize: "14px", color: "#8A8F98", marginTop: "8px" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Converter */}
          <FadeIn delay={0.1}>
            <div
              className="h-full"
              style={{
                borderRadius: "20px",
                border: "2px solid #E8E8E8",
                background: "#FFFFFF",
                padding: "32px",
              }}
            >
              {/* You pay */}
              <div style={{ fontSize: "13px", color: "#8A8F98" }}>You pay</div>
              <div
                className="mt-2 flex items-center justify-between"
                style={{
                  background: "#F5F5F5",
                  borderRadius: "12px",
                  padding: "14px 16px",
                }}
              >
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent font-medium outline-none"
                  style={{ fontSize: "24px", color: "#1A1A1A" }}
                  aria-label="Amount to pay in USDC"
                />
                <span
                  className="ml-3 shrink-0 font-medium"
                  style={{ fontSize: "16px", color: "#1A1A1A" }}
                >
                  USDC
                </span>
              </div>

              {/* Arrow */}
              <div className="my-3 flex justify-center">
                <span
                  className="flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9999px",
                    background: "#DEF6E9",
                  }}
                >
                  <ArrowDown size={16} color="#0A9200" />
                </span>
              </div>

              {/* They receive */}
              <div style={{ fontSize: "13px", color: "#8A8F98" }}>
                They receive
              </div>
              <div
                className="mt-2 flex items-center justify-between"
                style={{
                  background: "#F5F5F5",
                  borderRadius: "12px",
                  padding: "14px 16px",
                }}
              >
                <span
                  className="font-medium"
                  style={{ fontSize: "24px", color: "#1A1A1A" }}
                >
                  {receivedFmt}
                </span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyKey)}
                  className="ml-3 shrink-0 cursor-pointer bg-transparent font-medium outline-none"
                  style={{ fontSize: "16px", color: "#1A1A1A" }}
                  aria-label="Currency contractor receives"
                >
                  {(Object.keys(CURRENCIES) as CurrencyKey[]).map((c) => (
                    <option key={c} value={c}>
                      {CURRENCIES[c].flag} {c}
                    </option>
                  ))}
                </select>
              </div>

              <p style={{ fontSize: "12px", color: "#8A8F98", marginTop: "16px" }}>
                Indicative rate (1 USDC = {CURRENCIES[currency].rate.toLocaleString()}{" "}
                {currency}). The agent locks the best available rate at payout.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
