"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

const DISPLAY = "var(--font-display)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const MINT = "#12FF80";
const DEEP = "#0A9200";

export default function WaitlistModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  // Open the modal whenever any waitlist CTA is clicked, anywhere on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const trigger = target?.closest?.(
        'a[href="#waitlist"], a[href="/waitlist"], [data-waitlist]'
      );
      if (trigger) {
        e.preventDefault();
        setDone(false);
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

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
    if (!email.trim()) return;
    setDone(true);
  };

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
                  You&apos;re on the list.
                </h3>
                <p style={{ fontSize: 15.5, color: MUT, marginTop: 10, lineHeight: 1.55 }}>
                  We&apos;ll email <b style={{ color: INK }}>{email}</b> the moment it&apos;s your turn. The first 20 companies get three months free.
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
                <p style={{ fontSize: 15.5, color: MUT, marginTop: 10, lineHeight: 1.55 }}>
                  Be first when Disburs opens. The first 20 companies lock launch pricing and get three months free.
                </p>
                <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full"
                    style={{ height: 50, borderRadius: 12, border: "1px solid #E2E7E3", padding: "0 16px", fontSize: 15, color: INK, outlineColor: MINT }}
                  />
                  <button
                    type="submit"
                    className="w-full font-semibold transition-transform hover:scale-[1.01]"
                    style={{ height: 50, borderRadius: 12, background: MINT, color: "#06231A", fontSize: 15, boxShadow: "0 12px 28px -12px rgba(18,255,128,0.6)" }}
                  >
                    Join the waitlist
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
