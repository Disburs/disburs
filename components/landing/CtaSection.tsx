"use client";

import { useState } from "react";
import FadeIn from "./FadeIn";

export default function CtaSection() {
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
    <section
      id="waitlist"
      className="relative overflow-hidden px-5 md:px-10"
      style={{ background: "#1A1A1A", paddingTop: "96px", paddingBottom: "96px" }}
    >
      {/* mint glow */}
      <div
        aria-hidden
        className="mint-glow absolute left-1/2"
        style={{
          top: "-120px",
          width: "min(820px, 120%)",
          height: "480px",
          borderRadius: "9999px",
          transform: "translateX(-50%)",
        }}
      />
      <div className="relative mx-auto flex max-w-container flex-col items-center text-center">
        <FadeIn>
          <h2
            className="font-medium"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(32px, 6vw, 56px)",
              lineHeight: 1.1,
            }}
          >
            Your next payroll
            <br />
            should run itself<span style={{ color: "#12FF80" }}>.</span>
          </h2>
          <p
            className="mx-auto mt-6"
            style={{ fontSize: "20px", color: "#8A8F98", maxWidth: "480px" }}
          >
            Join the waitlist. First 20 companies get 3 months free.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="mt-10 w-full" style={{ maxWidth: "480px" }}>
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
              <form
                onSubmit={onSubmit}
                className="flex w-full flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@company.com"
                  className="w-full flex-1 outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                    height: "48px",
                    padding: "12px 16px",
                    color: "#FFFFFF",
                    fontSize: "16px",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.border = "1px solid #12FF80")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.border =
                      "1px solid rgba(255,255,255,0.2)")
                  }
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
                  }}
                >
                  {status === "loading" ? "Joining..." : "Join the Waitlist"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p
                className="mt-3"
                style={{ fontSize: "14px", color: "#FF6B6B" }}
              >
                Something went wrong. Please try again.
              </p>
            )}

            <p
              className="mt-6"
              style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}
            >
              No credit card required · Cancel anytime · Built on Stellar
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
