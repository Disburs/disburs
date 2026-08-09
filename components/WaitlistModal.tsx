"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { useJoinWaitlist } from "@/lib/hooks/useWaitlist";
import type { AccountType } from "@/lib/api";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const MINT = "#12FF80";
const DEEP = "#0A9200";

const ROLES: { value: AccountType; label: string; sub: string }[] = [
  { value: "CLIENT", label: "Pay my team", sub: "I run payroll" },
  { value: "CONTRACTOR", label: "Get paid", sub: "I'm a contractor" },
];

export default function WaitlistModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AccountType | null>(null);
  const [done, setDone] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const mutation = useJoinWaitlist();

  // Open the modal whenever any waitlist CTA is clicked, anywhere on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const trigger = target?.closest?.(
        'a[href="#waitlist"], a[href="/waitlist"], [data-waitlist]',
      );
      if (trigger) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (open) {
      setDone(false);
      setAlreadyJoined(false);
      setEmail("");
      setRole(null);
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !role || mutation.isPending) return;
    mutation.mutate(
      { email: email.trim(), type: role },
      {
        onSuccess: (data) => {
          setAlreadyJoined(Boolean(data.alreadyJoined));
          setDone(true);
        },
      },
    );
  };

  const canSubmit = Boolean(email.trim()) && Boolean(role) && !mutation.isPending;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          style={{ background: "rgba(6,19,13,0.62)", backdropFilter: "blur(4px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Join the waitlist"
        >
          <motion.div
            className="relative w-full"
            style={{ maxWidth: 440, background: "#FFFFFF", borderRadius: 22, padding: "38px 34px 34px", boxShadow: "0 40px 90px -30px rgba(6,19,13,0.6)" }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute flex items-center justify-center transition-colors"
              style={{ top: 16, right: 16, width: 34, height: 34, borderRadius: 999, color: MUT, background: "#F4F6F4" }}
            >
              <X size={17} />
            </button>

            {done ? (
              <div className="text-center">
                <span className="mx-auto flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 999, background: "#DEF6E9" }}>
                  <Check size={28} color={DEEP} />
                </span>
                <h3 className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: 24, color: INK, marginTop: 18, letterSpacing: "-0.02em" }}>
                  {alreadyJoined ? "You're already on the list." : "You're on the list."}
                </h3>
                <p style={{ fontSize: 15.5, color: MUT, marginTop: 10, lineHeight: 1.55 }}>
                  {alreadyJoined ? (
                    <>
                      We already have <b style={{ color: INK }}>{email}</b>. We&apos;ll be in
                      touch when it&apos;s your turn.
                    </>
                  ) : (
                    <>
                      We&apos;ll email <b style={{ color: INK }}>{email}</b> the moment it&apos;s
                      your turn.
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-7 w-full font-semibold"
                  style={{ height: 50, borderRadius: 12, background: MINT, color: "#06231A", fontSize: 15 }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold" style={{ fontFamily: DISPLAY, fontSize: 26, color: INK, letterSpacing: "-0.02em" }}>
                  Join the waitlist
                </h3>

                <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                  {/* role selector */}
                  <div>
                    <span className="block font-medium" style={{ fontSize: 13, color: MUT, marginBottom: 8 }}>
                      I want to…
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {ROLES.map((r) => {
                        const on = role === r.value;
                        return (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setRole(r.value)}
                            aria-pressed={on}
                            className="text-left transition-colors"
                            style={{
                              borderRadius: 12,
                              padding: "12px 14px",
                              border: `1px solid ${on ? DEEP : "#E2E7E3"}`,
                              background: on ? "#EAFBF1" : "#FFFFFF",
                            }}
                          >
                            <span className="block font-semibold" style={{ fontSize: 14.5, color: on ? DEEP : INK }}>
                              {r.label}
                            </span>
                            <span className="block" style={{ fontSize: 12, color: MUT }}>
                              {r.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full"
                    style={{ height: 50, borderRadius: 12, border: "1px solid #E2E7E3", padding: "0 16px", fontSize: 15, color: INK, outlineColor: MINT }}
                  />

                  {mutation.isError && (
                    <p style={{ fontSize: 13, color: "#C0392B" }}>
                      {(mutation.error as Error).message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="flex w-full items-center justify-center gap-2 font-semibold transition-transform"
                    style={{
                      height: 50,
                      borderRadius: 12,
                      background: MINT,
                      color: "#06231A",
                      fontSize: 15,
                      boxShadow: "0 12px 28px -12px rgba(18,255,128,0.6)",
                      opacity: canSubmit ? 1 : 0.55,
                      cursor: canSubmit ? "pointer" : "not-allowed",
                    }}
                  >
                    {mutation.isPending ? (
                      <Loader2 size={19} className="animate-spin" />
                    ) : (
                      "Join the waitlist"
                    )}
                  </button>
                </form>
                <p style={{ fontSize: 12.5, color: "#8FA398", marginTop: 14, textAlign: "center" }}>
                  No spam. We&apos;ll only email you about early access.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
