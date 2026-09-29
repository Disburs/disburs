"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fundWallet, listContractors, listLedger, lookupContractor, payContractor } from "../api";
import { ME_KEY } from "./useMe";

export const LEDGER_KEY = ["ledger"] as const;

export function useLedger() {
  return useQuery({ queryKey: LEDGER_KEY, queryFn: listLedger, staleTime: 10_000 });
}

export const CONTRACTORS_KEY = ["contractors"] as const;

/** Contractors the active organization works with (on a roster or paid before). */
export function useContractors() {
  return useQuery({ queryKey: CONTRACTORS_KEY, queryFn: listContractors, staleTime: 10_000 });
}

export function useLookupContractor() {
  return useMutation({ mutationFn: lookupContractor });
}

/**
 * Look a contractor up as the email is typed. Runs only for a well-formed
 * email; a 404 is a normal answer ("nobody with that email"), so no retries.
 */
export function useContractorSearch(email: string) {
  const key = email.trim().toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
  return useQuery({
    queryKey: ["contractor-lookup", key],
    queryFn: () => lookupContractor(key),
    enabled: valid,
    retry: false,
    staleTime: 30_000,
  });
}

export function usePayContractor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: payContractor,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: LEDGER_KEY });
      qc.invalidateQueries({ queryKey: ME_KEY });
      qc.invalidateQueries({ queryKey: CONTRACTORS_KEY });
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
