"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { useJoinWaitlist } from "@/lib/hooks/useWaitlist";
import type { AccountType } from "@/lib/api";


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
  const triggerRef = useRef<HTMLElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const mutation = useJoinWaitlist();

  // Open the modal whenever any waitlist CTA is clicked, anywhere on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const trigger = target?.closest?.<HTMLElement>(
        'a[href="#waitlist"], a[href="/waitlist"], [data-waitlist]',
      );
      if (trigger) {
        e.preventDefault();
        triggerRef.current = trigger;
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

  // Move focus into the modal when it opens and return it to the trigger when it closes.
  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => emailInputRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }

    triggerRef.current?.focus();
    triggerRef.current = null;
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-deep/70 px-4"
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
            className="relative w-full max-w-[520px] rounded-tile bg-canvas p-8 md:p-12"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-[opacity,transform] duration-150 hover:opacity-[0.84] active:scale-[0.98]"
            >
              <X size={18} />
            </button>

            {done ? (
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink-deep">
                  <Check size={26} strokeWidth={2.5} />
                </span>
                <h3 className="mt-7 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
                  {alreadyJoined ? "You're already on the list." : "You're on the list."}
                </h3>
                <p className="mt-5 text-[17px] leading-[1.5] text-muted">
                  {alreadyJoined ? (
                    <>
                      We already have <b className="font-medium text-ink">{email}</b>. We&apos;ll be in
                      touch when it&apos;s your turn.
                    </>
                  ) : (
                    <>
                      We&apos;ll email <b className="font-medium text-ink">{email}</b> the moment it&apos;s
                      your turn.
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-8 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-full bg-ink-deep text-[17px] font-medium text-white transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="max-w-[10ch] font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-[44px]">
                  Join the <em className="font-medium italic">waitlist.</em>
                </h3>
                <p className="mt-4 text-[16px] leading-[1.5] text-muted md:text-[17px]">
                  The first 20 companies get three months free and lock in launch pricing.
                </p>

                <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
                  <fieldset>
                    <legend className="mb-3 text-[15px] font-medium text-ink">I want to…</legend>
                    <div className="flex flex-wrap gap-2.5">
                      {ROLES.map((r) => {
                        const on = role === r.value;
                        return (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setRole(r.value)}
                            aria-pressed={on}
                            className={`inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border px-5 text-[15px] font-medium transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.98] ${
                              on ? "border-ink-deep bg-ink-deep text-white" : "border-line bg-canvas text-ink hover:border-ink"
                            }`}
                          >
                            {r.label}
                            <span className={`text-[13px] font-normal ${on ? "text-white/60" : "text-muted"}`}>{r.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <label className="block">
                    <span className="mb-3 block text-[15px] font-medium text-ink">Work email</span>
                    <input
                      ref={emailInputRef}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="h-14 w-full rounded-none border border-line bg-canvas px-4 text-[16px] text-ink placeholder:text-faint focus:border-ink focus:outline-none"
                    />
                  </label>

                  {mutation.isError && (
                    <p className="text-[14px] text-[#B42318]">{(mutation.error as Error).message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-mint text-[17px] font-medium text-ink-deep transition-[opacity,transform] duration-150 enabled:cursor-pointer enabled:hover:opacity-[0.88] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {mutation.isPending ? <Loader2 size={20} className="animate-spin" /> : "Join the waitlist"}
                  </button>
                </form>
                <p className="mt-5 text-[13.5px] text-muted">No spam. We&apos;ll only email you about early access.</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
