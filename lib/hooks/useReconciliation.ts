"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reconciliationApi } from "../api";
import { ME_KEY } from "./useMe";
import { LEDGER_KEY } from "./usePayments";
import { RUNS_KEY } from "./usePayroll";

export const RECON_KEY = ["reconciliation"] as const;

/** When the treasury was last checked against the chain, and open discrepancies. */
export function useReconciliation() {
  return useQuery({ queryKey: RECON_KEY, queryFn: reconciliationApi.status, staleTime: 15_000 });
}

/** Reconcile the treasury now; every view of money refetches afterwards. */
export function useReconcileNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reconciliationApi.run,
    onSettled: () => [RECON_KEY, ME_KEY, LEDGER_KEY, RUNS_KEY].forEach((k) => qc.invalidateQueries({ queryKey: k })),
  });
}

export function useResolveDiscrepancy() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: reconciliationApi.resolve, onSuccess: () => qc.invalidateQueries({ queryKey: RECON_KEY }) });
}
