"use client";

import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Loader2,
  Mail,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { inputClass } from "@/components/portal/ui";
import type { PayrollDefinition } from "@/lib/api";
import {
  useArchiveDefinition,
  useCheckDeleteCode,
  useDeleteDefinition,
  useRestoreDefinition,
  useSendDeleteCode,
} from "@/lib/hooks/usePayroll";
import { when } from "@/lib/format";
import { useMe } from "@/lib/hooks/useMe";

/** How long an archive lasts, from the platform settings the backend reports. */
function useArchiveDays() {
  const { data: me } = useMe();
  return me?.settings?.archiveRetentionDays ?? 30;
}

/* ------------------------------- archive -------------------------------- */

/**
 * Archive a payroll: a confirmation dialog, then a toast with Undo. Archived
 * payrolls sit in the archive tab for a number of days set by Disburs staff
 * (30 by default), restorable, then are purged.
 */
export function ArchiveButton({
  def,
  onArchived,
  size = "icon",
}: {
  def: PayrollDefinition;
  onArchived?: () => void;
  size?: "icon" | "sm";
}) {
  const [open, setOpen] = useState(false);
  const archive = useArchiveDefinition();
  const restore = useRestoreDefinition();
  const days = useArchiveDays();

  const confirm = () => {
    archive.mutate(def.id, {
      onSuccess: (d) => {
        setOpen(false);
        toast.success(`"${def.name}" archived`, {
          description: `It stays in the archive until ${d.purgeAt ? when(d.purgeAt) : `${days} days from now`}, then is deleted for good.`,
          action: {
            label: "Undo",
            onClick: () =>
              restore.mutate(def.id, {
                onSuccess: () => toast.success(`"${def.name}" is active again`),
              }),
          },
          duration: 8000,
        });
        onArchived?.();
      },
      onError: (e) =>
        toast.error("Could not archive", { description: (e as Error).message }),
    });
  };

  return (
    <>
      {size === "icon" ? (
        <Button
          variant="outline"
          size="icon"
          aria-label="Archive payroll"
          onClick={() => setOpen(true)}
          className="h-8 w-8"
        >
          <Archive size={13} />
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Archive size={14} /> Archive
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive &ldquo;{def.name}&rdquo;?</DialogTitle>
            <DialogDescription>
              It leaves the active list and no new runs can be drafted from it.
              You can restore it any time in the next {days} days; after that it
              is deleted for good. Past runs stay in History either way.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={archive.isPending}
            >
              Keep it
            </Button>
            <Button onClick={confirm} disabled={archive.isPending}>
              {archive.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Archive size={16} />
              )}{" "}
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ------------------------------- restore -------------------------------- */

export function RestoreButton({
  def,
  onRestored,
  size = "sm",
}: {
  def: PayrollDefinition;
  onRestored?: () => void;
  size?: "icon" | "sm";
}) {
  const restore = useRestoreDefinition();
  const go = () =>
    restore.mutate(def.id, {
      onSuccess: () => {
        toast.success(`"${def.name}" is active again`);
        onRestored?.();
      },
      onError: (e) =>
        toast.error("Could not restore", { description: (e as Error).message }),
    });
  return size === "icon" ? (
    <Button
      variant="outline"
      size="icon"
      aria-label="Restore payroll"
      onClick={go}
      disabled={restore.isPending}
      className="h-8 w-8"
    >
      <ArchiveRestore size={13} />
    </Button>
  ) : (
    <Button size="sm" onClick={go} disabled={restore.isPending}>
      {restore.isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <ArchiveRestore size={14} />
      )}{" "}
      Restore
    </Button>
  );
}

/* -------------------------------- delete -------------------------------- */

type Step = "warn" | "code" | "confirm";

/**
 * Permanently delete a payroll. Three steps, all inside one dialog: a warning
 * that sends a one-time code to the signed-in owner/admin's email, the code
 * itself (checked before moving on), and a final yes/no. The backend spends
 * the code only on the final delete.
 */
export function DeleteButton({
  def,
  onDeleted,
  size = "icon",
}: {
  def: PayrollDefinition;
  onDeleted?: () => void;
  size?: "icon" | "sm";
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("warn");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const send = useSendDeleteCode();
  const check = useCheckDeleteCode();
  const del = useDeleteDefinition();

  const reset = () => {
    setStep("warn");
    setCode("");
    setSentTo(null);
    send.reset();
    check.reset();
    del.reset();
  };
  const close = () => {
    setOpen(false);
    reset();
  };

  const sendCode = () =>
    send.mutate(def.id, {
      onSuccess: (r) => {
        setSentTo(r.sentTo);
        setStep("code");
        // Local development only: the backend echoes the code when configured to.
        if (r.code) setCode(r.code);
      },
    });

  const verify = () =>
    check.mutate({ id: def.id, code }, { onSuccess: () => setStep("confirm") });

  const destroy = () =>
    del.mutate(
      { id: def.id, code },
      {
        onSuccess: () => {
          close();
          toast.success(`"${def.name}" deleted`, {
            description: "Its roster is gone. Past runs stay in History.",
          });
          onDeleted?.();
        },
      },
    );

  return (
    <>
      {size === "icon" ? (
        <Button
          variant="outline"
          size="icon"
          aria-label="Delete payroll"
          onClick={() => setOpen(true)}
          className="h-8 w-8 hover:text-[#A32D1C]"
        >
          <Trash2 size={13} />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="hover:text-[#A32D1C]"
        >
          <Trash2 size={14} /> Delete
        </Button>
      )}
      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
        <DialogContent>
          {step === "warn" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Delete &ldquo;{def.name}&rdquo; for good?
                </DialogTitle>
                <DialogDescription>
                  This cannot be undone. The payroll and its roster are removed
                  permanently; past runs stay in History. If you only want it
                  out of the way, archive it instead. To continue, we&rsquo;ll
                  email a one-time code to the address you signed in with.
                </DialogDescription>
              </DialogHeader>
              {send.isError && (
                <p className="mt-3 text-[13.5px] text-[#A32D1C]">
                  {(send.error as Error).message}
                </p>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={close}
                  disabled={send.isPending}
                >
                  Cancel
                </Button>
                <Button onClick={sendCode} disabled={send.isPending}>
                  {send.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Mail size={16} />
                  )}{" "}
                  Email me a code
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "code" && (
            <>
              <DialogHeader>
                <DialogTitle>Enter the code</DialogTitle>
                <DialogDescription>
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-ink">{sentTo}</span>. It
                  works once and expires in {send.data?.minutes ?? 10} minutes.
                </DialogDescription>
              </DialogHeader>
              <form
                className="mt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (/^\d{6}$/.test(code)) verify();
                }}
              >
                <input
                  className={`${inputClass} tabular text-center text-[24px] tracking-[0.4em]`}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="······"
                  autoFocus
                  aria-label="One-time code"
                />
                {check.isError && (
                  <p className="mt-3 text-[13.5px] text-[#A32D1C]">
                    {(check.error as Error).message}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between text-[13px] text-muted">
                  <span>Didn&rsquo;t get it?</span>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0"
                    onClick={sendCode}
                    disabled={send.isPending}
                  >
                    Send a new code
                  </Button>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!/^\d{6}$/.test(code) || check.isPending}
                  >
                    {check.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}{" "}
                    Continue
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}

          {step === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldAlert size={22} className="text-[#A32D1C]" /> Last
                  check
                </DialogTitle>
                <DialogDescription>
                  Code confirmed. Delete{" "}
                  <span className="font-medium text-ink">
                    &ldquo;{def.name}&rdquo;
                  </span>{" "}
                  and its roster of {def.items.filter((i) => i.active).length}{" "}
                  permanently? There is no archive to bring it back from.
                </DialogDescription>
              </DialogHeader>
              {del.isError && (
                <p className="mt-3 text-[13.5px] text-[#A32D1C]">
                  {(del.error as Error).message}
                </p>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={close}
                  disabled={del.isPending}
                >
                  No, keep it
                </Button>
                <Button
                  variant="destructive"
                  onClick={destroy}
                  disabled={del.isPending}
                >
                  {del.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}{" "}
                  Yes, delete it
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
