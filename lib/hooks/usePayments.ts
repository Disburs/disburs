"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fundWallet, listLedger, lookupContractor, payContractor } from "../api";
import { ME_KEY } from "./useMe";

export const LEDGER_KEY = ["ledger"] as const;

export function useLedger() {
  return useQuery({ queryKey: LEDGER_KEY, queryFn: listLedger, staleTime: 10_000 });
}

export function useLookupContractor() {
  return useMutation({ mutationFn: lookupContractor });
}

export function usePayContractor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: payContractor,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: LEDGER_KEY });
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useFundWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fundWallet,
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}
