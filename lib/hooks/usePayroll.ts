"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { payrollApi } from "../api";
import { ME_KEY } from "./useMe";
import { CONTRACTORS_KEY, LEDGER_KEY } from "./usePayments";

export const DEFS_KEY = ["payroll", "definitions"] as const;
export const RUNS_KEY = ["payroll", "runs"] as const;

export function useDefinitions(archived = false) {
  return useQuery({
    queryKey: [...DEFS_KEY, archived ? "archived" : "active"],
    queryFn: () => payrollApi.definitions(archived),
    staleTime: 10_000,
  });
}
export function useRuns() {
  return useQuery({
    queryKey: RUNS_KEY,
    queryFn: payrollApi.runs,
    staleTime: 10_000,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return (...keys: readonly (readonly string[])[]) =>
    keys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
}

export function useCreateDefinition() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: payrollApi.createDefinition,
    onSuccess: () => inv(DEFS_KEY),
  });
}
export function useUpdateDefinition(definitionId: string) {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: (body: Parameters<typeof payrollApi.updateDefinition>[1]) =>
      payrollApi.updateDefinition(definitionId, body),
    onSuccess: () => inv(DEFS_KEY),
  });
}
/** Permanently delete; needs the emailed code (see useSendDeleteCode / useCheckDeleteCode). */
export function useDeleteDefinition() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) =>
      payrollApi.deleteDefinition(id, code),
    onSuccess: () => inv(DEFS_KEY, RUNS_KEY, CONTRACTORS_KEY),
  });
}
export function useArchiveDefinition() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: payrollApi.archiveDefinition,
    onSuccess: () => inv(DEFS_KEY),
  });
}
export function useRestoreDefinition() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: payrollApi.restoreDefinition,
    onSuccess: () => inv(DEFS_KEY),
  });
}
export function useSendDeleteCode() {
  return useMutation({ mutationFn: payrollApi.sendDeleteCode });
}
export function useCheckDeleteCode() {
  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) =>
      payrollApi.checkDeleteCode(id, code),
  });
}
export function useUpsertItem(definitionId: string) {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: (body: Parameters<typeof payrollApi.upsertItem>[1]) =>
      payrollApi.upsertItem(definitionId, body),
    onSuccess: () => inv(DEFS_KEY, CONTRACTORS_KEY),
  });
}
export function useRemoveItem(definitionId: string) {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: (itemId: string) => payrollApi.removeItem(definitionId, itemId),
    onSuccess: () => inv(DEFS_KEY, CONTRACTORS_KEY),
  });
}
export function useCreateRun() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: payrollApi.createRun,
    onSuccess: () => inv(RUNS_KEY),
  });
}
/** Approve then execute in one go; the backend enforces each step. */
export function useApproveAndExecute() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      await payrollApi.approve(id);
      return payrollApi.execute(id);
    },
    onSettled: () => inv(RUNS_KEY, ME_KEY, LEDGER_KEY, CONTRACTORS_KEY),
  });
}
export function useDiscardRun() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: payrollApi.discard,
    onSuccess: () => inv(RUNS_KEY),
  });
}
export function useExecuteRun() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: payrollApi.execute,
    onSettled: () => inv(RUNS_KEY, ME_KEY, LEDGER_KEY, CONTRACTORS_KEY),
  });
}
