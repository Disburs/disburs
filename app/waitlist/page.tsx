"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

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
    <main className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-[72px] items-center justify-between border-b border-line px-5 md:px-8">
        <Link href="/" className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
          Disburs
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-ink">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-[520px]">
          {status === "done" ? (
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink-deep">
                <Check size={26} strokeWidth={2.5} />
              </span>
              <h1 className="mt-7 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
                You&rsquo;re on the list.
              </h1>
              <p className="mt-5 text-[17px] leading-[1.5] text-muted">
                You&rsquo;re on the list. We&rsquo;ll be in touch at{" "}
                <b className="font-medium text-ink">{email}</b> the moment it&rsquo;s your turn.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-full bg-ink-deep text-[17px] font-medium text-white transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.98]"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <>
              <h1 className="max-w-[10ch] font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
                Join the <em className="font-medium italic">waitlist.</em>
              </h1>
              <p className="mt-4 text-[16px] leading-[1.5] text-muted md:text-[17px]">
                First 20 companies get 3 months free. Be one of them.
              </p>

              <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
                <label className="block">
                  <span className="mb-3 block text-[15px] font-medium text-ink">Work email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@company.com"
                    className="h-14 w-full rounded-none border border-line bg-canvas px-4 text-[16px] text-ink placeholder:text-faint focus:border-ink focus:outline-none"
                  />
                </label>

                {status === "error" && (
                  <p className="text-[14px] text-[#A32D1C]">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-mint text-[17px] font-medium text-ink-deep transition-[opacity,transform] duration-150 enabled:cursor-pointer enabled:hover:opacity-[0.88] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "loading" ? <Loader2 size={20} className="animate-spin" /> : "Join the waitlist"}
                </button>
              </form>

              <p className="mt-5 text-[13.5px] text-muted">
                No credit card required · Cancel anytime · Built on Stellar
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
