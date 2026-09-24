"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ChevronDown,
  Download,
  Play,
  Copy,
  Sparkles,
} from "lucide-react";
import { Card, Badge, Button, Avatar, PageTitle, statusVariant } from "@/components/portal/ui";
import { contractors, type ContractorStatus } from "@/lib/mock";

const FILTERS: ("All" | ContractorStatus)[] = [
  "All",
  "Active",
  "Pending KYC",
  "Wallet unverified",
  "Contract missing",
];

export default function ContractorsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const rows = contractors.filter((c) => {
    const matchQ =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.role.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "All" || c.status === filter;
    return matchQ && matchF;
  });

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <PageTitle
        sub={`${contractors.length} people across 4 countries`}
        action={
          <Button href="/portal/contractors/new">
            <Plus size={16} /> Add contractor
          </Button>
        }
      >
        Contractors
      </PageTitle>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 w-full max-w-[320px] flex-[1_1_240px] items-center gap-2 border border-line bg-canvas px-4 focus-within:border-ink">
          <Search size={16} className="shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, role, country…"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "ink" : "secondary"}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-accent-soft px-5 py-3">
          <span className="text-[14px] font-medium text-accent">
            {selected.length} selected
          </span>
          <div className="flex flex-wrap gap-2">
            <Button href="/portal/payroll" size="sm" variant="ink">
              <Play size={14} /> Run payroll for selected
            </Button>
            <Button size="sm" variant="secondary">
              <Download size={14} /> Export CSV
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card padding={0}>
        {/* header (desktop) */}
        <div className="hidden items-center border-b border-line px-5 py-3 text-[12.5px] font-medium text-muted md:flex">
          <div className="w-7" />
          <div className="flex-[2_1_0]">Contractor</div>
          <div className="flex-[1_1_0]">Rate</div>
          <div className="flex-[1_1_0]">Last paid</div>
          <div className="flex-[1.2_1_0]">Status</div>
          <div className="w-7" />
        </div>

        <div className="divide-y divide-line">
          {rows.map((c) => {
            const isOpen = expanded === c.id;
            return (
              <div key={c.id}>
                <div className="flex flex-wrap items-center gap-y-2 px-5 py-4">
                  <div className="w-7">
                    <input
                      type="checkbox"
                      checked={selected.includes(c.id)}
                      onChange={() => toggle(c.id)}
                      className="h-4 w-4 accent-ink"
                      aria-label={`Select ${c.name}`}
                    />
                  </div>
                  <div className="flex flex-[2_1_200px] items-center gap-3">
                    <Avatar initials={c.initials} flag={c.flag} />
                    <div>
                      <div className="text-[14.5px] text-ink">{c.name}</div>
                      <div className="text-[13px] text-muted">
                        {c.role} · {c.country}
                      </div>
                    </div>
                  </div>
                  <div className="tabular flex-[1_1_0] text-[14.5px] text-ink">{c.rate}</div>
                  <div className="flex-[1_1_0] text-[14.5px] text-muted">{c.lastPaid ?? "—"}</div>
                  <div className="flex-[1.2_1_0]">
                    <Badge variant={statusVariant(c.status)} dot>
                      {c.status}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    className="flex w-7 items-center justify-center text-muted hover:text-ink"
                    onClick={() => setExpanded(isOpen ? null : c.id)}
                    aria-label="Expand"
                    aria-expanded={isOpen}
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {isOpen && (
                  <div className="grid grid-cols-1 gap-4 bg-subtle px-5 pb-5 pt-4 sm:grid-cols-3 md:pl-12">
                    <div>
                      <div className="text-[13px] text-muted">Wallet</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[14px] text-ink">
                        <span className="font-mono text-[13px]">{c.wallet}</span>
                        <Copy size={13} className="text-muted" />
                        <Badge variant={statusVariant(c.walletStatus)}>
                          {c.walletStatus}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-[13px] text-muted">Email</div>
                      <div className="mt-1 text-[14px] text-ink">{c.email}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[13px] text-muted">
                        <Sparkles size={12} className="text-accent" /> Agent last action
                      </div>
                      <div className="mt-1 text-[14px] text-ink">{c.agentLast}</div>
                    </div>
                    <div className="sm:col-span-3">
                      <Link
                        href="/portal/contractors/new"
                        className="text-[14px] font-medium text-accent hover:underline"
                      >
                        Edit contractor →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {rows.length === 0 && (
          <div className="px-5 py-12 text-center text-[14.5px] text-muted">
            No contractors match your search.
          </div>
        )}
      </Card>
    </div>
  );
}
