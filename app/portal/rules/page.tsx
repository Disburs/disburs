"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, PageTitle, inputClass } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useMe } from "@/lib/hooks/useMe";
import { useRules, useUpdateRules } from "@/lib/hooks/useRules";
import { MONEY_ROLES, type OrgRules, type OrgRulesUpdate } from "@/lib/api";
import { usdc } from "@/lib/format";

const AMOUNT = /^\d+(\.\d{1,7})?$/;
type Key = keyof OrgRulesUpdate;

const RULES: { key: Key; title: string; explain: string; example: string }[] = [
  {
    key: "autoApproveInvoiceUnder",
    title: "Auto-approve small invoices",
    explain:
      "An invoice under this amount is approved the moment it arrives, as long as it fits your limits below. You still choose when to pay it.",
    example: "200",
  },
  {
    key: "requireEvidenceAbove",
    title: "Require evidence on larger invoices",
    explain:
      "An invoice above this amount must carry an evidence link. Without one the contractor is told to add it and nothing reaches you.",
    example: "500",
  },
  {
    key: "monthlyBudget",
    title: "Monthly budget",
    explain:
      "The most you approve in a calendar month, counting invoices and milestones. Past it, approvals are refused until you raise the limit or the month ends.",
    example: "10000",
  },
  {
    key: "contractorMonthlyCap",
    title: "Per-contractor monthly cap",
    explain: "The most you approve for any one contractor in a calendar month.",
    example: "3000",
  },
];

/**
 * The organization's rules: limits and automatic decisions it sets once and
 * Disburs then applies the same way every time. Each rule is on when it has
 * an amount and off when it is empty.
 */
export default function RulesPage() {
  const { data: me } = useMe();
  const q = useRules();
  const canManage = Boolean(
    me?.organization?.role && MONEY_ROLES.includes(me.organization.role),
  );
  return (
    <div className="flex max-w-[760px] flex-col gap-5">
      <PageTitle sub="Set them once. Disburs applies them the same way every time, and records when a rule made the decision.">
        Rules
      </PageTitle>
      {q.isPending || !q.data ? (
        <Card>
          <span className="text-[14px] text-muted">Loading…</span>
        </Card>
      ) : (
        // Keyed on the saved values so a save reseeds the form.
        <Form
          key={JSON.stringify(q.data)}
          rules={q.data}
          canManage={canManage}
        />
      )}
    </div>
  );
}

function Form({ rules, canManage }: { rules: OrgRules; canManage: boolean }) {
  const save = useUpdateRules();
  const [draft, setDraft] = useState<Record<Key, string>>({
    autoApproveInvoiceUnder: rules.autoApproveInvoiceUnder ?? "",
    requireEvidenceAbove: rules.requireEvidenceAbove ?? "",
    monthlyBudget: rules.monthlyBudget ?? "",
    contractorMonthlyCap: rules.contractorMonthlyCap ?? "",
  });
  const valid = RULES.every(
    (r) => draft[r.key] === "" || AMOUNT.test(draft[r.key]),
  );
  const dirty = RULES.some((r) => draft[r.key] !== (rules[r.key] ?? ""));
  const submit = () => {
    const body: OrgRulesUpdate = {};
    for (const r of RULES)
      body[r.key] = draft[r.key] === "" ? null : draft[r.key];
    save.mutate(body, {
      onSuccess: () => toast.success("Rules saved"),
      onError: (e) =>
        toast.error("Could not save", { description: (e as Error).message }),
    });
  };
  const budget = rules.monthlyBudget ? Number(rules.monthlyBudget) : null;
  const used = Number(rules.approvedThisMonth);
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid && dirty) submit();
      }}
    >
      <Card tone="subtle">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="text-[14px] text-muted">Approved this month</span>
          <span className="tabular text-[20px] font-medium text-ink">
            ${usdc(used)}
            {budget !== null && (
              <span className="text-[14px] font-normal text-muted">
                {" "}
                of ${usdc(budget)}
              </span>
            )}
          </span>
        </div>
        {budget !== null && (
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
            aria-hidden
          >
            <div
              className={`h-full rounded-full ${used >= budget ? "bg-[#A32D1C]" : "bg-accent"}`}
              style={{
                width: `${Math.min(100, budget > 0 ? (used / budget) * 100 : 100)}%`,
              }}
            />
          </div>
        )}
      </Card>

      <Card padding={0}>
        <ul className="divide-y divide-line">
          {RULES.map((r) => {
            const on = draft[r.key] !== "";
            const bad = on && !AMOUNT.test(draft[r.key]);
            return (
              <li
                key={r.key}
                className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3 px-6 py-5"
              >
                <div className="max-w-[440px]">
                  <div className="flex items-center gap-2 text-[15px] font-medium text-ink">
                    {r.title}
                    <span
                      className={`text-[12px] font-normal ${on ? "text-accent" : "text-muted"}`}
                    >
                      {on ? "on" : "off"}
                    </span>
                  </div>
                  <p className="mt-1 text-[13.5px] leading-[1.55] text-muted">
                    {r.explain}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-muted">$</span>
                    <input
                      className={`${inputClass} tabular w-[132px] text-right`}
                      inputMode="decimal"
                      value={draft[r.key]}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          [r.key]: e.target.value.replace(/[^\d.]/g, ""),
                        })
                      }
                      placeholder={`e.g. ${r.example}`}
                      aria-label={r.title}
                      disabled={!canManage || save.isPending}
                    />
                    <span className="text-[13px] text-muted">USDC</span>
                  </div>
                  {bad && (
                    <p className="mt-1 text-right text-[12.5px] text-[#A32D1C]">
                      Enter an amount
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {canManage ? (
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={!valid || !dirty || save.isPending}>
            {save.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}{" "}
            Save rules
          </Button>
          <span className="text-[13px] text-muted">
            Leave a field empty to switch that rule off.
          </span>
        </div>
      ) : (
        <p className="text-[13px] text-muted">
          Only owners and admins can change the rules.
        </p>
      )}
    </form>
  );
}
