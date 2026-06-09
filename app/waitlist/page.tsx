"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-5"
      style={{ background: "#FFFFFF" }}
    >
      <div className="w-full text-center" style={{ maxWidth: "480px" }}>
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 transition-colors hover:text-ink"
          style={{ fontSize: "14px", color: "#8A8F98" }}
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="mb-6">
          <span className="font-medium" style={{ fontSize: "24px", color: "#1A1A1A" }}>
            disburs<span style={{ color: "#12FF80" }}>.</span>
          </span>
        </div>

        <h1
          className="font-medium"
          style={{ fontSize: "clamp(28px, 6vw, 40px)", color: "#1A1A1A", lineHeight: 1.1 }}
        >
          Join the waitlist
        </h1>
        <p className="mx-auto mt-4" style={{ fontSize: "18px", color: "#8A8F98" }}>
          First 20 companies get 3 months free. Be one of them.
        </p>

        <div className="mt-10">
          {status === "done" ? (
            <div
              className="flex items-center justify-center font-medium"
              style={{
                minHeight: "48px",
                borderRadius: "4px",
                background: "#DEF6E9",
                color: "#0A9200",
                padding: "12px 16px",
                fontSize: "16px",
              }}
            >
              You&rsquo;re on the list. We&rsquo;ll be in touch. ✓
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@company.com"
                className="w-full flex-1 outline-none transition-colors"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E8E8",
                  borderRadius: "4px",
                  height: "48px",
                  padding: "12px 16px",
                  color: "#1A1A1A",
                  fontSize: "16px",
                }}
                onFocus={(e) => (e.currentTarget.style.border = "1px solid #12FF80")}
                onBlur={(e) => (e.currentTarget.style.border = "1px solid #E8E8E8")}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex shrink-0 items-center justify-center font-medium transition-transform hover:scale-[1.02] disabled:opacity-70"
                style={{
                  height: "48px",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  background: "#12FF80",
                  color: "#1A1A1A",
                  fontSize: "16px",
                  boxShadow: "rgba(0,0,0,0.06) 0px 4px 4px 0px",
                }}
              >
                {status === "loading" ? "Joining..." : "Join the Waitlist"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3" style={{ fontSize: "14px", color: "#D14343" }}>
              Something went wrong. Please try again.
            </p>
          )}

          <p className="mt-6" style={{ fontSize: "14px", color: "#8A8F98" }}>
            No credit card required · Cancel anytime · Built on Stellar
          </p>
        </div>
      </div>
    </main>
  );
}
