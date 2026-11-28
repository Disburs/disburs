"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { Copy, KeyRound, ShieldCheck } from "lucide-react";
import { Badge, Card, inputClass } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { twoFactorApi } from "@/lib/api";
import { ME_KEY } from "@/lib/hooks/useMe";

export const TWO_FACTOR_KEY = ["two-factor"] as const;

/**
 * Set up, inspect or remove the authenticator app. Shared by the company's
 * Settings → Security tab and the contractor's Security page.
 */
export default function AuthenticatorSetup() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: TWO_FACTOR_KEY,
    queryFn: twoFactorApi.status,
  });
  const [setup, setSetup] = useState<{
    secret: string;
    otpauthUri: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [backup, setBackup] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [removing, setRemoving] = useState(false);

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: TWO_FACTOR_KEY });
    void qc.invalidateQueries({ queryKey: ME_KEY });
  };
  const enroll = useMutation({
    mutationFn: twoFactorApi.enroll,
    onSuccess: (r) => {
      setSetup(r);
      setCode("");
    },
  });
  const activate = useMutation({
    mutationFn: () => twoFactorApi.activate(code.trim()),
    onSuccess: (r) => {
      setBackup(r.backupCodes);
      setSetup(null);
      setCode("");
      refresh();
    },
  });
  const disable = useMutation({
    mutationFn: () => twoFactorApi.disable(code.trim()),
    onSuccess: () => {
      setRemoving(false);
      setCode("");
      refresh();
    },
  });

  const copy = (text: string) => {
    void navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const s = q.data;
  const enabled = s?.enabled ?? false;

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {enabled ? (
            <ShieldCheck size={22} className="mt-0.5 shrink-0 text-accent" />
          ) : (
            <KeyRound size={22} className="mt-0.5 shrink-0 text-muted" />
          )}
          <div>
            <div className="text-[17px] font-medium text-ink">
              Authenticator app
            </div>
            <div className="mt-1 text-[14.5px] text-muted">
              {enabled
                ? `Every payment asks for a code from your app. Sign-in asks for one after ${s?.afterDays ?? 7} days away. ${s?.backupCodesLeft ?? 0} backup codes left.`
                : "Google Authenticator, Authy or 1Password. Once set up, every payment asks for a 6-digit code from the app instead of an emailed one, and sign-in asks for one after a week away."}
            </div>
          </div>
        </div>
        {s && (
          <Badge variant={enabled ? "success" : "neutral"} dot>
            {enabled ? "On" : "Not set up"}
          </Badge>
        )}
      </div>

      {/* Backup codes, shown once after activation. */}
      {backup && (
        <div className="rounded-[16px] border border-line bg-subtle p-5">
          <div className="text-[15px] font-medium text-ink">
            Save your backup codes
          </div>
          <p className="mt-1 text-[14px] text-muted">
            Each works once if you lose your phone. This is the only time they
            are shown.
          </p>
          <ul className="tabular mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[14px] text-ink sm:grid-cols-4">
            {backup.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(backup.join("\n"))}
            >
              <Copy size={14} /> {copied ? "Copied" : "Copy all"}
            </Button>
            <Button size="sm" onClick={() => setBackup(null)}>
              I have saved them
            </Button>
          </div>
        </div>
      )}

      {/* Setup: scan, then confirm one code. */}
      {setup && (
        <div className="grid gap-6 border-t border-line pt-5 sm:grid-cols-[auto_1fr]">
          <div className="rounded-[16px] border border-line bg-white p-3">
            <QRCodeSVG value={setup.otpauthUri} size={168} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[15px] font-medium text-ink">
              1. Scan this with your authenticator app
            </div>
            <p className="text-[14px] text-muted">
              Cannot scan? Enter this key by hand:{" "}
              <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[13px] text-ink">
                {setup.secret}
              </code>
            </p>
            <div className="mt-2 text-[15px] font-medium text-ink">
              2. Enter the code the app shows
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                activate.mutate();
              }}
              className="flex flex-wrap gap-2"
            >
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label="Authenticator code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`${inputClass} tabular w-[160px] text-center tracking-[0.3em]`}
              />
              <Button
                type="submit"
                disabled={code.trim().length !== 6 || activate.isPending}
              >
                {activate.isPending ? "Checking…" : "Turn on"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSetup(null)}
              >
                Cancel
              </Button>
            </form>
            {activate.isError && (
              <p className="text-[13.5px] text-[#A32D1C]" role="alert">
                {(activate.error as Error).message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Removing: needs a current code. */}
      {removing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            disable.mutate();
          }}
          className="flex flex-col gap-3 border-t border-line pt-5"
        >
          <div className="text-[15px] font-medium text-ink">
            Enter a current code to remove the authenticator
          </div>
          <p className="text-[14px] text-muted">
            Payments will go back to asking for an emailed code.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              inputMode="numeric"
              aria-label="Current code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`${inputClass} tabular w-[160px] text-center tracking-[0.3em]`}
            />
            <Button
              type="submit"
              variant="outline"
              disabled={code.trim().length < 6 || disable.isPending}
            >
              {disable.isPending ? "Removing…" : "Remove"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setRemoving(false);
                setCode("");
              }}
            >
              Keep it
            </Button>
          </div>
          {disable.isError && (
            <p className="text-[13.5px] text-[#A32D1C]" role="alert">
              {(disable.error as Error).message}
            </p>
          )}
        </form>
      )}

      {s && !setup && !removing && !backup && (
        <div className="flex flex-wrap gap-2 border-t border-line pt-5">
          {enabled ? (
            <Button variant="outline" onClick={() => setRemoving(true)}>
              Remove authenticator
            </Button>
          ) : (
            <Button onClick={() => enroll.mutate()} disabled={enroll.isPending}>
              {enroll.isPending ? "Preparing…" : "Set up authenticator"}
            </Button>
          )}
          {enroll.isError && (
            <p className="self-center text-[13.5px] text-[#A32D1C]">
              {(enroll.error as Error).message}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
