"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Card, Field, inputClass } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import { useCreateDefinition } from "@/lib/hooks/usePayroll";
import type { PayrollDefinition } from "@/lib/api";
import { CADENCE_LABEL } from "./PayrollDetail";

export default function CreatePayroll({
  canManage,
  first,
  onCancel,
  onCreated,
}: {
  canManage: boolean;
  first: boolean;
  onCancel?: () => void;
  onCreated: (id: string) => void;
}) {
  const create = useCreateDefinition();
  const [name, setName] = useState(first ? "Payroll" : "");
  const [cadence, setCadence] =
    useState<PayrollDefinition["cadence"]>("MONTHLY");
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-medium text-ink">
          {first ? "Create your payroll" : "New payroll"}
        </h3>
        {onCancel && (
          <Button
            variant="outline"
            size="icon"
            onClick={onCancel}
            aria-label="Cancel"
            className="h-8 w-8"
          >
            <X size={14} />
          </Button>
        )}
      </div>
      <p className="mt-1 text-[14px] leading-[1.5] text-muted">
        {first
          ? "A roster of contractors and what each is paid per run. You can change it any time; runs snapshot it."
          : "Another roster with its own cadence, say a weekly support team next to the monthly one. Each payroll runs on its own."}
      </p>
      {canManage ? (
        <form
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim())
              create.mutate(
                { name: name.trim(), cadence },
                { onSuccess: (d) => onCreated(d.id) },
              );
          }}
        >
          <Field label="Name">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              placeholder="Support team"
              autoFocus={!first}
            />
          </Field>
          <Field label="Cadence">
            <select
              className={inputClass}
              value={cadence}
              onChange={(e) =>
                setCadence(e.target.value as PayrollDefinition["cadence"])
              }
            >
              {(
                Object.keys(CADENCE_LABEL) as PayrollDefinition["cadence"][]
              ).map((c) => (
                <option key={c} value={c}>
                  {CADENCE_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>
          {create.isError && (
            <p className="text-[13.5px] text-[#A32D1C] sm:col-span-2">
              {(create.error as Error).message}
            </p>
          )}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={!name.trim() || create.isPending}>
              {create.isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : null}{" "}
              Create payroll
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-[14px] text-muted">
          Ask an owner or admin to set up the payroll.
        </p>
      )}
    </Card>
  );
}
