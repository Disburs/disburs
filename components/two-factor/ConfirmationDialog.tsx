"use client";

import { useEffect, useRef, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/portal/ui";
import { twoFactorApi } from "@/lib/api";
import {
  setConfirmationAsker,
  type ConfirmationRequest,
} from "@/lib/confirmation";

/**
 * Asks for the code a money action needs. Mounted once; the API client calls
 * it through lib/confirmation whenever the backend asks. For people without
 * an authenticator it emails a code first.
 */
export default function ConfirmationDialog() {
  const [req, setReq] = useState<ConfirmationRequest | null>(null);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const resolver = useRef<((code: string | null) => void) | null>(null);

  useEffect(() => {
    setConfirmationAsker(
      (r) =>
        new Promise((resolve) => {
          resolver.current = resolve;
          setCode("");
          setReq(r);
        }),
    );
    return () => setConfirmationAsker(null);
  }, []);

  // Email path: send a code as soon as the dialog opens (not on a retry).
  useEffect(() => {
    if (!req || req.method !== "email" || req.error) return;
    setSending(true);
    setSent(null);
    twoFactorApi
      .emailCode()
      .then((r) =>
        setSent(r.code ? `${r.sentTo} (dev code ${r.code})` : r.sentTo),
      )
      .catch(() => setSent(null))
      .finally(() => setSending(false));
  }, [req]);

  const finish = (value: string | null) => {
    resolver.current?.(value);
    resolver.current = null;
    setReq(null);
  };

  return (
    <Dialog open={req !== null} onOpenChange={(o) => !o && finish(null)}>
      <DialogContent className="max-w-[420px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) finish(code.trim());
          }}
          className="flex flex-col gap-5"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound size={18} className="text-accent" /> Confirm it&rsquo;s
              you
            </DialogTitle>
            <DialogDescription>
              {req?.method === "totp"
                ? "Enter the 6-digit code from your authenticator app, or one of your backup codes."
                : sending
                  ? "Sending a code to your email…"
                  : sent
                    ? `We emailed a code to ${sent}. Enter it to continue.`
                    : "Enter the code we emailed you to continue."}
            </DialogDescription>
          </DialogHeader>
          <input
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label="Confirmation code"
            placeholder={req?.method === "totp" ? "123456" : "6-digit code"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${inputClass} tabular text-center text-[20px] tracking-[0.3em]`}
          />
          {req?.error && (
            <p className="-mt-2 text-[13.5px] text-[#A32D1C]" role="alert">
              {req.error}
            </p>
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => finish(null)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={code.trim().length < 6}>
              {sending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
