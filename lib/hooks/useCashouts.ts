"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cashoutsApi } from "../api";

export const CASHOUTS_KEY = ["cashouts"] as const;

/** The signed-in contractor's cash-out requests, newest first. */
export function useCashouts() {
  return useQuery({ queryKey: CASHOUTS_KEY, queryFn: cashoutsApi.list, staleTime: 10_000 });
}

export function useRequestCashout() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: cashoutsApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: CASHOUTS_KEY }) });
}

export function useCancelCashout() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: cashoutsApi.cancel, onSuccess: () => qc.invalidateQueries({ queryKey: CASHOUTS_KEY }) });
}
