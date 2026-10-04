"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Loader2,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Avatar, Badge, Card, PageTitle } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/hooks/useMe";
import { useAddContractor, useContractors } from "@/lib/hooks/usePayments";
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
import { MONEY_ROLES, explorerUrl, type OrgContractor } from "@/lib/api";
import { shortKey, usdc, when } from "@/lib/format";

type Filter = "All" | "On a payroll" | "Paid before" | "Wallet inactive";
const FILTERS: Filter[] = [
  "All",
  "On a payroll",
  "Paid before",
  "Wallet inactive",
];

const initials = (s: string) =>
  s
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function matches(c: OrgContractor, filter: Filter) {
  switch (filter) {
    case "On a payroll":
      return c.payrolls.some((p) => p.active);
    case "Paid before":
      return c.paymentCount > 0;
    case "Wallet inactive":
      return !c.wallet?.isActivated;
    default:
      return true;
  }
}

/**
 * Everyone this organization works with. Contractors onboard themselves;
 * they appear here once you add them by email, put them on a payroll, or
 * pay them. Adding one is what lets them send you invoices.
 */
export default function ContractorsPage() {
  const { data: me } = useMe();
  const list = useContractors();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState("");
  const add = useAddContractor();
  const submitAdd = () =>
    add.mutate(email.trim(), {
      onSuccess: (c) => {
        toast.success(`${c.name} added`, {
          description: "They can now send you invoices.",
        });
        setAdding(false);
        setEmail("");
      },
    });

  const network = me?.network ?? "testnet";
  const canManage = Boolean(
    me?.organization?.role && MONEY_ROLES.includes(me.organization.role),
  );
  const all = list.data ?? [];
  const q = query.trim().toLowerCase();
  const rows = all.filter(
    (c) =>
      matches(c, filter) &&
      (!q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)),
  );
  const countries = new Set(all.map((c) => c.country)).size;

  const copy = (key: string) => {
    navigator.clipboard?.writeText(key).catch(() => {});
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        sub={
          list.isPending
            ? "Loading…"
            : `${all.length} ${all.length === 1 ? "person" : "people"}${countries > 0 ? ` across ${countries} ${countries === 1 ? "country" : "countries"}` : ""}`
        }
        action={
          canManage ? (
            <span className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href="/portal/payroll">Add to a payroll</Link>
              </Button>
              <Button onClick={() => setAdding(true)}>
                <UserPlus size={16} /> Add contractor
              </Button>
            </span>
          ) : undefined
        }
      >
        Contractors
      </PageTitle>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 w-full max-w-[320px] flex-[1_1_240px] items-center gap-2 border border-line bg-canvas px-4 focus-within:border-ink">
          <Search size={16} className="shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, country…"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <Card padding={0}>
        <div className="hidden items-center border-b border-line px-5 py-3 text-[12.5px] font-medium text-muted md:flex">
          <div className="flex-[2_1_0]">Contractor</div>
          <div className="flex-[1.4_1_0]">Payrolls</div>
          <div className="flex-[1_1_0]">Last paid</div>
          <div className="flex-[1_1_0]">Total paid</div>
          <div className="flex-[1_1_0]">Wallet</div>
          <div className="w-7" />
        </div>

        {list.isPending ? (
          <div className="px-5 py-10 text-center text-[14.5px] text-muted">
            Loading…
          </div>
        ) : list.isError ? (
          <div className="px-5 py-10 text-center text-[14.5px] text-[#A32D1C]">
            {(list.error as Error).message}
          </div>
        ) : all.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="mx-auto max-w-[460px] text-[15px] leading-[1.55] text-muted">
              No contractors yet. Ask them to sign in to Disburs as a contractor
              and finish onboarding, then add them to a payroll by the email
              they used, or pay them once from the Pay page.
            </p>
            {canManage && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/portal/payroll">Set up a payroll</Link>
                </Button>
                <Button asChild>
                  <Link href="/portal/pay">Pay someone</Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-line">
            {rows.map((c) => {
              const isOpen = expanded === c.id;
              const activePayrolls = c.payrolls.filter((p) => p.active);
              return (
                <div key={c.id}>
                  <div className="flex flex-wrap items-center gap-y-2 px-5 py-4">
                    <div className="flex flex-[2_1_200px] items-center gap-3">
                      <Avatar initials={initials(c.name)} />
                      <div className="min-w-0">
                        <div className="truncate text-[14.5px] text-ink">
                          {c.name}
                        </div>
                        <div className="truncate text-[13px] text-muted">
                          {c.email} · {c.country}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-[1.4_1_0] flex-wrap gap-1.5">
                      {activePayrolls.length === 0 ? (
                        <span className="text-[13.5px] text-muted">—</span>
                      ) : (
                        activePayrolls.map((p) => (
                          <Badge key={p.id} variant="neutral">
                            {p.name} · ${usdc(p.amount)}
                          </Badge>
                        ))
                      )}
                    </div>
                    <div className="flex-[1_1_0] text-[14.5px] text-muted">
                      {c.lastPaidAt ? when(c.lastPaidAt) : "Never"}
                    </div>
                    <div className="tabular flex-[1_1_0] text-[14.5px] text-ink">
                      ${usdc(c.totalPaid)}
                    </div>
                    <div className="flex-[1_1_0]">
                      <Badge
                        variant={c.wallet?.isActivated ? "success" : "warn"}
                        dot
                      >
                        {c.wallet?.isActivated ? "Active" : "Not activated"}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpanded(isOpen ? null : c.id)}
                      aria-label="Expand"
                      aria-expanded={isOpen}
                      className="h-6 w-6"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>

                  {isOpen && (
                    <div className="grid grid-cols-1 gap-4 bg-subtle px-5 pb-5 pt-4 sm:grid-cols-3">
                      <div className="min-w-0">
                        <div className="text-[13px] text-muted">Wallet</div>
                        {c.wallet ? (
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[14px] text-ink">
                            <span className="font-mono text-[13px]">
                              {shortKey(c.wallet.publicKey, 6, 6)}
                            </span>
                            <Button
                              variant="link"
                              size="icon"
                              onClick={() => copy(c.wallet!.publicKey)}
                              aria-label="Copy address"
                              className="h-auto px-0"
                            >
                              {copied === c.wallet.publicKey ? (
                                <Check size={13} />
                              ) : (
                                <Copy size={13} />
                              )}
                            </Button>
                            <a
                              href={explorerUrl(
                                network,
                                "account",
                                c.wallet.publicKey,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="View on explorer"
                              className="text-muted hover:text-ink"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        ) : (
                          <div className="mt-1 text-[14px] text-muted">
                            No wallet yet
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-[13px] text-muted">
                          Payout currency
                        </div>
                        <div className="mt-1 text-[14px] text-ink">
                          {c.payoutCurrency} ·{" "}
                          {c.type === "BUSINESS" ? "Business" : "Individual"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[13px] text-muted">Payments</div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[14px] text-ink">
                          <span>{c.paymentCount} settled</span>
                          {c.paymentCount > 0 && (
                            <span
                              className={`inline-flex items-center gap-1 text-[12.5px] font-medium ${c.confirmedCount === c.paymentCount ? "text-accent" : "text-[#8A5A00]"}`}
                            >
                              <ShieldCheck size={13} /> {c.confirmedCount} on
                              chain
                            </span>
                          )}
                          {c.lastTxHash && (
                            <a
                              href={explorerUrl(network, "tx", c.lastTxHash)}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Last transaction"
                              className="text-muted hover:text-ink"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <span className="text-muted">
                            · joined {when(c.createdAt)}
                          </span>
                        </div>
                      </div>
                      {canManage && (
                        <div className="flex flex-wrap gap-4 sm:col-span-3">
                          <Link
                            href="/portal/payroll"
                            className="text-[14px] font-medium text-accent hover:underline"
                          >
                            {activePayrolls.length
                              ? "Edit on payroll →"
                              : "Add to a payroll →"}
                          </Link>
                          <Link
                            href="/portal/pay"
                            className="text-[14px] font-medium text-accent hover:underline"
                          >
                            Pay once →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {rows.length === 0 && (
              <div className="px-5 py-12 text-center text-[14.5px] text-muted">
                No contractors match your search.
              </div>
            )}
          </div>
        )}
      </Card>
      <Dialog
        open={adding}
        onOpenChange={(o) => {
          setAdding(o);
          if (!o) add.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a contractor</DialogTitle>
            <DialogDescription>
              Enter the email they signed up to Disburs with. Once added, they
              can send you invoices, and you can pay them or put them on a
              payroll. Nothing is paid by adding them.
            </DialogDescription>
          </DialogHeader>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) submitAdd();
            }}
          >
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              aria-label="Contractor email"
              autoFocus
            />
            {add.isError && (
              <p className="mt-3 text-[13.5px] text-[#A32D1C]">
                {(add.error as Error).message}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdding(false)}
                disabled={add.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!email.trim() || add.isPending}>
                {add.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}{" "}
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
