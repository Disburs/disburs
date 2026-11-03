"use client";

import { useState } from "react";
import { BookUser, ExternalLink, Globe, Loader2, Trash2 } from "lucide-react";
import { Badge, Card, Field, inputClass } from "@/components/portal/ui";
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
import {
  useAddExternalPayee,
  useExternalPayees,
  useRemoveExternalPayee,
} from "@/lib/hooks/usePayments";
import { explorerUrl, type ExternalPayee } from "@/lib/api";
import { when } from "@/lib/format";

const ADDRESS = /^G[A-Z2-7]{55}$/;

function screening(p: ExternalPayee) {
  switch (p.screenStatus) {
    case "CLEAR":
      return { label: "Screened", variant: "success" as const };
    case "FLAGGED":
      return { label: "Flagged", variant: "danger" as const };
    default:
      return { label: "Not screened", variant: "warn" as const };
  }
}

/**
 * The address book: people the organization pays at a Stellar address
 * without a Disburs account. Each address is screened when added. Payments
 * to them are plain USDC transfers, so they are public on Stellar; the
 * product says so here and on the Pay screen, nowhere else.
 */
export default function AddressBook({
  canManage,
  network,
}: {
  canManage: boolean;
  network: string;
}) {
  const list = useExternalPayees();
  const add = useAddExternalPayee();
  const remove = useRemoveExternalPayee();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [memoType, setMemoType] = useState<"text" | "id">("text");
  const [email, setEmail] = useState("");

  const addr = address.trim().toUpperCase();
  const addrOk = ADDRESS.test(addr);
  const memoOk =
    !memo.trim() || memoType === "text" || /^\d+$/.test(memo.trim());
  const canSubmit =
    name.trim().length > 0 && addrOk && memoOk && !add.isPending;

  const reset = () => {
    setName("");
    setAddress("");
    setMemo("");
    setMemoType("text");
    setEmail("");
    add.reset();
  };

  const submit = () =>
    add.mutate(
      {
        name: name.trim(),
        address: addr,
        ...(memo.trim() ? { memo: memo.trim(), memoType } : {}),
        ...(email.trim() ? { email: email.trim() } : {}),
      },
      {
        onSuccess: (p) => {
          toast.success(`${p.name} added`, {
            description: p.onDisburs
              ? "This email already has a Disburs account. Add them as a contractor to pay them privately."
              : p.screenStatus === "FLAGGED"
                ? "Screening flagged this address. A compliance case is open."
                : p.screenStatus === "CLEAR"
                  ? "Screened and ready to pay."
                  : "Screening was not available; the address can still be paid.",
          });
          setOpen(false);
          reset();
        },
      },
    );

  const rows = list.data ?? [];

  return (
    <Card padding={0}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <div>
          <div className="flex items-center gap-2 text-[15px] font-medium text-ink">
            <BookUser size={16} /> Address book
          </div>
          <p className="mt-1 text-[13px] text-muted">
            People you pay at a Stellar address without a Disburs account.
          </p>
        </div>
        {canManage && (
          <Button variant="outline" onClick={() => setOpen(true)}>
            Add address
          </Button>
        )}
      </div>
      <p className="flex items-start gap-2 border-b border-line bg-subtle px-6 py-3 text-[13px] leading-[1.5] text-muted">
        <Globe size={14} className="mt-0.5 shrink-0" />
        <span>
          Payments to these addresses are public on Stellar: anyone can see the
          amount and the address. Invite them to Disburs for private pay.
        </span>
      </p>
      {list.isPending ? (
        <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="px-6 py-6 text-[14px] text-muted">
          No addresses yet.
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {rows.map((p) => {
            const s = screening(p);
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-ink">
                    {p.name}
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 font-mono text-[12.5px] text-muted">
                    <a
                      href={explorerUrl(network, "account", p.address)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:text-ink"
                    >
                      {p.address.slice(0, 6)}…{p.address.slice(-6)}
                      <ExternalLink size={11} />
                    </a>
                    {p.memo && (
                      <span>
                        · memo {p.memo} ({p.memoType ?? "text"})
                      </span>
                    )}
                  </div>
                  <div className="text-[12.5px] text-muted">
                    {p.email ? `${p.email} · ` : ""}added {when(p.createdAt)}
                  </div>
                  {p.onDisburs && (
                    <p className="mt-1 text-[12.5px] text-accent">
                      This email already has a Disburs account. Add them as a
                      contractor to pay them privately.
                    </p>
                  )}
                </div>
                {canManage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Remove ${p.name}`}
                    disabled={remove.isPending}
                    onClick={() =>
                      remove.mutate(p.id, {
                        onSuccess: () => toast.success(`${p.name} removed`),
                        onError: (e) =>
                          toast.error("Could not remove", {
                            description: (e as Error).message,
                          }),
                      })
                    }
                  >
                    <Trash2 size={15} />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an address</DialogTitle>
            <DialogDescription>
              The address is screened as you add it. Payments to it are public
              on Stellar.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) submit();
            }}
          >
            <Field label="Name">
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ama Mensah"
                autoFocus
              />
            </Field>
            <Field
              label="Stellar address"
              hint="Starts with G and is 56 characters long. It must already hold USDC."
            >
              <input
                className={`${inputClass} font-mono text-[13px]`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="GB…"
                autoComplete="off"
                spellCheck={false}
              />
              {address.trim() && !addrOk && (
                <p className="mt-1 text-[12.5px] text-[#A32D1C]">
                  That is not a Stellar address.
                </p>
              )}
            </Field>
            <div className="grid grid-cols-[1fr_120px] gap-3">
              <Field
                label="Memo"
                hint="Only if their exchange or wallet asks for one."
              >
                <input
                  className={inputClass}
                  value={memo}
                  maxLength={28}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Optional"
                />
              </Field>
              <Field label="Memo type">
                <select
                  className={inputClass}
                  value={memoType}
                  onChange={(e) => setMemoType(e.target.value as "text" | "id")}
                >
                  <option value="text">Text</option>
                  <option value="id">ID</option>
                </select>
              </Field>
            </div>
            {!memoOk && (
              <p className="text-[12.5px] text-[#A32D1C]">
                An ID memo is digits only.
              </p>
            )}
            <Field
              label="Email"
              hint="Optional. They are told when you pay them and invited to Disburs."
            >
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </Field>
            {add.isError && (
              <p className="text-[13.5px] text-[#A32D1C]">
                {(add.error as Error).message}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={add.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {add.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}{" "}
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
