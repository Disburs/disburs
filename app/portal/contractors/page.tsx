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
import { Card, Badge, Button, Avatar, statusVariant } from "@/components/portal/ui";
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
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-medium" style={{ fontSize: "20px", color: "#1A1A1A" }}>
            Contractors
          </h2>
          <p style={{ fontSize: "13px", color: "#8A8F98", marginTop: "2px" }}>
            {contractors.length} people across 4 countries
          </p>
        </div>
        <Button href="/portal/contractors/new">
          <Plus size={16} /> Add contractor
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-2"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E8E8",
            borderRadius: "8px",
            padding: "0 12px",
            height: "40px",
            flex: "1 1 240px",
            maxWidth: "320px",
          }}
        >
          <Search size={16} color="#8A8F98" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, role, country…"
            className="w-full bg-transparent outline-none"
            style={{ fontSize: "14px", color: "#1A1A1A" }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 500,
                background: filter === f ? "#1A1A1A" : "#FFFFFF",
                color: filter === f ? "#FFFFFF" : "#5C6068",
                border: "1px solid " + (filter === f ? "#1A1A1A" : "#E8E8E8"),
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div
          className="flex flex-wrap items-center justify-between gap-3"
          style={{
            background: "#DEF6E9",
            border: "1px solid #BFEBD0",
            borderRadius: "10px",
            padding: "10px 16px",
          }}
        >
          <span className="font-medium" style={{ fontSize: "14px", color: "#0A7A1E" }}>
            {selected.length} selected
          </span>
          <div className="flex gap-2">
            <Button href="/portal/payroll" size="sm">
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
        <div
          className="hidden items-center md:flex"
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid #F0F1F3",
            fontSize: "12px",
            color: "#8A8F98",
          }}
        >
          <div style={{ width: "28px" }} />
          <div style={{ flex: "2 1 0" }}>Contractor</div>
          <div style={{ flex: "1 1 0" }}>Rate</div>
          <div style={{ flex: "1 1 0" }}>Last paid</div>
          <div style={{ flex: "1.2 1 0" }}>Status</div>
          <div style={{ width: "28px" }} />
        </div>

        {rows.map((c, i) => {
          const isOpen = expanded === c.id;
          return (
            <div
              key={c.id}
              style={{ borderBottom: i < rows.length - 1 ? "1px solid #F0F1F3" : "none" }}
            >
              <div
                className="flex flex-wrap items-center gap-y-2"
                style={{ padding: "14px 20px" }}
              >
                <div style={{ width: "28px" }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    style={{ accentColor: "#12FF80", width: "16px", height: "16px" }}
                    aria-label={`Select ${c.name}`}
                  />
                </div>
                <div
                  style={{ flex: "2 1 200px" }}
                  className="flex items-center gap-3"
                >
                  <Avatar initials={c.initials} flag={c.flag} />
                  <div>
                    <div style={{ fontSize: "14px", color: "#1A1A1A" }}>{c.name}</div>
                    <div style={{ fontSize: "12px", color: "#8A8F98" }}>
                      {c.role} · {c.country}
                    </div>
                  </div>
                </div>
                <div style={{ flex: "1 1 0", fontSize: "14px", color: "#1A1A1A" }}>
                  {c.rate}
                </div>
                <div style={{ flex: "1 1 0", fontSize: "14px", color: "#5C6068" }}>
                  {c.lastPaid ?? "—"}
                </div>
                <div style={{ flex: "1.2 1 0" }}>
                  <Badge variant={statusVariant(c.status)} dot>
                    {c.status}
                  </Badge>
                </div>
                <button
                  style={{ width: "28px" }}
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                  aria-label="Expand"
                >
                  <ChevronDown
                    size={18}
                    color="#8A8F98"
                    style={{
                      transition: "transform 200ms",
                      transform: isOpen ? "rotate(180deg)" : "none",
                    }}
                  />
                </button>
              </div>

              {isOpen && (
                <div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                  style={{
                    padding: "4px 20px 20px 48px",
                    background: "#FBFCFC",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", color: "#8A8F98" }}>
                      Wallet
                    </div>
                    <div
                      className="mt-1 flex items-center gap-2"
                      style={{ fontSize: "13px", color: "#1A1A1A" }}
                    >
                      <span className="font-mono">{c.wallet}</span>
                      <Copy size={13} color="#8A8F98" />
                      <Badge variant={statusVariant(c.walletStatus)}>
                        {c.walletStatus}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#8A8F98" }}>Email</div>
                    <div className="mt-1" style={{ fontSize: "13px", color: "#1A1A1A" }}>
                      {c.email}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5" style={{ fontSize: "12px", color: "#8A8F98" }}>
                      <Sparkles size={12} color="#0A9200" /> Agent last action
                    </div>
                    <div className="mt-1" style={{ fontSize: "13px", color: "#1A1A1A" }}>
                      {c.agentLast}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <Link
                      href="/portal/contractors/new"
                      style={{ fontSize: "13px", color: "#0550AE" }}
                    >
                      Edit contractor →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {rows.length === 0 && (
          <div
            className="text-center"
            style={{ padding: "48px 20px", fontSize: "14px", color: "#8A8F98" }}
          >
            No contractors match your search.
          </div>
        )}
      </Card>
    </div>
  );
}
