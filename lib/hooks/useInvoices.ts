"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoicesApi, type InvoiceStatus } from "../api";
import { RUNS_KEY } from "./usePayroll";

export const INVOICES_KEY = ["invoices"] as const;

/* contractor side */
export function useInvoiceOrganizations() {
  return useQuery({
    queryKey: [...INVOICES_KEY, "organizations"],
    queryFn: invoicesApi.organizations,
    staleTime: 60_000,
  });
}
export function useMyInvoices() {
  return useQuery({
    queryKey: [...INVOICES_KEY, "mine"],
    queryFn: invoicesApi.mine,
    staleTime: 10_000,
  });
}
export function useSubmitInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: invoicesApi.submit,
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICES_KEY }),
  });
}
export function useCancelInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: invoicesApi.cancel,
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICES_KEY }),
  });
}

/* organization side */
export function useOrgInvoices(status?: InvoiceStatus) {
  return useQuery({
    queryKey: [...INVOICES_KEY, "org", status ?? "all"],
    queryFn: () => invoicesApi.list(status),
    staleTime: 10_000,
  });
}
export function useDecideInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      id: string;
      decision: "approve" | "reject";
      note?: string;
    }) =>
      p.decision === "approve"
        ? invoicesApi.approve(p.id, p.note)
        : invoicesApi.reject(p.id, p.note),
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICES_KEY }),
  });
}
export function useDraftRunFromInvoices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: invoicesApi.draftRun,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVOICES_KEY });
      qc.invalidateQueries({ queryKey: RUNS_KEY });
    },
  });
}
